"use server";

import { uploadToCloudinary } from "@/lib/cloudinary";

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    
    if (!file) {
      return { error: "No file provided" };
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed" };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { error: "File too large. Maximum size is 5MB" };
    }

    const url = await uploadToCloudinary(file, "todotrade/trades");
    
    return { success: true, url };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Failed to upload image" };
  }
}