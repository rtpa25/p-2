/** @format */

//Dependencies
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie/es6';

//CSS files
import 'stream-chat-react/dist/css/index.css';
import './App.css';

//internal imports
import {
  ChannelContainer,
  ChannelListContainer,
  Auth,
} from './components/z(exporter)';

const apiKey = 'ybx2pqnkr2p4';

const Cookie = new Cookies();

const client = StreamChat.getInstance(apiKey);

const authToken: string = Cookie.get('token');

if (authToken) {
  client.connectUser(
    {
      id: Cookie.get('userId'),
      name: Cookie.get('username'),
      fullName: Cookie.get('fullName'),
      image: Cookie.get('avatarURL'),
      hashedPassword: Cookie.get('hashedPassword'),
      phoneNumber: Cookie.get('phoneNumber'),
    },
    authToken
  );
}

const App = () => {
  return authToken ? (
    <div className='app__wrapper'>
      <Chat client={client} theme='team light'>
        <ChannelListContainer />
        <ChannelContainer />
      </Chat>
    </div>
  ) : (
    <Auth />
  );
};

export default App;
