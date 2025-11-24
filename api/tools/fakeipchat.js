export default async function handler(req, res) {
  try {
    const { text, time, battery, carrier, emoji } = req.query;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Parameter 'text' wajib diisi. Contoh: ?text=hello world"
      });
    }

    // Default value (jika user tidak set)
    const params = new URLSearchParams({
      time: time || "12.00",
      batteryPercentage: battery || "90",
      carrierName: carrier || "AXIS",
      emojiStyle: emoji || "apple",
      messageText: text
    });

    const imageUrl = `https://brat.siputzx.my.id/iphone-quoted?${params.toString()}`;

    return res.status(200).json({
      success: true,
      message: "Berhasil membuat fake iPhone chat.",
      image: imageUrl
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
      error: err.message
    });
  }
}
