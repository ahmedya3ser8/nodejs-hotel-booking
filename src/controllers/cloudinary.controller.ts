import cloudinary from "../config/cloudinary ";

interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

export const uploadSingleImage = (file: Express.Multer.File, folder: string) => {
  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );

    stream.end(file.buffer);
  })
}

export const uploadMultipleImages = async (files: Express.Multer.File[], folder: string): Promise<CloudinaryUploadResult[]> => {
  if (!files || files.length === 0) return [];

  const uploads = files.map((file) =>
    uploadSingleImage(file, folder)
  );

  return Promise.all(uploads);
}

export const deleteSingleImage = (publicId: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error || !result) return reject(error);
      resolve(result);
    })
  })
}

export const deleteMultipleImages  = (publicIds: string[]) => {
  if (!publicIds || publicIds.length === 0) return [];

  const deletes = publicIds.map((publicId) => new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error || !result) return reject(error);
      resolve(result);
    })
  }));

  return Promise.all(deletes);
}
