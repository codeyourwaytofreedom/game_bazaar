import { createSlice,PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  inn: false,
  ppicture:"",
  category:"csgo"
}

interface LoginState {
  inn: boolean;
  ppicture: string;
  category: string;
}

export const loginSlice = createSlice({
  name: 'loginSlice',
  initialState,
  reducers: {
    note_login: (state, action: PayloadAction<boolean>) => {
      state.inn = action.payload;
    },
    note_ppicture: (state, action: PayloadAction<string>) => {
      state.ppicture = action.payload;
    },
    note_category: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
  },
});

export const { note_login,note_ppicture,note_category} = loginSlice.actions

export default loginSlice.reducer