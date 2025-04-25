const express = require("express");
const app = express(); // <--- THIS is what you're missing

app.use(express.json()); // Middleware to parse JSON

app.post("/webhook", (req, res) => {
  console.log("Received webhook data:", req.body);
  res.sendStatus(200); // Respond with 200 to let Kora know you got it
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
