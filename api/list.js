import path from "path";
import fs from "fs";

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "api", "routes.json");
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);

    res.status(200).json({
      success: true,
      routes: data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
