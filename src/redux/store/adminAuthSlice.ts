import { createSlice } from "@reduxjs/toolkit";

interface AdminAuthState {
  isAdminLoggedIn: boolean;
  admin: any | null;
}

const initialState: AdminAuthState = {
  isAdminLoggedIn: false,
  admin: null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdmin(state, action) {
      (state.admin = action.payload), (state.isAdminLoggedIn = true);
    },

    adminLogout(state) {
      (state.admin = null), (state.isAdminLoggedIn = false);
    },
  },
});

export const { setAdmin, adminLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
