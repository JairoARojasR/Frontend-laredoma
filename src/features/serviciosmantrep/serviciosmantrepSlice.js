import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import serviciosmantrepService from "./serviciosmantrepService";

export const getServiciosmantrep = createAsyncThunk(
  "servicio/get-servicios",
  async (thunkAPI) => {
    try {
      return await serviciosmantrepService.getServiciosmantrep();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createServiciomantrep = createAsyncThunk(
  "servicio/create-servicio",
  async (servicioData, thunkAPI) => {
    try {
      return await serviciosmantrepService.createServiciosmantrep(servicioData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const updateServiciomantrep = createAsyncThunk(
  "servicio/update-servicio",
  async (categoria, thunkAPI) => {
    try {
      return await serviciosmantrepService.updateServiciosmantrep(categoria);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteServiciomantrep = createAsyncThunk(
  "servicio/delete-servicio",
  async (id, thunkAPI) => {
    try {
      return await serviciosmantrepService.deleteServiciosmantrep(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getServiciomantrep = createAsyncThunk(
  "servicio/getmarca",
  async (id, thunkAPI) => {
    try {
      return await serviciosmantrepService.getServiciomantrep(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const resetState = createAction("RevertAll");

const initialState = {
  servicios: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  isExisting: false,
  message: "",
};
export const serviciosmantrepSlice = createSlice({
  name: "servicios",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getServiciosmantrep.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getServiciosmantrep.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.servicios = action.payload;
      })
      .addCase(getServiciosmantrep.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(createServiciomantrep.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createServiciomantrep.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdCategory = action.payload;
        state.isExisting = false; 

      })
      .addCase(createServiciomantrep.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload.response.data.message;
        state.isExisting = true;
      })
      .addCase(updateServiciomantrep.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateServiciomantrep.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedCategory = action.payload;
      })
      .addCase(updateServiciomantrep.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteServiciomantrep.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteServiciomantrep.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedCategory = action.payload;
      })
      .addCase(deleteServiciomantrep.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getServiciomantrep.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getServiciomantrep.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.categoriaNombre = action.payload.nombre;
      })
      .addCase(getServiciomantrep.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(resetState, () => initialState);
  },
});
export default serviciosmantrepSlice.reducer;
