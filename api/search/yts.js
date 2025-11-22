import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { q } = req.query; // <-- pakai ?q=
    if (!q) {
      return res.status(400).json({
        status: false,
        message: "Parameter 'q' wajib diisi. Contoh: ?q=stereo love"
      });
    }

    const api = `https://api.yupra.my.id/api/search/youtube?q=${encodeURIComponent(q)}`;
    const result = await fetch(api);
    const json = await result.json();

    if (!json.status || !json.results || json.results.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Tidak ada hasil ditemukan."
      });
    }

    // Ambil 5 hasil
    const hasil5 = json.results.slice(0, 5);

    return res.status(200).json({
      status: true,
      query: q,
      totalResults: hasil5.length,
      results: hasil5
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Server error.",
      error: err.message
    });
  }
}
