import jwt from 'jsonwebtoken';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'default-access-secret';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'default-refresh-secret';

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, accessTokenSecret, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, refreshTokenSecret, { expiresIn: '7d' });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};
