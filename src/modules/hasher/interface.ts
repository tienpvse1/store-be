export abstract class PasswordHasher {
  abstract hashPassword(password: string): Promise<string>;
  abstract comparePassword(
    providedPassword: string,
    storedPassword: string,
  ): Promise<boolean>;
}
