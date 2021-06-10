const upload = require("../middleware/upload");
const express = require("express");
const router = express();

router.post("/upload", upload.single("file"), async (req, res) => {
    if (req.file === undefined) return res.send("you must select a file.");
    // const imgUrl = `https://afternoon-shore-39724.herokuapp.com/file/${req.file.filename}`;
    const imgUrl = `http://localhost:5000/file/${req.file.filename}`;
    return res.send(imgUrl);
});

module.exports = router;