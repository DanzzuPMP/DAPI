export default async function handler(req, res) {
  try {
    const { host, port } = req.query;

    if (!host) {
      return res.status(400).json({
        success: false,
        message: "Parameter 'host' wajib diisi. Contoh: ?host=example.com&port=19132"
      });
    }

    const finalPort = port || 19132; // default port bedrock

    const apiUrl = `https://api.mcstatus.io/v2/status/bedrock/${host}:${finalPort}`;
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
      edition: json.edition,
      software: json.software,
      plugins: json.plugins
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil status server.",
      error: err.message
    });
  }
      }
