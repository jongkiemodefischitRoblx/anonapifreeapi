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
    // Ambil info video
    const info = await ytdl.getInfo(videoId);
    const videoDetails = info.videoDetails;

    // Ambil audio format mp3/audio only
    const audioFormat = ytdl.filterFormats(info.formats, "audioonly")[0];

    if (!audioFormat) {
      return res.status(500).json({
        status: "error",
        message: "Tidak dapat mengambil audio dari video ini"
      });
    }

    // Response JSON untuk API publik
    return res.status(200).json({
      status: "success",
      data: {
        title: videoDetails.title,
        author: videoDetails.author.name,
        duration: videoDetails.lengthSeconds + "s",
        videoUrl: `https://www.youtube.com/watch?v=${videoDetails.videoId}`,
        audioUrl: audioFormat.url
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Gagal mengambil video / MP3. Pastikan video valid dan public."
    });
  }
      }
