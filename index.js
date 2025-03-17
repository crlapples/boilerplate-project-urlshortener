require('dotenv').config();
const { nanoid } = require("nanoid");
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

function isValid(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

const urls = {};

app.post("/api/shorturl", function (req, res) {
  if (!isValid(req.body.url)) {
    res.json({ error: 'invalid url' });
    return;
  }
  const id = nanoid(2);
  urls[id] = req.body.url;
  res.json({ original_url : req.body.url, short_url : `${req.protocol}://${req.get("host")}/api/shorturl/${id}` })
});

app.get("/api/shorturl/:id", function(req, res) {
  res.redirect(urls[req.params.id]);
});
