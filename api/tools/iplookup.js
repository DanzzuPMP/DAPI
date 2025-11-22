import axios from "axios";

export default async function handler(req, res) {
  const ip = req.query.ip;

  if (!ip) {
    return res.status(400).json({
      success: false,
      message: "Parameter 'ip' wajib diisi. Contoh: ?ip=8.8.4.4"
    });
  }

  try {
    const url = `https://ipwho.is/${encodeURIComponent(ip)}`;
    const response = await axios.get(url);

    // response.data sudah sama persis format ipwho.is
    return res.status(200).json(response.data);

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data IP",
      error: err.message
    });
  }
}
