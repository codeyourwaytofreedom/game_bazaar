import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inn: false,
  ppicture:""
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
  },
})

export const { note_login,note_ppicture} = loginSlice.actions

export default loginSlice.reducer