/** @format */
import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import { UserList } from './z(exporter)';
import { CloseCreateChannel } from '../assets/CloseCreateChannel';
import { setIsCreating, setIsEditing } from '../store/slices/creationSlice';
import { useAppDispatch } from '../hooks';

interface CreateChannelProps {
  createType: string;
}

const CreateChannel: React.FC<CreateChannelProps> = ({ createType }) => {
  const { client, setActiveChannel } = useChatContext();
  const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);
  const [channelName, setChannelName] = useState('');
  const dispatch = useAppDispatch();

  const createChannel = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      const newChannel = await client.channel(createType, channelName, {
        name: channelName,
        members: selectedUsers,
      });
      await newChannel.watch();
      setChannelName('');
      dispatch(setIsCreating({ creating: false }));
      dispatch(setIsEditing({ editing: false }));
      setSelectedUsers([client.userID] as string[]);
      setActiveChannel(newChannel);
    } catch (error) {
      console.log(error);
    }
  };

  const closeChannelHandler = () => {
    dispatch(setIsCreating({ creating: false }));
    dispatch(setIsEditing({ editing: false }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setChannelName(event.target.value);
  };

  return (
    <div className='create-channel__container'>
      <div className='create-channel__header'>
        <p>
          {createType === 'team'
            ? 'Create a New Channel'
            : 'Send a Direct Message'}
        </p>
        <div onClick={closeChannelHandler}>
          <CloseCreateChannel />
        </div>
      </div>
      {createType === 'team' && (
        <div className='channel-name-input__wrapper'>
          <p>Name</p>
          <input type='text' value={channelName} onChange={handleChange} />
          <p>Add Members</p>
        </div>
      )}
      <UserList setSelectedUsers={setSelectedUsers} />
      <div className='create-channel__button-wrapper' onClick={createChannel}>
        <p>
          {createType === 'team' ? 'Create Channel' : 'Create Message Group'}
        </p>
      </div>
    </div>
  );
};

export default CreateChannel;
