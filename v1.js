import ytdl from "ytdl-core";

export default async function handler(req, res) {
  const videoId = req.query.id; // contoh: ?id=VIDEO_ID
  if (!videoId) return res.status(400).json({status:"error", message:"Video ID missing"});

  const url = `https://www.youtube.com/watch?v=${videoId}`;

  // Jika query ?stream=1 → langsung stream audio
  if(req.query.stream === "1"){
    try {
      res.setHeader('Content-Type','audio/mpeg');
      ytdl(url, { filter: 'audioonly', quality: 'highestaudio' })
        .on('error', err=>{
          console.error("YTDL error:", err);
          res.status(500).send("Failed to stream audio");
        })
        .pipe(res);
      return;
    } catch(err){
      console.error(err);
      res.status(500).send("Failed to stream audio");
      return;
    }
  }

  // Default → return JSON info + link streaming
  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const duration = info.videoDetails.lengthSeconds;
    const author = info.videoDetails.author.name;

    const audioUrl = `https://${req.headers.host}/api/v1?id=${videoId}&stream=1`;

    res.status(200).json({
      status: "success",
      data: {
        title,
        duration: `${Math.floor(duration/60)}m ${duration%60}s`,
        author,
        videoUrl: url,
        audioUrl
      }
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({status:"error", message:"Failed to fetch video info"});
  }
}
