import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import userService from "./usuarioService";

export const getUsers = createAsyncThunk(
  //listo
  "user/get-users",
  async (thunkAPI) => {
    try {
      return await userService.getUsers();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const createUser = createAsyncThunk(
  //listo
  "user/create-user",
  async (userData, thunkAPI) => {
    try {
      return await userService.createUser(userData);
    } catch (error) {
     // console.log(error.response.data.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createSeller = createAsyncThunk(
  //listo
  "user/create-seller",
  async (userData, thunkAPI) => {
    try {
      return await userService.createSeller(userData);
    } catch (error) {
     // console.log(error.response.data.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/reset-password",
  async (passwordData, thunkAPI) => {
    try {
      return await userService.resetPassword(passwordData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login-user",
  async (userData, thunkAPI) => {
    try {
      return await userService.loginUser(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateAUser = createAsyncThunk(
  //listo
  "user/update-user",
  async (user, thunkAPI) => {
    try {
      return await userService.updateUser(user);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateUserByEmail = createAsyncThunk(
  //listo
  "user/update-userbyemail",
  async (correo, thunkAPI) => {
    try {
      return await userService.updateUserByEmail(correo);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);



export const updateSellerByEmail = createAsyncThunk(
  //listo
  "user/update-sellerbyemail",
  async (correo, thunkAPI) => {
    try {
      return await userService.updateSellerByEmail(correo);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);


export const deleteAUser = createAsyncThunk(
  //listo
  "user/delete-user",
  async (id, thunkAPI) => {
    try {
      return await userService.deleteUser(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAUser = createAsyncThunk(
  "user/get-user",
  async (correo , thunkAPI) => {
    try {
      return await userService.getUser(correo);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getACustomer = createAsyncThunk(
  "user/get-customer",
  async (cedula , thunkAPI) => {
    try {
      return await userService.getCustomer(cedula);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAConfirmUser = createAsyncThunk(
  "user/confirm",
  async (token, thunkAPI) => {
    try {
      return await userService.confirm(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.message);
    }
  }
);

export const resetState = createAction("Reset_all");

const getUserfromLocalStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  users: [],
  getusers:"",
  isError: false,
  isLoading: false,
  isSuccess: false,
  isExisting: false,
  message: "",
};
export const usuarioSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdUser = action.payload;
        state.users = action.payload;
        state.isExisting = false; // Actualiza isExisting con la información del servidor
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
        state.isExisting = true; 
      })

      .addCase(createSeller.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSeller.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdUser = action.payload;
        state.users = action.payload;
        state.isExisting = false; // Actualiza isExisting con la información del servidor
      })
      .addCase(createSeller.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload.response.data.message;
        state.isExisting = true; 
      })

      .addCase(updateAUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedUser = action.payload;
      })
      .addCase(updateAUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(updateSellerByEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSellerByEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedUser = action.payload;
      })
      .addCase(updateSellerByEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(deleteAUser.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(deleteAUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(deleteAUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getAUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.userget = action.payload;
        state.nombre = action.payload.nombre;
        state.cedula = action.payload.cedula;
        state.correo = action.payload.correo;
        state.contrasenia = action.payload.contrasenia;
      })
      .addCase(getACustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(getACustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getACustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.costumerget = action.payload;
      
      })
      .addCase(getAUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(getAConfirmUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAConfirmUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(getAConfirmUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        //state.isLoggedIn = true;
        state.users = action.payload; // Almacena los datos del usuario si es necesario
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })


      .addCase(resetState, () => initialState);
  },
});
export default usuarioSlice.reducer;
