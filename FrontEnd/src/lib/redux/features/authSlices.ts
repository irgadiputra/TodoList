import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // LocalStorage or SessionStorage
import { persistReducer } from 'redux-persist';

export interface IUser {
  email: string;
  name: string;
}

export interface IAuth {
  user: IUser;
  isLogin: boolean;
  token: string | null;
}

const initialState: IAuth = {
  user: {
    email: '',
    name: '',
  },
  isLogin: false,
  token: null,
};

const persistConfig = {
  key: 'auth',
  storage, 
  whitelist: ['user', 'token'],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    onLogin: (state, action: PayloadAction<{ user: IUser; token: string }>) => {
      state.user = action.payload.user;
      state.isLogin = true;
      state.token = action.payload.token;
    },
    onLogout: (state) => {
      state.user = initialState.user;
      state.isLogin = false;
      state.token = null;
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    restoreLogin: (state, action: PayloadAction<IAuth>) => {
      const { user, isLogin, token } = action.payload;
      if (user && token) {
        state.user = user;
        state.isLogin = isLogin;
        state.token = token;
      }
    },
  },
});

const persistedAuthReducer = persistReducer(persistConfig, authSlice.reducer);

export const { onLogin, onLogout, updateToken, restoreLogin } = authSlice.actions;

export default persistedAuthReducer;
