import { useState } from "react";
import { apiFetch } from "./apiFetch";


interface uploadMetadata {
    uploadUrl: string;
    fileKey: string;
    publicUrl: string;
    error: any
}

export async function uploadReceiptToCloudflare({
    image,
    token,
    contentType
}) {
    if (!image) {
        throw new Error("No image selected");
    }

    let  uploadUrl: string, fileKey: string, publicUrl: string, error:any 
    try {
        // 1️⃣ Ask backend for signed URL
        console.log("Asking backend for signed upload URL...")
        const payload = {
            filename: image.split("/").pop(),
            content_type: contentType,
        }
        const metadataData: uploadMetadata = await apiFetch('/receipts/get-signed-upload-url', 'POST', token, payload)
        console.log("Backend Response:", metadataData);
        ({ uploadUrl, fileKey, publicUrl, error } = metadataData);
        console.log("Items received from backend: ", uploadUrl, fileKey, publicUrl)
    } catch(err) {
        console.error("Error fatchin signed URL: ", err)
        throw err
    }
        if (!uploadUrl) {
            throw new Error(error || "Failed to get signed URL");
        }
        let blob:any;
    try{
        console.log("Converting local file URI → blob")
        const response = await fetch(image);
        blob = await response.blob();
        console.log("Blob ready for upload:", blob);
    } catch (err) {
        console.error("Failed to create blob:", err);
        throw err;
    }

    try{
        console.log(" Uploading to Cloudflare...")
        const uploadRes = await fetch(uploadUrl, {
            method: "PUT",
            body: blob,
            headers: {
                "Content-Type": contentType,
            },
        });

        if (!uploadRes.ok) {
            throw new Error("Upload to Cloudflare failed");
        }
        console.log("Upload successful!");

        return {fileKey, publicUrl};

    } catch (err) {
        console.error("Upload error:", err);
        throw err;
    }
}
