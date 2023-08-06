import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inn: false,
}

export const loginSlice = createSlice({
  name: 'loginSlice',
  initialState,
  reducers: {
    note_login: (state, action) => {
      state.inn = action.payload;
    },
  },
})

export const { note_login} = loginSlice.actions

export default loginSlice.reducer