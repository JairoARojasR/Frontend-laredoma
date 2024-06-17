import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import ventaService from "./ventaService";

export const getVentas = createAsyncThunk(
    "venta/get-ventas",
    async (thunkAPI) => {
      try {
        return await ventaService.getVentas();
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

  export const getVenta = createAsyncThunk(
    "venta/get-venta",
    async (id, thunkAPI) => {
      try {
        return await ventaService.getVenta(id);
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );


  export const createVenta = createAsyncThunk(
    "venta/create-venta",
    async (ventaData, thunkAPI) => {
      try {
        return await ventaService.createVenta(ventaData);
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

  export const resetState = createAction("RevertAll");

  const initialState = {
    ventas: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    isExisting: false,
    message: "",
  };

  export const ventaSlice = createSlice({
    name: "ventas",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getVentas.pending, (state) => {
          state.isLoading = true;
        })
  
        .addCase(getVentas.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.ventas = action.payload;
        })
  
        .addCase(getVentas.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })

        .addCase(getVenta.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(getVenta.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
          })
          .addCase(getVenta.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error;
          })

        .addCase(createVenta.pending, (state) => {
          state.isLoading = true;
        })
  
        .addCase(createVenta.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.createdVenta = action.payload;
          state.isExisting = false; 
        })
  
        .addCase(createVenta.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.payload.response.data.message;
          state.isExisting = true;
        })

        .addCase(resetState, () => initialState);
    },
});

export default ventaSlice.reducer;
  