import {User} from "@app/_models/user";

export interface AuthResponse {
  status: string;
  user: User;
  authorisation: {
    token: string;
    type: string;
  };
}
