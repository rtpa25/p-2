/** @format */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CreationState {
  createType: string;
  isCreating: boolean;
  isEditing: boolean;
  toggleContainer: boolean;
}

const initialState: CreationState = {
  createType: '',
  isCreating: false,
  isEditing: false,
  toggleContainer: false,
};

const CreationSlice = createSlice({
  name: 'creation',
  initialState: initialState,
  reducers: {
    setCreateType: (state, action: PayloadAction<{ type: string }>) => {
      state.createType = action.payload.type;
    },
    setIsEditing: (state, action: PayloadAction<{ editing: boolean }>) => {
      state.isEditing = action.payload.editing;
    },
    setIsCreating: (state, action: PayloadAction<{ creating: boolean }>) => {
      state.isCreating = action.payload.creating;
    },
    setToggleContainer: (state) => {
      state.toggleContainer = !state.toggleContainer;
    },
  },
});

export const {
  setCreateType,
  setIsEditing,
  setIsCreating,
  setToggleContainer,
} = CreationSlice.actions;
export default CreationSlice.reducer;
