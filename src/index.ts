import { createTRPCClient } from "@trpc/client";
import type { App } from "../../innatical-id-backend/resources/_app";
import jwtDecode from "jwt-decode";
import fetch from "node-fetch";

const client = createTRPCClient<App>({
  url: "https://api.id.innatical.com",
  // @ts-ignore
  fetch,
});

export class InnaticalID {
  private appID: string;

  constructor(appID: string) {
    this.appID = appID;
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

  validateToken(token: string) {
    return (jwtDecode(token) as { aud: string }).aud === this.appID;
  }
}
