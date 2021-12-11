/** @format */

//Dependencies
import { Response, Request, NextFunction } from 'express';
import crypto from 'crypto';
import { connect } from 'getstream';
import bcrypt from 'bcryptjs';

import { StreamChat } from 'stream-chat';

//internal imports
import logger from '../utils/logger';

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

//-----SIGNUP CONTROLLER ----//
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fullName, username, password, phoneNumber } = req.body;

    const userId = crypto.randomBytes(16).toString('hex');

    const serverClient = connect(api_key!, api_secret!, app_id);

    const hashedPassword = await bcrypt.hash(password, 10);

    //stream method that creates a access token for the user to get in the app
    const token = serverClient.createUserToken(userId);

    res
      .status(200)
      .json({ token, fullName, username, userId, hashedPassword, phoneNumber });
  } catch (error: any) {
    logger.error(error);

    res.status(500).json({ message: error });
  }
  next();
};

//-----LOGIN CONTROLLER ----//
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    const serverClient = connect(api_key!, api_secret!, app_id);

    const client = StreamChat.getInstance(api_key!, api_secret);

    //quering in the stream db to check if the user exist with the given username
    const { users } = await client.queryUsers({ name: username });

    if (!users.length) {
      return res.status(400).json({ message: 'User not found' });
    }

    const success = await bcrypt.compare(
      password,
      users[0].hashedPassword as string
    );

    if (success) {
      //if password correct then give a token from stream to grant the user access to the app
      const token = serverClient.createUserToken(users[0].id);
      res.status(200).json({
        token,
        fullName: users[0].fullName,
        username,
        userId: users[0].id,
      });
    } else {
      res.status(500).json({ message: 'Incorrect password' });
    }
  } catch (error: any) {
    logger.error(error);
    //send error message
    res.status(500).json({ message: error });
  }
  next();
};
