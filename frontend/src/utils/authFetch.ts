import api from "../services/api";

export const getMeWithRefresh = async() => {
    try {
        return await api.post("/api/auth/me")
    } catch (error) {
        if ((error as any).response?.status === 401) {
            await api.post("/api/auth/refresh");
            return await api.post("/api/auth/me")
        }
        throw error;
    }
}