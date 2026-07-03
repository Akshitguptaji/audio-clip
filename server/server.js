const express = require("express");
const downloads = new Map();
const youtubedl = require("youtube-dl-exec");
const mysql = require("mysql2");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const http = require("http");
const { spawn } = require("child_process");
const { Server } = require("socket.io");
// const { start } = require("repl");
// const youtubedl = require("youtube-dl-exec");
app.use(cors());
require("dotenv").config();
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Akshit@123",
  database: "lyric",
});
// await youtubedl(url,{
//     extractAudio:true,
//     audioFormat:"mp3",
//     output:"uploads/%(id)s.%(ext)s"
// })
connection.connect(() => {
  console.log("connect hogya hai ");

  console.log(typeof youtubedl.exec);
});
connection.query("USE lyric;");

app.use(express.json());
app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res, path) => {
      if (path.endsWith(".mp3")) {
        res.setHeader("Content-Type", "audio/mpeg");
      }
    },
  }),
);
const authenticatetoken = (req, res, next) => {
  const authheader = req.headers["authorization"];
  console.log("Header mila:", authheader);
  const token = authheader && authheader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    console.log("Token:", token);
    console.log("JWT Error:", err);
    console.log("Decoded User:", user);
    if (err) return res.sendStatus(403);
    // console.log("run");
    req.user = user;

    next();
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Agar route 'register' hai toh profiles mein, warna music mein
    const folder = req.url.includes("register")
      ? "uploads/profiles"
      : "uploads/music";
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
// // 1. Profile Upload Storage
// const profileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = "uploads/profiles/";
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); // Folder create karo
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, "pfp_" + uuidv4() + path.extname(file.originalname));
//   },
// });

// // 2. Music Upload Storage
// const musicStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = "uploads/music/";
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, uuidv4() + path.extname(file.originalname));
//   },
// });

// Middlewares
// const uploadProfile = multer({ storage: profileStorage });
// const uploadMusic = multer({ storage: musicStorage });

const profileUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Sirf image files allowed hain!"), false);
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 },
});
const musicUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(new Error("Sirf audio files allowed hain!"), false);
    }
  },
});

["uploads", "uploads/profiles", "uploads/music"].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client Connected:", socket.id);

  socket.on("cancelDownload", () => {
    const subprocess = downloads.get(socket.id);

    if (!subprocess) {
      console.log("No active download.");

      return;
    }

    console.log("Cancelling Download...");

    subprocess.kill();

    downloads.delete(socket.id);

    socket.emit("downloadCancelled", {
      message: "Download Cancelled",
    });
  });

  socket.on("disconnect", () => {
    const activeDownload = downloads.get(socket.id);

    if (activeDownload) {
      activeDownload.kill();
    }
    downloads.delete(socket.id);

    console.log("Client Disconnected:", socket.id);
  });
});
// io.on("connection", (socket) => {
//   console.log("Client Connected:", socket.id);
//   socket.on("ping", () => {
//     console.log("Ping received from:", socket.id);
//   });

//   socket.on("disconnect", () => {
//     console.log("Client Disconnected:", socket.id);
//   });
// });
app.post(
  "/api/upload-file",
  authenticatetoken,
  musicUpload.single("music"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Please upload a file.",
        });
      }
      console.log("User uploaded a file");
      //  const {  start_time, end_time } = req.body;
      const filename = req.file ? req.file.filename : null; // Agar file nahi mili toh null
      const userId = req.user ? req.user.userID : null;
      // const userId = req.user.userID;
      // const fileName = req.file.filename;
      const title =
        req.body.title && req.body.title.trim() !== ""
          ? req.body.title.trim()
          : path.parse(req.file.originalname).name;
      const filePath = req.file.path.replace(/\\/g, "/");
      const startTime = req.body.start_time || null;
      const endTime = req.body.end_time || null;

      connection.query(
        "INSERT INTO clips (title,video_url,start_time,end_time,user_id,file_size) VALUES (?,?,?, ?, ?,?)",

        [title, filename, startTime, endTime, userId, req.file.size],
        (err, result) => {
          if (err) {
            console.log("Database entry fail:", err);

            return res.status(500).send("Database mein save nahi hua");
          }
          console.log("File received:", req.file);

          return res.status(200).json({
            message: "File uploaded successfully!",
          });
        },
      );
      //   } else if (req.body.youtubeUrl) {
      //     console.log("YouTube URL:", req.body.youtubeUrl);
      //     return res.status(200).json({
      //       message: "YouTube URL received",
      //       url: req.body.youtubeUrl,
      //     });
      //     // Yahan baad me yt-dlp ka code aayega
      //   } else {
      //     return res.status(400).json({
      //       message: "Please upload a file or provide a YouTube URL.",
      //     });
    } catch (err) {
      res.status(500).send("Upload failed");
    }
  },
);

