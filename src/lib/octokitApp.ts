import { App } from "@octokit/app";
import { readFileSync } from "fs";

export const octokitApp = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: readFileSync('./github-app.pem').toString(),
  oauth: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  },
});