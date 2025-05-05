const express = require("express");
const app = express();
const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));

// Original fruits endpoint
app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "orange", "banana"] });
});

// New typing test texts endpoint
app.get("/api/typing-tests", (req, res) => {
  const typingTests = [
    "The quick fox jumps over the lazy dog",
    "Sunny hills bloom with vivid colors",
    "A cat naps on a warm windowsill",
    "Stars twinkle in the midnight sky",
    "Waves crash gently on the sandy shore",
  ];

  res.json({ texts: typingTests });
});

app.listen(8181, () => {
  console.log("Server started on port 8181");
});
