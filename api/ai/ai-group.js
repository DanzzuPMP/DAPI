import axios from "axios";

export default async function handler(req, res) {
  try {
    const { query, model } = req.query;

    if (!query || !model) {
      return res.status(400).json({
        success: false,
        message: "Parameter 'query' dan 'model' wajib diisi."
      });
    }

    // Request ke API Zenzxz
    const api = await axios.get("https://api.zenzxz.my.id/api/ai/chatai", {
      params: { query, model }
    });

    const data = api.data;

    // Hapus statusCode & creator
    return res.status(200).json({
      success: true,
      data: {
        model: data.data.model,
        question: data.data.question,
        answer: data.data.answer
      },
      timestamp: data.timestamp
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Gagal memproses permintaan.",
      error: err.message
    });
  }
}
