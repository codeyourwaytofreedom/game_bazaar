import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inn: false,
  ppicture:"",
  category:"csgo"
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
  },
})

export const { note_login,note_ppicture,note_category} = loginSlice.actions

export default loginSlice.reducer