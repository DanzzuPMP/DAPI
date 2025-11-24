export default async function handler(req, res) {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Parameter 'query' wajib diisi. Contoh: ?query=Infinix Note 40"
      });
    }

    const url = `https://api.zenzxz.my.id/api/search/gsmarena?query=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const json = await response.json();

    if (!json?.success) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data dari API."
      });
    }

    const d = json.data;
    const prices = d.prices || {};
    const specs = d.specs || {};

    return res.status(200).json({
      success: true,
      phoneName: d.phoneName,
      imageUrl: d.imageUrl,
      prices: {
        IDR: prices.IDR || "-",
        USD: prices.USD || "-",
        EUR: prices.EUR || "-"
      },
      specs: specs
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
      error: e.message
    });
  }
        }
