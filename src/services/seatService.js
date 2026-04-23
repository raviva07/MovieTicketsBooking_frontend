// src/services/seatService.js
import { api, handleResponse, handleError } from "./api";

/**
 * Seat service wrapper for backend endpoints
 *
 * Endpoints expected (api.baseURL already contains /api):
 *  - GET    /seats/theater/{theaterId}      -> getSeats(theaterId)
 *  - GET    /seats/{seatId}                 -> getById(seatId)
 *  - POST   /seats/reserve                  -> reserve({ showId, userId, seatIds, lockSeconds })
 *  - POST   /seats/confirm                  -> confirm([seatId1, seatId2, ...])
 *  - POST   /seats/release                  -> release([seatId1, seatId2, ...])
 *
 * Notes:
 *  - handleResponse and handleError are used consistently.
 *  - Methods throw normalized errors so UI can catch and display messages.
 */

const ensureArray = (v, name = "items") => {
  if (!Array.isArray(v) || v.length === 0) {
    throw { success: false, message: `${name} must be a non-empty array` };
  }
};

const ensureString = (v, name = "value") => {
  if (!v || typeof v !== "string") {
    throw { success: false, message: `${name} must be a non-empty string` };
  }
};

const seatService = {
  /**
   * Fetch all seats for a theater
   * @param {string} theaterId
   */
  getSeats: async (theaterId) => {
    ensureString(theaterId, "theaterId");
    try {
      const res = await api.get(`/seats/theater/${theaterId}`);
      return handleResponse(res);
    } catch (err) {
      const e = handleError(err);
      throw e;
    }
  },

  /**
   * Fetch a single seat by id
   * @param {string} seatId
   */
  getById: async (seatId) => {
    ensureString(seatId, "seatId");
    try {
      const res = await api.get(`/seats/${seatId}`);
      return handleResponse(res);
    } catch (err) {
      const e = handleError(err);
      throw e;
    }
  },

  /**
   * Reserve (lock) seats for a show
   * payload: { showId, userId, seatIds: [string], lockSeconds?: number }
   */
  reserve: async (payload) => {
    if (!payload || typeof payload !== "object") {
      throw { success: false, message: "payload is required" };
    }
    ensureString(payload.showId, "showId");
    ensureString(payload.userId, "userId");
    ensureArray(payload.seatIds, "seatIds");

    try {
      const res = await api.post("/seats/reserve", payload);
      return handleResponse(res);
    } catch (err) {
      const e = handleError(err);
      throw e;
    }
  },

  /**
   * Confirm seats (finalize booking)
   * payload: [ "seatId1", "seatId2", ... ]
   */
  confirm: async (seatIds) => {
    ensureArray(seatIds, "seatIds");
    try {
      const res = await api.post("/seats/confirm", seatIds);
      return handleResponse(res);
    } catch (err) {
      const e = handleError(err);
      throw e;
    }
  },

  /**
   * Release seats (unlock)
   * payload: [ "seatId1", "seatId2", ... ]
   */
  release: async (seatIds) => {
    ensureArray(seatIds, "seatIds");
    try {
      const res = await api.post("/seats/release", seatIds);
      return handleResponse(res);
    } catch (err) {
      const e = handleError(err);
      throw e;
    }
  },
};

export default seatService;
