const fs = require('fs');
const path = require('path');
const express = require('express');
const serveIndex = require('serve-index');
const { unescape } = require('querystring');

const port = 3000;
const publicDir = process.argv[2] || path.join(__dirname, "./public");
const uploadsDir = process.argv[3] || path.join(__dirname, "./uploads");

const app = express();
app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, "/index.html"));
})
app.get('/styles.css', function (req, res, next) {
    res.sendFile(path.join(__dirname, "/styles.css"));
})
const upload = function(req, fileName) {
    console.log('uploads triggered');
    console.log(req.path);
    try{
        fs.mkdirSync(uploadsDir);
    }catch{}
    const name = '' + Date.now() + (fileName ? '-' + fileName : "");
    req.pipe(fs.createWriteStream(path.join(uploadsDir, name)));
    //req.on('end', next);
    req.res.end();
}
app.post('/uploads/:f', function (req, res, next) {
    upload(req, unescape(req.params.f));
});
app.post('/uploads', function (req, res, next) {
    upload(req);
});
const indexOptions = { view: "tiles", stylesheet: path.join(__dirname, "/styles.css") }
app.use("/public", express.static(publicDir), serveIndex(publicDir, indexOptions));
app.use("/uploads", express.static(uploadsDir), serveIndex(uploadsDir, indexOptions));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
