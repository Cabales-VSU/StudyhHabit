

export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password: string) => {
  if (!password.trim()) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return null;
};

export const getEmailLink = (email: string) => {
  const domain = email.split("@")[1];

  if (domain.includes("gmail")) return "https://mail.google.com";
  if (domain.includes("yahoo")) return "https://mail.yahoo.com";
  if (domain.includes("outlook") || domain.includes("hotmail"))
    return "https://outlook.live.com/mail";

  return "mailto:";
};