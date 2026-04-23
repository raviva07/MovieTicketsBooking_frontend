import { api, handleResponse, handleError } from "./api";

/**
 * movieService
 * - createMultipart: sends multipart/form-data to POST /api/movies (file + fields)
 * - createJson: sends JSON to POST /api/movies (application/json)
 * - update: PUT /api/movies/{id} (application/json)
 * - getAll, getById, remove
 * - uploadPoster, uploadPosterFromUrl (dedicated endpoints)
 */
const movieService = {
  getAll: async () => {
    try {
      const res = await api.get("/movies");
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/movies/${id}`);
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  // JSON create (application/json)
  createJson: async (payload) => {
    try {
      const res = await api.post("/movies", payload, {
        headers: { "Content-Type": "application/json" },
      });
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  // Multipart create (multipart/form-data) — matches Swagger POST /api/movies
  createMultipart: async (formData) => {
    try {
      const res = await api.post("/movies", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  update: async (id, payload) => {
    try {
      const res = await api.put(`/movies/${id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  remove: async (id) => {
    try {
      const res = await api.delete(`/movies/${id}`);
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  uploadPoster: async (file) => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/movies/upload-poster", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  uploadPosterFromUrl: async (url) => {
    try {
      // Swagger shows url as query param
      const res = await api.post("/movies/upload-poster-url", null, {
        params: { url },
      });
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },
};

export default movieService;
