/** @format */

import { useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import { UserList } from './z(exporter)';
import { CloseCreateChannel } from '../assets/CloseCreateChannel';
import { useAppDispatch } from '../hooks';
import { setIsEditing } from '../store/slices/creationSlice';

const EditChannel = () => {
  const { channel } = useChatContext();
  const [channelName, setChannelName] = useState<any>(channel?.data?.name);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const dispatch = useAppDispatch();

  const updateChannel = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const nameChanged =
      channelName !== (channel!.data!.name || channel!.data!.id);
    if (nameChanged) {
      await channel!.update(
        { name: channelName },
        { text: `Channel name changed to ${channelName}` }
      );
    }
    if (selectedUsers.length) {
      await channel!.addMembers(selectedUsers);
    }
    setChannelName(null);
    dispatch(setIsEditing({ editing: false }));
    setSelectedUsers([]);
  };

  const closeChannelHandler = () => {
    dispatch(setIsEditing({ editing: false }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setChannelName(event.target.value);
  };

  return (
    <div className='edit-channel__container'>
      <div className='edit-channel__header'>
        <p>Edit Channel</p>
        <div onClick={closeChannelHandler}>
          <CloseCreateChannel />
        </div>{' '}
      </div>
      <div className='channel-name-input__wrapper'>
        <p>Name</p>
        <input
          value={channelName}
          onChange={handleChange}
          placeholder='channel-name'
        />
        <p>Add Members</p>
      </div>
      <UserList setSelectedUsers={setSelectedUsers} />
      <div className='edit-channel__button-wrapper' onClick={updateChannel}>
        <p>Save Changes</p>
      </div>
    </div>
  );
};

export default EditChannel;
