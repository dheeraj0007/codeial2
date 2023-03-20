const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
require("dotenv").config();
cloudinary.config({
    cloud_name: `${process.env.CLOUD_NAME}`,
    api_key: `${process.env.API_KEY}`,
    api_secret: `${process.env.API_SECRET}`,
    secure: true,
});

let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
        console.log("in stream upload");
        let stream = cloudinary.uploader.upload_stream((error, result) => {
            console.log("result is ", result);
            if (result) {
                console.log("resolving");
                resolve(result);
            } else {
                console.log("rejecting");
                reject(error);
            }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
};

async function uploadImage(req) {
    try {
        console.log("in upload file function");
        console.log("req is ", req);
        let result = await streamUpload(req);
        console.log(result);
        return result;
    } catch (error) {
        return { message: "image not uploaded", error };
    }
}

module.exports = uploadImage;