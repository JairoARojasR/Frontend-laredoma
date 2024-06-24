import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import RolService from "./rolService";

export const getRoles = createAsyncThunk(
  "roles/get-roles",
  async (thunkAPI) => {
    try {
      return await RolService.getRoles();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createRol = createAsyncThunk(
  "roles/create-roles",
  async (categoriaData, thunkAPI) => {
    try {
      return await RolService.createRol(categoriaData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateRol = createAsyncThunk(
  "roles/update-roles",
  async (categoria, thunkAPI) => {
    try {
      return await RolService.updateRol(categoria);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteRol = createAsyncThunk(
  "roles/delete-roles",
  async (id, thunkAPI) => {
    try {
      return await RolService.deleteRol(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getRol = createAsyncThunk(
  "roles/get-rol",
  async (id, thunkAPI) => {
    try {
      return await RolService.getRol(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetState = createAction("RevertAll");

const initialState = {
  roles: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  isExisting: false,
  message: "",
};
export const rolSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.roles = action.payload;
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload.response.data.message;
      })
      .addCase(createRol.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRol.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdRoles = action.payload;
        state.isExisting = false; 

      })
      .addCase(createRol.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload.response.data.message;
        state.isExisting = true;
      })
      .addCase(updateRol.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRol.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedRoles = action.payload;
      })
      .addCase(updateRol.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteRol.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRol.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedRoles = action.payload;
      })
      .addCase(deleteRol.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getRol.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRol.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.rolNombre = action.payload.nombre;
      })
      .addCase(getRol.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(resetState, () => initialState);
  },
});
export default rolSlice.reducer;
