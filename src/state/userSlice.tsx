// userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store'; 

interface UserState {
  userInfo: {
    username: string;
    email: string;
  } | null;
}

const initialState: UserState = {
  userInfo: { username: "Guest", email: "" },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<{ username: string; email: string }>) => {
      state.userInfo = action.payload;
    },
    // Add other reducers as needed
  },
});

export const { setUserInfo } = userSlice.actions;
export const selectUserInfo = (state: RootState) => state.user.userInfo;

export default userSlice.reducer;
