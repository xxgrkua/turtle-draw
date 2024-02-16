import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface UserInfo {
  username: string;
  nickname: string;
  user_id: string;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getMe: builder.query<UserInfo, undefined>({
      query: () => "/user",
    }),

    login: builder.mutation<UserInfo, { username: string; password: string }>({
      query: ({ username, password }) => ({
        url: "/user/login",
        method: "POST",
        body: { username, password },
      }),
    }),
  }),
});

export const { useGetMeQuery, useLoginMutation } = apiSlice;
