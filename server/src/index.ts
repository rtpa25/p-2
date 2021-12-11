/** @format */

//Dependencies
import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';

//Internal Imports
import logger from './utils/logger';

//Routes import statements
import auth from './routes/auth.route';

const app: Express = express();

//regular middleware
app.use(express.json({ limit: '50MB' }));
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://portfolio-3-frontend.vercel.app',
    ],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const twilioClient = require('twilio')(accountSid, authToken);

//NOTIFICATION ROUTES
app.post('/', (req: Request, res: Response) => {
  const { message, user: sender, type, members } = req.body;
  //this is type event by stream message.new is when a user recives a new message
  if (type === 'message.new') {
    members
      //excludes the sender
      .filter((member: { user_id: any }) => member.user_id !== sender.id)
      //sends the notif to those who are not online
      .forEach(({ user }: any) => {
        if (!user.online) {
          twilioClient.messages
            .create({
              body: `You have a new message from ${message.user.fullName} - ${message.text}`,
              messagingServiceSid: messagingServiceSid,
              to: user.phoneNumber,
            })
            .then(() => console.log('Message sent!'))
            .catch((err: any) => console.log(err));
        }
      });

    return res.status(200).send('Message sent!');
  }

  return res.status(200).send('Not a new message request');
});

//router middleware
app.use('/api/v1', auth);

app.listen(process.env.PORT || 5000, () => {
  logger.info(`listening to port ${process.env.PORT}`);
});
