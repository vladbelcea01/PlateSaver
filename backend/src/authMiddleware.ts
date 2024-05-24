import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';

const jwksClient = jwksRsa({
  jwksUri: `https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_6urPl4M7G/.well-known/jwks.json`
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  jwksClient.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err, undefined);
    }
    const signingKey = key ? key.getPublicKey() : undefined;
    callback(null, signingKey);
  });
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token)
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, getKey, {
    audience: `3bhgv3o4vpsincvcc6hfnap9cv`,
    issuer: `https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_6urPl4M7G`
  }, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}