// app.post("/api/upload-youtube", authenticatetoken, async (req, res) => {
//   try {
//     const { youtubeUrl, title } = req.body;
//     const userId = req.user.userID;
//     if (!youtubeUrl) {
//       return res.status(400).json({
//         message: "YouTube URL is required",
//       });
//     }
//     if (
//       !youtubeUrl.includes("youtube.com") &&
//       !youtubeUrl.includes("youtu.be")
//     ) {
//       return res.status(400).json({
//         message: "Invalid YouTube URL",
//       });
//     }
//     const uniqueName = uuidv4();

//     const outputPath = path.join(__dirname, "uploads", uniqueName + ".mp3");
//     console.log("Downloading:", youtubeUrl);
//     let info;
//     try {
//       info = await youtubedl(youtubeUrl, {
//         dumpSingleJson: true,
//         noDownload: true,
//       });
//     } catch (err) {
//       return res.status(400).json({
//         message: "Invalid or unavailable YouTube video.",
//       });
//     }
//     console.log("YouTube URL:", youtubeUrl);

//     console.log("Download completed.");
//     const finalTitle = title && title.trim() !== "" ? title.trim() : info.title;

//     try {

//       const subprocess = youtubedl.exec(youtubeUrl, {
//         extractAudio: true,
//         audioFormat: "mp3",
//         output: outputPath,
//       });
//       subprocess.stdout.on("data", (data) => {
//         console.log(data.toString());
//       });
//       console.log(subprocess);
//     }
//     subprocess.on("close", (code) => {

//   console.log("Download Finished:", code);

//       connection.query(
//     `INSERT INTO clips
//       (title, video_url, start_time, end_time, user_id)
//       VALUES (?, ?, ?, ?, ?)`,
//     [finalTitle, uniqueName + ".mp3", null, null, userId],
//     (err) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).json({
//           message: "Database Error",
//         });
//       }
// return res.json({
//         message: "YouTube audio imported successfully.",
//       });
//     }
//   );

// });

//     catch (err) {
//       console.error(err);

//       return res.status(400).json({
//         message: "Unable to download this video.",
//       });
//     }
//     connection.query(
//       `INSERT INTO clips
//         (title, video_url, start_time, end_time, user_id)
//         VALUES (?, ?, ?, ?, ?)`,
//       [finalTitle, uniqueName + ".mp3", null, null, userId],
//       (err) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).json({
//             message: "Database Error",
//           });
//         }
//         return res.json({
//           message: "YouTube audio imported successfully.",
//         });
//       },
//     );
//   } catch (err) {
//     console.error(err);

