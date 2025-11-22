import axios from "axios";

export default async function handler(req, res) {
  try {
    const { npm, key } = req.query;

    // ===== SECRET KEY VALIDATION =====
    const SECRET_KEY = process.env.INSTALL_SECRET_KEY;

    if (!SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: "INSTALL_SECRET_KEY belum di-set di environment Vercel"
      });
    }

    if (!key || key !== SECRET_KEY) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak! Key tidak valid."
      });
    }

    // ===== NPM PARAM VALIDATION =====
    if (!npm) {
      return res.status(400).json({
        success: false,
        message: "Parameter ?npm=<package> wajib diisi"
      });
    }

    // ====== CONFIG ======
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO_OWNER = "DanzzuPMP";
    const REPO_NAME = "DAPI";
    const BRANCH = "main";
    const PACKAGE_JSON_PATH = "package.json";

    if (!GITHUB_TOKEN) {
      return res.status(500).json({
        success: false,
        message: "GITHUB_TOKEN belum di-set di environment Vercel"
      });
    }

    // ======================================================
    // 1. CEK PACKAGE DI NPM
    // ======================================================
    try {
      await axios.get(`https://registry.npmjs.org/${npm}`);
    } catch {
      return res.status(404).json({
        success: false,
        message: `Package '${npm}' tidak ditemukan di npm registry`
      });
    }

    // ======================================================
    // 2. Ambil package.json dari GitHub
    // ======================================================
    const fileReq = await axios.get(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PACKAGE_JSON_PATH}?ref=${BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const sha = fileReq.data.sha;
    const content = Buffer.from(fileReq.data.content, "base64").toString("utf8");

    let pkg = JSON.parse(content);

    // ======================================================
    // 3. Tambahkan dependency ke package.json
    // ======================================================
    if (!pkg.dependencies) pkg.dependencies = {};
    pkg.dependencies[npm] = "latest";

    const newContent = Buffer.from(JSON.stringify(pkg, null, 2)).toString("base64");

    // ======================================================
    // 4. Commit ke GitHub
    // ======================================================
    await axios.put(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PACKAGE_JSON_PATH}`,
      {
        message: `Add dependency: ${npm}`,
        content: newContent,
        sha,
        branch: BRANCH,
      },
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    // ======================================================
    // DONE
    // ======================================================
    return res.status(200).json({
      success: true,
      message: `Berhasil menambahkan package '${npm}'`,
      package: npm,
      updatedDependencies: pkg.dependencies
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
        }
