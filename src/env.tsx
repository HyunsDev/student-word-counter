/**
 * For asserting that a value exists
 * @param value a value to be checked
 * @returns value if it exists
 * @throws if value is undefined
 */
function mandatory<T>(value: T | undefined) {
  if (value === undefined) {
    throw new Error("Value is undefined");
  }
  return value;
}

export const API_KEY = mandatory(process.env.REACT_APP_API_KEY);
export const AUTH_DOMAIN = mandatory(process.env.REACT_APP_AUTH_DOMAIN);
export const PROJECT_ID = mandatory(process.env.REACT_APP_PROJECT_ID);
export const STORAGE_BUCKET = mandatory(process.env.REACT_APP_STORAGE_BUCKET);
export const MESSAGING_SENDER_ID = mandatory(
  process.env.REACT_APP_MESSAGING_SENDER_ID
);
export const APP_ID = mandatory(process.env.REACT_APP_APP_ID);
