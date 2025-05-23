import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean
  user: any | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
      state.isLoggedIn=true
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn=false
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
