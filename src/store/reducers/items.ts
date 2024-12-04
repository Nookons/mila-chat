import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ItemsState = {
    items: any[];
    loading: boolean;
    error: string | undefined;
    isLoaded: boolean; // New flag to track if the robots are loaded
};

const initialState: ItemsState = {
    items: [],
    loading: false,
    error: undefined,
    isLoaded: false, // Initially, robots are not loaded
};


const itemSLice = createSlice({
    name: 'robots',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction) => {
            const filteredRobots = state.items.filter(item => item.robot_id !== action.payload);
            state.items = [...filteredRobots, action.payload];
        },
        removeItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.robot_id !== action.payload);
        }
    }
});

// Export actions
export const { addItem, removeItem } = itemSLice.actions;

export default itemSLice.reducer;