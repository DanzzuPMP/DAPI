import axios from "axios";

export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "Parameter 'url' wajib diisi."
      });
    }

    // Ambil metadata lagu
    const detail = await axios.get(
      "https://spotdown.org/api/song-details",
      {
        params: { url: encodeURIComponent(url) },
        headers: {
          origin: "https://spotdown.org",
          referer: "https://spotdown.org/",
          "user-agent":
            "Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36",
        },
      }
    );

    const song = detail.data.songs?.[0];
    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Track tidak ditemukan."
      });
    }

    // Download audio (buffer)
    const audioReq = await axios.post(
      "https://spotdown.org/api/download",
      { url: song.url },
      {
        headers: {
          origin: "https://spotdown.org",
          referer: "https://spotdown.org/",
          "user-agent":
            "Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36",
        },
        responseType: "arraybuffer",
      }
    );

    // Convert buffer → base64 agar bisa dikirim via JSON
    const audioBase64 = Buffer.from(audioReq.data).toString("base64");

    return res.status(200).json({
      success: true,
      metadata: {
        title: song.title,
        artist: song.artist,
        duration: song.duration,
        cover: song.thumbnail,
        url: song.url,
      },
      audio: audioBase64, // kamu bisa decode lagi jadi file
      mimetype: "audio/mpeg"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Gagal memproses permintaan."
    });
  }
          }