//     return res.status(500).json({
//       message: "Server Error",
//     });
//   }
// });
app.post("/api/upload-youtube", authenticatetoken, async (req, res) => {
  try {
    const { youtubeUrl, title, socketId } = req.body;
    const userId = req.user.userID;

    if (!youtubeUrl) {
      return res.status(400).json({
        message: "YouTube URL is required",
      });
    }

    if (
      !youtubeUrl.includes("youtube.com") &&
      !youtubeUrl.includes("youtu.be")
    ) {
      return res.status(400).json({
        message: "Invalid YouTube URL",
      });
    }

    // Unique filename
    const uniqueName = uuidv4();
    const outputPath = path.join(
      __dirname,
      "uploads",
      "music",
      uniqueName + ".mp3",
    );

    console.log("Downloading:", youtubeUrl);

    // Get video info
    let info;

    try {
      info = await youtubedl(youtubeUrl, {
        dumpSingleJson: true,
        noDownload: true,
      });
    } catch (err) {
      return res.status(400).json({
        message: "Invalid or unavailable YouTube video.",
      });
    }

    const finalTitle = title && title.trim() !== "" ? title.trim() : info.title;
    const thumbnail = `https://i.ytimg.com/vi/${info.id}/maxresdefault.jpg`;
    const duration = info.duration;

    io.to(socketId).emit("downloadStart", {
      title: finalTitle,
      thumbnail: thumbnail,
      duration: duration,
    });
    console.log("Video Title:", finalTitle);

    const startTime = Date.now();
    // Start download
    // const subprocess = youtubedl.exec(youtubeUrl, {
    //   extractAudio: true,
    //   audioFormat: "mp3",
    //   output: outputPath,
    // });
    const ytDlpPath = path.join(
      __dirname,
      "node_modules",
      "youtube-dl-exec",
      "bin",
      "yt-dlp.exe",
    );
    const subprocess = spawn(
      ytDlpPath,
      [
        youtubeUrl,
        "--extract-audio",
        "--audio-format",
        "mp3",
        "--output",
        outputPath,
      ],
      {
        shell: true,
      },
    );
    downloads.set(socketId, subprocess);

    // Progress Logs
    subprocess.stdout.on("data", (data) => {
      const text = data.toString();

      console.log(text);
      const match = text.match(
        /\[download\]\s+(\d+(?:\.\d+)?)%\s+of\s+(.+?)\s+at\s+(.+?)\s+ETA\s+(.+)/,
      );
      if (match) {
        const progress = Number(match[1]);
        const totalSize = match[2];
        const speed = match[3];

        const eta = match[4];
        const downloaded = ((progress / 100) * parseFloat(totalSize)).toFixed(
          2,
        );

        const downloadedText = `${downloaded} MB`;
        console.log("sending", progress);

        io.to(socketId).emit("downloadProgress", {
          progress,
          speed,
          eta,
          downloaded: downloadedText,

          total: totalSize,
          elapsed: Math.floor((Date.now() - startTime) / 1000) + " sec",
        });
      }
    });

    // subprocess.stdout.on("data", (data) => {
    //   const text = data.toString();
    //   console.log(text);
    //   const match = text.match(/\[download\]\s+(\d+(?:\.\d+)?)%/);

    //   if (match) {
    //     const progress = Number(match[1]);

    //     io.to(socketId).emit("downloadProgress", {
    //       progress,
    //     });
    //   }
    // });

    // Download Finished
    subprocess.on("close", (code) => {
      downloads.delete(socketId);
      console.log("Download Finished:", code);

      if (code !== 0) {
        console.log("Download Cancelled");
        const webmPath = outputPath.replace(".mp3", ".webm");
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
        if (fs.existsSync(webmPath)) {
          fs.unlinkSync(webmPath);
        }
        io.to(socketId).emit("downloadCancelled", {
          message: "Download Cancelled",
        });
        return;
      }
      const stats = fs.statSync(outputPath);

      const fileSize = stats.size;
      connection.query(
        `INSERT INTO clips
        (title, video_url, start_time, end_time, user_id,file_size)
        VALUES (?, ?, ?, ?,?, ?)`,
        [finalTitle, uniqueName + ".mp3", null, null, userId, fileSize],
        (err) => {
          if (err) {
            console.log(err);

            return res.status(500).json({
              message: "Database Error",
            });
          }
          io.to(socketId).emit("downloadComplete", {
            title: finalTitle,
            message: "Import Successful",
          });
          return res.status(200).json({
            message: "YouTube audio imported successfully.",
          });
        },
      );
    });

    subprocess.on("error", (err) => {
      console.error(err);
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Server Error",
    });
  }
});
app.post(
  "/api/register",
  profileUpload.single("profile_pic"),
  async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const profile_pic = req.file ? req.file.filename : null;
      const hashed_password = await bcrypt.hash(password, 10);
      const query =
        "insert into users(username,email,password,profile_pic) values(?,?,?,?)";
      connection.execute(
        query,
        [username, email, hashed_password, profile_pic],
        (err, result) => {
          if (err) return res.status(500).send("Database Error");
          res
            .status(201)
            .send({ message: "User registered", userID: result.insertId });
        },
      );
    } catch (error) {
      res.status(500).send("Server Error");
    }
  },
);

// app.post("/api/upload", musicUpload.single("music"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send("Music file nahi mili!");
//     }

//     const { start_time, end_time } = req.body;
//     const music_filename = req.file.filename;

//     // Auth middleware se milne wala user ID (assuming tumne JWT setup kiya hai)
//     const userId = req.user.id;

//     const query =
//       "INSERT INTO clips (user_id, video_url, start_time, end_time) VALUES (?, ?, ?, ?)";

//     connection.execute(
//       query,
//       [userId, music_filename, start_time, end_time],
//       (err, result) => {
//         if (err) {
//           console.error("DB Error:", err);
//           return res.status(500).send("Upload failed");
//         }
//         res.status(201).send({
//           message: "Music uploaded successfully",
//           clipID: result.insertId,
//         });
//       },
//     );
//   } catch (error) {
//     console.error("Server Error:", error);
//     res.status(500).send("Server Error");
//   }
// });
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "select * from users where email=?";
  connection.execute(sql, [email], async (err, result) => {
    if (err) return res.send("error aagya");
    if (result.length === 0) return res.send("user not found");
    const user = result[0];
    console.log(user);
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.send("password incorrect");
    }

    const token = jwt.sign({ userID: user.id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({
      message: "login done",
      token: token,
    });
  });
});

app.get("/api/clips", authenticatetoken, (req, res) => {
  const userId = req.user.userID;
  const query = "select *  from clips where user_id=?  order by id desc;";

  connection.execute(query, [userId], (err, result) => {
    if (err) {
      res.send("bhai error aagya hai");
    } else {
      res.status(200).json(result);
    }
  });
});

