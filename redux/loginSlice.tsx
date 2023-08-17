import { createSlice,PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  inn: false,
  ppicture:"",
  category:"csgo",
  balance:0,
  id:null
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
    note_login: (state, action) => {
      state.inn = action.payload;
    },
    note_ppicture: (state, action) => {
      state.ppicture = action.payload;
    },
    note_category: (state, action) => {
      state.category = action.payload;
    },
    note_balance: (state, action) => {
      state.balance = action.payload;
    },
    note_id: (state, action) => {
      state.id = action.payload;
    },
  },
});

export const { note_login,note_ppicture,note_category,note_balance,note_id} = loginSlice.actions

export default loginSlice.reducer