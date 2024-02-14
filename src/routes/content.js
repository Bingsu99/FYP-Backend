const express = require('express');
const jwt = require('jsonwebtoken');
const upload = require("../util/multer")
const S3 = require("../util/S3")

const router = express.Router();

// Middleware to verify access token
function verifyAccessToken(req, res, next) {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return res.status(401).json({ message: 'Access token not provided' });
  }

  jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
        console.log(accessToken)
      return res.status(401).json({ message: 'Invalid access token' });
    }
    // If the token is valid, you can access the user's ID in decoded.userId

    // You can perform additional authorization checks here if needed

    next(); // Proceed to the protected route
  });
}

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
