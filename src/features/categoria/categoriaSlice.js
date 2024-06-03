import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import CategoriaService from "./categoriaService";

export const getCategorias = createAsyncThunk(
  "productCategory/get-categorias",
  async (thunkAPI) => {
    try {
      return await CategoriaService.getCategorias();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createCategoria = createAsyncThunk(
  "productCategory/create-category",
  async (categoriaData, thunkAPI) => {
    try {
      return await CategoriaService.createCategoria(categoriaData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const updateCategoria = createAsyncThunk(
  "productCategory/update-category",
  async (categoria, thunkAPI) => {
    try {
      return await CategoriaService.updateCategoria(categoria);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteCategoria = createAsyncThunk(
  "productCategory/delete-category",
  async (id, thunkAPI) => {
    try {
      return await CategoriaService.deleteCategoria(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getCategoria = createAsyncThunk(
  "productCategory/get-product-category",
  async (id, thunkAPI) => {
    try {
      return await CategoriaService.getCategoria(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const resetState = createAction("RevertAll");

const initialState = {
  categorias: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  isExisting: false,
  message: "",
};
export const categoriaSlice = createSlice({
  name: "categorias",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategorias.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategorias.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.categorias = action.payload;
      })
      .addCase(getCategorias.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(createCategoria.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCategoria.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdCategory = action.payload;
        state.isExisting = false; 

      })
      .addCase(createCategoria.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isExisting = true;
      })
      .addCase(updateCategoria.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCategoria.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedCategory = action.payload;
      })
      .addCase(updateCategoria.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteCategoria.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategoria.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedCategory = action.payload;
      })
      .addCase(deleteCategoria.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getCategoria.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategoria.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.categoriaNombre = action.payload.nombre;
      })
      .addCase(getCategoria.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(resetState, () => initialState);
  },
});
export default categoriaSlice.reducer;
