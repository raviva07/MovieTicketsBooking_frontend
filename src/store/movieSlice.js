import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import movieService from "../services/movieService";

const initialState = {
  list: [],
  current: null,
  loading: false,
  error: null,
};

// Fetch all movies
export const fetchMovies = createAsyncThunk(
  "movie/fetchMovies",
  async (_, { rejectWithValue }) => {
    try {
      const res = await movieService.getAll();
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

// Fetch by id
export const fetchMovieById = createAsyncThunk(
  "movie/fetchMovieById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await movieService.getById(id);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

// Create JSON
export const createMovieJson = createAsyncThunk(
  "movie/createMovieJson",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await movieService.createJson(payload);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

// Create multipart
export const createMovieMultipart = createAsyncThunk(
  "movie/createMovieMultipart",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await movieService.createMultipart(formData);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

// Update
export const updateMovie = createAsyncThunk(
  "movie/updateMovie",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await movieService.update(id, payload);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

// Delete
export const deleteMovie = createAsyncThunk(
  "movie/deleteMovie",
  async (id, { rejectWithValue }) => {
    try {
      const res = await movieService.remove(id);
      return { id, res };
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    clearMovieError(state) {
      state.error = null;
    },
    clearCurrentMovie(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMovies
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || action.payload || [];
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // fetchMovieById
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload?.data || action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // create
      .addCase(createMovieJson.fulfilled, (state, action) => {
        state.loading = false;
        const movie = action.payload?.data || action.payload;
        if (movie) state.list.unshift(movie);
      })
      .addCase(createMovieMultipart.fulfilled, (state, action) => {
        state.loading = false;
        const movie = action.payload?.data || action.payload;
        if (movie) state.list.unshift(movie);
      })

      // update
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.loading = false;
        const movie = action.payload?.data || action.payload;
        if (movie) {
          state.list = state.list.map((m) => (m.id === movie.id ? movie : m));
          if (state.current?.id === movie.id) state.current = movie;
        }
      })

      // delete
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((m) => m.id !== action.payload.id);
      });
  },
});

export const { clearMovieError, clearCurrentMovie } = movieSlice.actions;
export default movieSlice.reducer;
