export const passwordPolicyMessage =
  "Password must be at least 12 characters long and include an uppercase letter, a lowercase letter, and a number.";

export const isPasswordPolicyValid = (password) =>
  typeof password === "string" &&
  password.length >= 12 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /\d/.test(password);