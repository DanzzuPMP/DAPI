import axios from "axios";

export default async function handler(req, res) {
  try {
    const { q } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Parameter 'query' wajib diisi. Contoh: ?q=stereo love 9d"
      });
    }

    // Request ke API Yupra
    const apiUrl = `https://api.yupra.my.id/api/search/youtube?q=${encodeURIComponent(query)}`;
    const fetchRes = await axios.get(apiUrl);
    const json = fetchRes.data;

    if (!json.status || !json.results || json.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tidak ada hasil pencarian."
      });
    }

    // Ambil 3 hasil teratas
    const hasil = json.results.slice(0, 3).map((v, i) => ({
      index: i + 1,
      title: v.title,
      duration: v.duration,
      channel: v.channel,
      url: v.url
    }));

    return res.status(200).json({
      success: true,
      query: json.query,
      results: hasil
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Terjadi error saat mengambil data.",
      error: err.message
    });
  }
      }
