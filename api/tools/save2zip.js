import axios from "axios";

export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "Parameter 'url' wajib diisi"
      });
    }

    const api = await axios.get(
      "https://api.nekolabs.web.id/tools/web2zip",
      { params: { url } }
    );

    return res.status(200).json(api.data);

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Gagal memproses permintaan",
      error: err.message
    });
  }
}
