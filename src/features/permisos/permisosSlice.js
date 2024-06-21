
import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import permisoService from "./permisosService";


export const getPermisos = createAsyncThunk(
    "permisos/get-permisos",
    async (thunkAPI) => {
      try {
        return await permisoService.getPermisos();
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

  export const resetState = createAction("RevertAll");

  const initialState = {
    permisos: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    isExisting: false,
    message: "",
  };
  export const permisosSlice = createSlice({
    name: "permisos",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getPermisos.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getPermisos.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.permisos = action.payload;
        })
        .addCase(getPermisos.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(resetState, () => initialState);
    },
  });
  export default permisosSlice.reducer;
  
