import api from "@/shared/services/apiService";

export async function uploadFacePhotoService(file: File): Promise<{ path: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("user/upload-face-photo", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}
