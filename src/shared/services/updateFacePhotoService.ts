import api from "@/shared/services/apiService";

export async function updateFacePhotoService(file: File): Promise<{ path: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.put("user/face-photo", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}
