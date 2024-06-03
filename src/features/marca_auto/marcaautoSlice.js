import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import MarcaautoService from "./marcaautoService";

export const getMarcasauto = createAsyncThunk(
  "Marcasauto/get-marcas",
  async (thunkAPI) => {
    try {
      return await MarcaautoService.getMarcasauto();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createMarcaauto = createAsyncThunk(
  "Marcasauto/create-marca",
  async (marcaData, thunkAPI) => {
    try {
      return await MarcaautoService.createMarcasauto(marcaData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const updateMarcaauto = createAsyncThunk(
  "Marcasauto/update-marca",
  async (marcaauto, thunkAPI) => {
    try {
      return await MarcaautoService.updateMarcaauto(marcaauto);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteMarcaauto = createAsyncThunk(
  "Marcasauto/delete-marca",
  async (id, thunkAPI) => {
    try {
      return await MarcaautoService.deleteMarcaauto(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getMarcaauto = createAsyncThunk(
  "Marcasauto/getmarca",
  async (id, thunkAPI) => {
    try {
      return await MarcaautoService.getMarcaauto(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const resetState = createAction("RevertAll");

const initialState = {
  marcas: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  isExisting: false,
  message: "",
};
export const marcaautoSlice = createSlice({
  name: "marcas",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMarcasauto.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getMarcasauto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.marcas = action.payload;
      })

      .addCase(getMarcasauto.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      
      .addCase(createMarcaauto.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(createMarcaauto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdCategory = action.payload;
        state.isExisting = false; 
      })

      .addCase(createMarcaauto.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isExisting = true;
      })

      .addCase(updateMarcaauto.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(updateMarcaauto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedCategory = action.payload;
      })

      .addCase(updateMarcaauto.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(deleteMarcaauto.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(deleteMarcaauto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedCategory = action.payload;
      })
      
      .addCase(deleteMarcaauto.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getMarcaauto.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMarcaauto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.categoriaNombre = action.payload.nombre;
      })
      .addCase(getMarcaauto.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(resetState, () => initialState);
  },
});
export default marcaautoSlice.reducer;
