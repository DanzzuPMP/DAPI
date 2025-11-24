export default async function handler(req, res) {
  try {
    const { host, port } = req.query;

    if (!host) {
      return res.status(400).json({
        success: false,
        message: "Parameter 'host' wajib diisi. Contoh: ?host=alwination.id&port=25565"
      });
    }

    const finalPort = port || 25565; // default port Java Edition

    const apiUrl = `https://api.mcstatus.io/v2/status/java/${host}:${finalPort}`;
    const r = await fetch(apiUrl);
    const json = await r.json();

    return res.status(200).json({
      success: true,
      host: json.host,
      port: json.port,
      online: json.online,
      ip_address: json.ip_address,
      version: json.version,
      players: json.players,
      motd: json.motd,
      icon: json.icon || null,
      srv_record: json.srv_record || null,
      mods: json.mods || [],
      software: json.software || null,
      plugins: json.plugins || []
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil status server Minecraft Java.",
      error: err.message
    });
  }
                                }
