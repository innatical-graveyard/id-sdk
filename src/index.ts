import { createTRPCClient } from "@trpc/client";
import type { App } from "../../innatical-id-backend/resources/_app";
import jwtDecode from "jwt-decode";
import fetch from "cross-fetch";

const client = createTRPCClient<App>({
  url: "https://api.id.innatical.com",
  fetch,
});

export class InnaticalID {
  private appID: string;
  private token: string;

  constructor(appID: string, token: string) {
    this.appID = appID;
    this.token = token;
  }

  createURL(callback: string) {
    return (
      `https://id.innatical.com/connect` +
      new URLSearchParams({ callback, id: this.appID })
    );
  }

  async getUserInfo(token: string) {
    return await client.query("users.me", {
      token,
    });
  }

  async searchUser(
    query: { id: string } | { email: string } | { username: string }
  ) {
    return await client.query("users.get", { token: this.token, ...query });
  }

  validateToken(token: string) {
    return (jwtDecode(token) as { aud: string }).aud === this.appID;
  }
}
