const express = require("express");
const multer = require("multer");
const { execFile } = require("child_process");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors()); 

const upload = multer({ dest: "uploads/" });

app.get('/', (req, res) => {
  res.send({ message: 'Server is running' });
});


app.post("/api/enhance", upload.single("image"), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join("outputs", `${Date.now()}.png`);

  execFile("venv\\Scripts\\python.exe", ["enhancer.py", inputPath, outputPath], { cwd: __dirname }, (err, stdout, stderr) => {
    if (err) {
      console.error("Python error:", err);
      console.error("Stderr:", stderr);
      return res.status(500).json({ error: "Enhancement failed." });
    }

    res.sendFile(path.resolve(outputPath), () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  });
});

app.listen(1000, () => console.log("Server running on http://localhost:1000"));
