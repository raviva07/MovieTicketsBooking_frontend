export const isEmail = (value) => {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

export const minLength = (value, len) =>
  typeof value === "string" && value.trim().length >= len;

export const isPositiveNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
};

export const validateMoviePayload = (payload) => {
  const errors = {};

  if (!isNonEmptyString(payload.title)) {
    errors.title = "Title is required";
  }

  if (!isPositiveNumber(payload.duration)) {
    errors.duration = "Duration must be > 0";
  }

  if (payload.rating && payload.rating.length > 5) {
    errors.rating = "Invalid rating";
  }

  return errors;
};

export const validateShowPayload = (payload) => {
  const errors = {};

  if (!payload.movieId) errors.movieId = "Movie required";
  if (!payload.theaterId) errors.theaterId = "Theater required";

  if (!payload.startTime) errors.startTime = "Start time required";
  if (!payload.endTime) errors.endTime = "End time required";

  if (new Date(payload.startTime) >= new Date(payload.endTime)) {
    errors.time = "End time must be after start time";
  }

  return errors;
};
