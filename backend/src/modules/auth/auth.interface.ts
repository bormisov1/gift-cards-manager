export interface IUser {
  username: string;
  password: string;
}

export interface IAuthUser {
  username: string;
}

export interface IAuthService {
  register(dto: IUser): Promise<boolean>;
  validateUser(username: string, plainPassword: string): Promise<IUser | boolean>;
  signToken(user: IUser): string;
}
