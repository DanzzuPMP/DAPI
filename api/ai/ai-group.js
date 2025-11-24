import axios from "axios";

const availableModels = [
  "llama-v3p1-405b-instruct",
  "llama-v3p1-8b-instruct",
  "gemma-3-27b-it",
  "codegemma-7b",
  "mistral-small-24b-instruct-2501",
  "mistral-nemo-instruct-2407",
  "mixtral-8x22b-instruct",
  "phi-3-vision-128k-instruct",
  "phi-3-mini-128k-instruct",
  "qwen3-235b-a22b-thinking-2507",
  "qwen3-coder-480b-a35b-instruct",
  "qwen3-235b-a22b-instruct-2507",
  "deeps﻿eek-v3",
  "deeps﻿eek-r1",
  "gpt-oss-120b",
  "gpt-oss-20b",
  "kimi-k2-instruct",
  "llama4-maverick-instruct-basic"
];

export default async function handler(req, res) {
  try {
    const { query, model } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Parameter 'query' wajib diisi."
      });
    }

    // Jika model tidak diisi → kasih list model
    if (!model) {
      return res.status(400).json({
        success: false,
        message: "Parameter 'model' wajib diisi.",
        availableModels
      });
    }

    // Jika model salah → kasih peringatan + list model
    if (!availableModels.includes(model)) {
      return res.status(400).json({
        success: false,
        message: `Model '${model}' tidak ditemukan.`,
        availableModels
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
