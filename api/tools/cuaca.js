import fetch from "node-fetch";

export default async function handler(req, res) {
    try {
        const { lokasi } = req.query;

        if (!lokasi) {
            return res.status(400).json({
                success: false,
                message: "Parameter 'lokasi' wajib diisi. Contoh: ?lokasi=Bandung"
            });
        }

        const url = `https://api.ootaizumi.web.id/lokasi/cuaca?lokasi=${encodeURIComponent(lokasi)}`;
        const r = await fetch(url);
        const j = await r.json();

        if (!j?.status) {
            return res.status(500).json({
                success: false,
                message: "Gagal mengambil data cuaca dari server"
            });
        }

        const d = j.result;
        const lo = d.lokasi;
        const cu = d.cuaca;

        return res.status(200).json({
            success: true,
            lokasi: {
                provinsi: lo.provinsi,
                kotkab: lo.kotkab,
                kecamatan: lo.kecamatan,
                desa: lo.desa
            },
            cuaca: {
                waktu: cu.waktu,
                deskripsi: cu.deskripsi,
                suhu: cu.suhu,
                kelembapan: cu.kelembapan,
                tutupanAwan: cu.tutupanAwan,
                jarakPandang: cu.jarakPandang.teks
            },
            angin: cu.angin,
            link_bmkg: d.url.bmkg
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server",
            error: e.message
        });
    }
          }
