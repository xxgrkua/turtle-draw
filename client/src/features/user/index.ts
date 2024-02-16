import axios, { AxiosError } from "axios";
import { createAppSlice } from "../../app/createAppSlice";

interface UserInfo {
  username: string;
  nickname: string;
  user_id: string;
}

interface UserSliceState {
  userInfo: UserInfo | null;
  state: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  loggedIn: boolean;
}

const initialState: UserSliceState = {
  userInfo: null,
  state: "idle",
  error: null,
  loggedIn: false,
};

export const userSlice = createAppSlice({
  name: "user",
  initialState,
  reducers: (create) => ({
    login: create.asyncThunk(
      async (payload: { username: string; password: string }, thunkAPI) => {
        try {
          const { data } = await axios.post<UserInfo>("/api/user/login", {
            username: payload.username,
            password: payload.password,
          });

          return data;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ error: string }>;
            return thunkAPI.rejectWithValue(axiosError.response?.data.error);
          } else {
            throw error;
          }
        }
      },
      {
        pending: (state) => {
          state.state = "loading";
        },
        fulfilled: (state, action) => {
          state.state = "succeeded";
          state.userInfo = action.payload;
          state.loggedIn = true;
        },
        rejected: (state, action) => {
          state.state = "failed";
          state.error = action.error.message || null;
        },
      },
    ),
  }),
});

export const { login } = userSlice.actions;

export default userSlice.reducer;
