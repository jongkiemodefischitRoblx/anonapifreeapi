// File: api/v1.js
import ytdl from "ytdl-core";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Parameter 'id' wajib diisi. Contoh: ?id=VIDEO_ID"
    });
  }

  let videoId = id;

  try {
    // Ambil info video dengan try-catch
    const info = await ytdl.getInfo(videoId).catch(() => null);
    if (!info) {
      return res.status(404).json({
        status: "error",
        message: "Video tidak ditemukan atau private"
      });
    }

    const videoDetails = info.videoDetails;

    // Ambil audio-only paling ringan
    let audioFormat = null;
    try {
      audioFormat = ytdl.filterFormats(info.formats, "audioonly")
                        .find(f => f.audioBitrate && f.url);
      if (!audioFormat) throw new Error();
    } catch {
      return res.status(500).json({
        status: "error",
        message: "Audio tidak bisa diambil, coba video lain"
      });
    }

    // Response JSON
    return res.status(200).json({
      status: "success",
      data: {
        title: videoDetails.title,
        author: videoDetails.author.name,
        duration: videoDetails.lengthSeconds + "s",
        audioUrl: audioFormat.url
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Gagal mengambil audio. Pastikan video valid, publik, dan bukan live/Shorts durasi terlalu panjang."
    });
  }
}
