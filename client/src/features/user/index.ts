import axios from "axios";

import { createAppSlice } from "../../app/createAppSlice";
import { ApiErrorMessage } from "../../types/api";

interface UserInfo {
  username: string;
  nickname: string;
  user_id: string;
}

export interface UserSliceState {
  userInfo: UserInfo | null;
  initState: "idle" | "loading" | "succeeded" | "failed";
  state: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserSliceState = {
  userInfo: null,
  initState: "idle",
  state: "idle",
  error: null,
};

export const userSlice = createAppSlice({
  name: "user",
  initialState,
  reducers: (create) => ({
    init: create.asyncThunk<UserInfo>(
      async (_, thunkAPI) => {
        try {
          const { data } = await axios.get<UserInfo>("/api/user");
          return data;
        } catch (error) {
          if (axios.isAxiosError<ApiErrorMessage>(error) && error.response) {
            return thunkAPI.rejectWithValue(error.response.data.error);
          } else {
            throw error;
          }
        }
      },
      {
        pending: (state) => {
          state.initState = "loading";
        },
        fulfilled: (state, action) => {
          state.initState = "succeeded";
          state.userInfo = action.payload;
        },
        rejected: (state, action) => {
          state.initState = "failed";
          state.error = action.payload as string;
        },
      },
    ),

    login: create.asyncThunk(
      async (payload: { username: string; password: string }, thunkAPI) => {
        try {
          const { data } = await axios.post<UserInfo>("/api/user/login", {
            username: payload.username,
            password: payload.password,
          });
          return data;
        } catch (error) {
          if (axios.isAxiosError<ApiErrorMessage>(error) && error.response) {
            return thunkAPI.rejectWithValue(error.response.data.error);
          } else {
            throw error;
          }
        }
      },
      {
        pending: (state) => {
          state.state = "loading";
        },
        fulfilled: (state) => {
          state.state = "succeeded";
        },
        rejected: (state, action) => {
          state.state = "failed";
          state.error = action.payload as string;
        },
      },
    ),

    register: create.asyncThunk(
      async (
        payload: { username: string; nickname?: string; password: string },
        thunkAPI,
      ) => {
        try {
          await axios.post<UserInfo>("/api/user/register", {
            username: payload.username,
            nickname: payload.nickname,
            password: payload.password,
          });
        } catch (error) {
          if (axios.isAxiosError<ApiErrorMessage>(error) && error.response) {
            return thunkAPI.rejectWithValue(error.response.data.error);
          } else {
            throw error;
          }
        }
      },
      {
        pending: (state) => {
          state.state = "loading";
        },
        fulfilled: (state) => {
          state.state = "succeeded";
        },
        rejected: (state, action) => {
          state.state = "failed";
          state.error = action.payload as string;
        },
      },
    ),

    logout: create.asyncThunk<undefined>(
      async (_, thunkAPI) => {
        try {
          await axios.post("/api/user/logout");
        } catch (error) {
          if (axios.isAxiosError<ApiErrorMessage>(error) && error.response) {
            return thunkAPI.rejectWithValue(error.response.data.error);
          } else {
            throw error;
          }
        }
      },
      {
        pending: (state) => {
          state.state = "loading";
        },
        fulfilled: (state) => {
          state.state = "succeeded";
          state.userInfo = null;
        },
        rejected: (state, action) => {
          state.state = "failed";
          state.error = action.payload as string;
        },
      },
    ),

    updateUser: create.asyncThunk(
      async (
        payload: { username: string; nickname?: string; password?: string },
        thunkAPI,
      ) => {
        try {
          const { data } = await axios.put<UserInfo>(
            `/api/user/${payload.username}`,
            {
              nickname: payload.nickname,
              password: payload.password,
            },
          );
          return data;
        } catch (error) {
          if (axios.isAxiosError<ApiErrorMessage>(error) && error.response) {
            return thunkAPI.rejectWithValue(error.response.data.error);
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
        },
        rejected: (state, action) => {
          state.state = "failed";
          state.error = action.payload as string;
        },
      },
    ),

    deleteUser: create.asyncThunk(
      async (payload: { username: string }, _thunkAPI) => {
        await axios.delete(`/api/user/${payload.username}`);
      },
      {
        pending: (state) => {
          state.state = "loading";
        },
        fulfilled: (state) => {
          state.state = "succeeded";
          state.userInfo = null;
        },
        rejected: (state, action) => {
          state.state = "failed";
          state.error = action.error.message as string;
        },
      },
    ),

    resetState: create.reducer((state) => {
      state.state = "idle";
    }),

    setUserInfo: create.reducer((state, action: { payload: UserInfo }) => {
      state.userInfo = action.payload;
    }),
  }),

  selectors: {
    selectUserInfo: (state) => state.userInfo,
    selectUserInitState: (state) => state.initState,
    selectUserState: (state) => state.state,
    selectUserError: (state) => state.error,
  },
});

export const {
  selectUserError,
  selectUserInitState,
  selectUserState,
  selectUserInfo,
} = userSlice.selectors;

export const {
  init,
  login,
  logout,
  register,
  updateUser,
  deleteUser,
  resetState,
  setUserInfo,
} = userSlice.actions;
