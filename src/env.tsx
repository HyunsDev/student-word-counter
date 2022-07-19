import invariant from "tiny-invariant";

invariant(process.env.REACT_APP_API_KEY, "REACT_APP_API_KEY is not defined");
export const API_KEY: string = process.env.REACT_APP_API_KEY;

invariant(
  process.env.REACT_APP_AUTH_DOMAIN,
  "REACT_APP_AUTH_DOMAIN is not defined"
);
export const AUTH_DOMAIN: string = process.env.REACT_APP_AUTH_DOMAIN;

invariant(
  process.env.REACT_APP_PROJECT_ID,
  "REACT_APP_PROJECT_ID is not defined"
);
export const PROJECT_ID: string = process.env.REACT_APP_PROJECT_ID;

invariant(
  process.env.REACT_APP_STORAGE_BUCKET,
  "REACT_APP_STORAGE_BUCKET is not defined"
);
export const STORAGE_BUCKET: string = process.env.REACT_APP_STORAGE_BUCKET;

invariant(
  process.env.REACT_APP_MESSAGING_SENDER_ID,
  "REACT_APP_MESSAGING_SENDER_ID is not defined"
);
export const MESSAGING_SENDER_ID: string =
  process.env.REACT_APP_MESSAGING_SENDER_ID;

invariant(process.env.REACT_APP_APP_ID, "REACT_APP_APP_ID is not defined");
export const APP_ID: string = process.env.REACT_APP_APP_ID;
