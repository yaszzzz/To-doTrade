import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  file: File,
  folder: string = "todotrade"
): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result!.secure_url);
            }
          }
        )
        .end(buffer);
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image");
  }
}

export function getPublicIdFromUrl(url: string): string {
  // Extract public ID from Cloudinary URL
  // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image.jpg
  // Returns: folder/image
  const parts = url.split("/");
  const uploadIndex = parts.findIndex((part) => part === "upload");
  if (uploadIndex === -1) return "";

  const publicIdWithExt = parts.slice(uploadIndex + 2).join("/");
  return publicIdWithExt.replace(/\.[^/.]+$/, ""); // Remove extension
}

export { cloudinary };