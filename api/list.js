import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const apiDir = path.join(process.cwd(), "api");

    function scan(dirPath, base = "/api") {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      let results = [];

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          results.push({
            type: "folder",
            name: entry.name,
            path: `${base}/${entry.name}`,
            children: scan(fullPath, `${base}/${entry.name}`)
          });
        } else if (entry.isFile() && entry.name.endsWith(".js")) {
          results.push({
            type: "file",
            name: entry.name.replace(".js", ""),
            endpoint: `${base}/${entry.name.replace(".js", "")}`
          });
        }
      }

      return results;
    }

    const tree = scan(apiDir);

    return res.status(200).json({
      success: true,
      tree
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
