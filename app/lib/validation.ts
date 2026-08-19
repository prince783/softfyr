export function normalizePhone(phone: string) {
  let value = phone.replace(/\D/g, "");

  // India
  if (value.length === 10) {
    value = `91${value}`;
  }

  if (!value.startsWith("91") || value.length !== 12) {
    throw new Error("Please enter a valid Indian mobile number");
  }

  return value;
}