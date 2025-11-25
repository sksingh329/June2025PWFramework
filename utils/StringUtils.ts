export function generateRandomEmail(): string {
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `user_${randomStr}@example.com`;
}