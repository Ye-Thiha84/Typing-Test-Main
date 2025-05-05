const express = require("express");
const app = express();
const cors = require("cors");
const corpsOptions = {
  origin: ["http://localhost:5173"],
};
app.use(cors(corpsOptions));
app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "ornage", "banana"] });
});

app.listen(8181, () => {
  console.log("Server started on port 8181");
});
