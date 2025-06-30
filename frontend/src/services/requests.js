import api from "./api";

const requestsApi = {
  async getAll(token, userId, role) {
    // Si admin, pas besoin de userId
    const params = role === "admin" ? {} : { user_id: userId, role };
    return api.get("/requests", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
  },
  async create(data, token) {
    return api.post("/requests", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async update(id, data, token) {
    return api.put(`/requests/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async getOne(id, token) {
    return api.get(`/requests/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export default requestsApi;
