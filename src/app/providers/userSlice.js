import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  authUser: null,
  candidateId: null,
   privileges: {}, 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setAuthUser(state, action) {
      state.authUser = action.payload;
    },
    setCandidate(state, action) {
      state.candidateId = action.payload; // Step 2: Handle candidateId
    },
    setPrivileges(state, action) {
        state.privileges = action.payload || {};
      },
    clearUser(state) {
      state.user = null;
      state.authUser = null;
        state.privileges = {};
    },
  },
});

export const { setUser, setAuthUser, clearUser, setCandidate, setPrivileges } = userSlice.actions;
export default userSlice.reducer;