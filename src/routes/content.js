const express = require('express');
const verifyAccessToken = require('../../src2/Middlewares/Authentication');
const upload = require("../util/multer")
const S3 = require("../util/S3")

const router = express.Router();

// Protected route
router.get('/protected-resource', verifyAccessToken, (req, res) => {
  // This route is protected and can only be accessed with a valid access token
  // You can access user data or perform any actions required for this resource

  // Example response for a protected resource
  res.json({ message: 'This is a protected resource' });
});

// The form data of the name of file has to be "file" as defined in single
router.post('/upload', upload.single("file"), async (req, res) => {
  const file = req.file
  await S3.uploadFile(file.buffer, "testimage2", file.mimetype)

  res.json({ message: 'Completed' });
});

router.get("/getFile", async (req, res) => {
    url = await S3.getObjectSignedUrl("testimage2")
  res.send(url)
})

module.exports = router;