app.post("/api/clips/:id", authenticatetoken, (req, res) => {
  const clipId = req.params.id;
  const userId = req.user.userID;
  const { start, end } = req.body;
  // console.log(typeof start, start);
  // console.log(typeof end, end);
  console.log(req.body);
  const sql =
    "UPDATE clips SET start_time = ?, end_time = ? WHERE id = ? AND user_id = ?";
  connection.execute(sql, [start, end, clipId, userId], (err, result) => {
    if (err) {
      res.send("error hai");
      console.log(err);
    } else {
      console.log(result);
      res.status(200).send("Timestamp update ho gaya!");
    }
  });
});

app.delete("/api/clips/:id", authenticatetoken, (req, res) => {
  console.log("hit");
  const clipId = req.params.id;
  const userId = req.user.userID;

  // Pehle file ka naam nikalo
  connection.query(
    "SELECT video_url FROM clips WHERE id = ? AND user_id = ?",
    [clipId, userId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database Error" });
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "Clip not found",
        });
      }

      const fileName = result[0].video_url;

      // Database se delete
      connection.query(
        "DELETE FROM clips WHERE id = ? AND user_id = ?",
        [clipId, userId],
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              message: "Delete failed",
            });
          }

          // Uploads folder se file delete
          // const filePath = path.join(__dirname, "uploads", fileName);

          const filePath = path.join(__dirname, "uploads", "music", fileName);
          fs.unlink(filePath, (err) => {
            if (err) {
              console.warn("File delete nahi hui:", err.message);
            } else {
              console.log("File deleted:", fileName);
            }
          });

          res.json({
            message: "Clip deleted successfully",
          });
        },
      );
    },
  );
});

app.get("/api/download/:id", authenticatetoken, (req, res) => {
  const clipId = req.params.id;
  const userId = req.user.userID;

  connection.query(
    "SELECT title, video_url FROM clips WHERE id=? AND user_id=?",
    [clipId, userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Database Error",
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "Clip not found",
        });
      }

      const file = result[0];
      const filePath = path.join(__dirname, "uploads", "music", file.video_url);
      // const filePath = path.join(__dirname, "uploads", file.video_url);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          message: "File not found",
        });
      }

      res.download(filePath, file.title + ".mp3");
    },
  );
});

app.post("/api/download-clip/:id", authenticatetoken, (req, res) => {
  const clipId = req.params.id;
  const userId = req.user.userID;

  connection.query(
    `
      SELECT
      title,
      video_url,
      start_time,
      end_time
      FROM clips
      WHERE id=?
      AND user_id=?
      `,
    [clipId, userId],

    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Database Error",
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "Clip not found",
        });
      }

      const clip = result[0];
      const inputPath = path.join(
        __dirname,
        "uploads",
        "music",
        clip.video_url,
      );
      // const inputPath = path.join(__dirname, "uploads", clip.video_url);

      if (!fs.existsSync(inputPath)) {
        return res.status(404).json({
          message: "File Missing",
        });
      }

      const outputName = uuidv4() + "_clip.mp3";

      const outputPath = path.join(__dirname, "uploads", outputName);

      const { start, end } = req.body;
      // const start = Number(clip.start_time ?? 0);
      // const end = Number(clip.end_time ?? 10);

      const ffmpeg = spawn("ffmpeg", [
        "-y",

        "-i",
        inputPath,

        "-ss",
        String(start),

        "-to",
        String(end),

        "-c:a",
        "libmp3lame",

        outputPath,
      ]);
      // const ffmpeg = spawn("ffmpeg", [
      //   "-y",

      //   "-i",
      //   inputPath,

      //   "-ss",
      //   clip.start_time.toString(),

      //   "-to",
      //   clip.end_time.toString(),

      //   "-c",
      //   "copy",

      //   outputPath,
      // ]);

      ffmpeg.stderr.on("data", (data) => {
        console.log(data.toString());
      });

      ffmpeg.on("close", (code) => {
        if (code !== 0) {
          return res.status(500).json({
            message: "Clip generation failed",
          });
        }

        res.download(
          outputPath,

          clip.title + "_clip.mp3",

          () => {
            if (fs.existsSync(outputPath)) {
              fs.unlinkSync(outputPath);
            }
          },
        );
      });
    },
  );
});

app.get("/api/user-profile", authenticatetoken, (req, res) => {
  const query = "SELECT  profile_pic FROM users WHERE id = ?";
  connection.execute(query, [req.user.userID], (err, result) => {
    // console.log("nhiho paya");
    if (result.length > 0) res.json(result[0]);
    else res.status(404).send("User not found");
  });
});
server.listen(8000, () => {
  console.log("Server created");
});
// connection.query("select * from clips", (err, res) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(res);
//   }
// });
// console.log(connection);
