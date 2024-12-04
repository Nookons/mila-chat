import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {IUser} from "../../types/User";

type ItemsState = {
    user: IUser | null;
    loading: boolean;
    error: string | undefined;
};

const initialState: ItemsState = {
    user: null,
    loading: false,
    error: undefined,
};


const userSLice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userEnter: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload;
        },
        userLogout: (state, action: PayloadAction) => {
            state.user = null;
        }
    }
});

// Export actions
export const { userEnter, userLogout } = userSLice.actions;

export default userSLice.reducer;