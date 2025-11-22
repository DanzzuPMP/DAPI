// FILE: /api/tools.js
import axios from "axios";

export default async function handler(req, res) {
  try {
    const { txt2image } = req.query;

    if (!txt2image)
      return res.status(400).json({ error: "Missing ?txt2image=" });

    const prompt = txt2image;
    const aspect = req.query.aspect || "Square";

    // 1. Ambil token Turnstile
    const fgsi = await axios.get(
      "https://fgsi.dpdns.org/api/tools/cfclearance/turnstile-min",
      {
        params: {
          apikey: process.env.FGSI_APIKEY,
          url: "https://raphael.app",
          sitekey: "0x4AAAAAAA5Sq0S5dntDaacq"
        }
      }
    );

    const turnstileToken = fgsi.data?.data?.token;
    if (!turnstileToken)
      return res.status(500).json({ error: "Failed to get Turnstile token" });

    // 2. Generate Image
    const raphael = await axios.post(
      "https://raphael.app/api/generate-image",
      {
        prompt,
        aspect,
        isSafeContent: true,
        autoTranslate: true,
        highQuality: false,
        turnstileToken
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    let output = [];

    if (Array.isArray(raphael.data)) {
      output = raphael.data.map((item) => ({
        ...item,
        url: "https://raphael.app" + item.url,
      }));
    } else {
      const lines = raphael.data
        .trim()
        .split("\n")
        .filter((x) => x.trim().length > 0);

      output = lines.map((line) => {
        const obj = JSON.parse(line);
        obj.url = "https://raphael.app" + obj.url;
        return obj;
      });
    }

    return res.status(200).json({
      success: true,
      prompt,
      results: output,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
        }
