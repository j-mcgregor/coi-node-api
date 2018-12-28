const axios = require("axios");
const cloudinary = require("cloudinary");

function fileUploadMiddleware(req, res) {
  cloudinary.uploader
    .upload_stream(result => {
      axios({
        url: `https://api.cloudinary.com/v1_1/circle-of-intrapreneurs/image/upload/${
          req.file.originalname
        }`, //API endpoint that needs file URL from CDN
        method: "post",
        data: {
          url: result.secure_url,
          name: req.body.name,
          description: req.body.description
        }
      })
        .then(response => {
          console.log("success");
        })
        .catch(error => {
          console.log("error");
        });
    })
    .end(req.file.buffer);
}

module.exports = fileUploadMiddleware;
