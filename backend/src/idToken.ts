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
    const idToken = req.headers?.['idtoken'] as string;

    if (!idToken) {
      return res.status(400).json({ error: 'Missing ID token.' });
    }

    const decodedToken: any = jwt.decode(idToken, { complete: true });

    if (!decodedToken) {
      return res.status(400).json({ error: 'Invalid ID token.' });
    }

    const kid = decodedToken.header.kid;
    const publicKeys = await getPublicKeys();
    const jwk = publicKeys.find((key: any) => key.kid === kid);

    if (!jwk) {
      return res.status(400).json({ error: 'Invalid ID token.' });
    }

    const pem = jwkToPem(jwk);
    jwt.verify(idToken, pem, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'ID token verification failed.' });
      }

      res.locals.auth = decoded;
      next();
    });
  } catch (error: any) {
    next(new Error('Internal server error'));
  }
};

export default verifyIdToken;
