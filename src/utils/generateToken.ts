import * as jwt from 'jsonwebtoken';

export interface IGenerateToken {
  id: string;
  secret: string;
  time: string;
}

export const generateToken = ({ id, secret, time }: IGenerateToken): string => {
  if (!secret) {
    throw new Error('JWT secret is required.');
  }

  return jwt.sign({ id }, secret, { expiresIn: time });
};
