import ytdl from "ytdl-core";

export default async function handler(req, res) {
  const videoId = req.query.id; // contoh: ?id=VIDEO_ID
  if (!videoId) return res.status(400).json({ status: "error", message: "Video ID missing" });

  const url = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    // ambil info video
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

    // set headers download MP3
    res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
    res.setHeader('Content-Type', 'audio/mpeg');

    // stream audio dari YouTube → MP3
    ytdl(url, { filter: 'audioonly', quality: 'highestaudio' }).pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Failed to download video" });
  }
}
