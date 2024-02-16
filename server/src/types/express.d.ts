import type { Types } from "mongoose";

declare module "express-session" {
  interface SessionData {
    user_id: Types.ObjectId | null;
    username: string | null;
    nickname: string | null;
  }
}

export {};
