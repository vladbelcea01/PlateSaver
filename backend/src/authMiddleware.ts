import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

const COGNITO_REGION = 'eu-north-1';
const USER_POOL_ID = 'eu-north-1_6urPl4M7G';

const getPublicKeys = async () => {
  const url = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;
  const response = await axios.get(url);
  return response.data.keys;
};

const verifyIdToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers?.['authorization'] as string;

    if (!authorization) {
      return res.status(400).json({ error: 'Missing token.' });
    }

    const token = authorization.split(' ')[1];
    const decodedToken: any = jwt.decode(token, { complete: true });

    if (!decodedToken) {
      return res.status(400).json({ error: 'Invalid token.' });
    }

    const kid = decodedToken.header.kid;
    const publicKeys = await getPublicKeys();
    const jwk = publicKeys.find((key: any) => key.kid === kid);

    if (!jwk) {
      return res.status(400).json({ error: 'Invalid token.' });
    }

    const pem = jwkToPem(jwk);
    jwt.verify(token, pem, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token verification failed.' });
      }

      res.locals.auth = decoded;
      next();
    });
  } catch (error: any) {
    next(new Error('Internal server error'));
  }
};

export default verifyIdToken;
