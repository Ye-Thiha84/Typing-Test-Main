const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");

const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));

// Original fruits endpoint
app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "orange", "banana"] });
});

// New typing test texts endpoint with dictionary API
app.get("/api/typing-tests", async (req, res) => {
  try {
    const words = ["hope", "journey", "freedom", "dream", "peace"]; // Sample words to fetch definitions
    const typingTests = [];

    for (const word of words) {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const data = response.data[0];
      if (data && data.meanings) {
        const examples = data.meanings
          .flatMap((meaning) => meaning.definitions)
          .filter((def) => def.example)
          .map((def) => def.example);
        if (examples.length > 0) {
          typingTests.push(...examples);
        }
      }
    }

    // Combine into a single large paragraph if needed
    const largeParagraph = typingTests.join(" ");
    res.json({ texts: [largeParagraph] });
  } catch (error) {
    console.error("Error fetching typing tests:", error);
    res.status(500).json({ error: "Failed to fetch typing tests" });
  }
});

app.listen(8181, () => {
  console.log("Server started on port 8181");
});
