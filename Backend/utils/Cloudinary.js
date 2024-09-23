const cloudinary = require("cloudinary").v2;
const { cloudinaryConfig } = require("../configs/Cloudinary");

function uploadImageToCloudinary(base64Image, folder = "") {
  cloudinary.config(cloudinaryConfig);

  return new Promise((resolve, reject) => {
    // Upload the image to Cloudinary
    cloudinary.uploader.upload(
      base64Image,
      {
        folder: folder,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

function deleteImageFromCloudinary(imagePublicId) {
  cloudinary.config(cloudinaryConfig);

  return new Promise((resolve, reject) => {
    // Upload the image to Cloudinary
    cloudinary.uploader.destroy(imagePublicId, (error, success) => {
      if (error) {
        reject(error);
      } else {
        resolve(success);
      }
    });
  });
}

module.exports = {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
};
