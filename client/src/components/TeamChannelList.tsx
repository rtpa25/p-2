/** @format */

import { AddChannel } from '../assets/AddChannel';
import { useAppDispatch } from '../hooks';
import {
  setCreateType,
  setIsCreating,
  setIsEditing,
} from '../store/slices/creationSlice';

interface TeamChannelListProps {
  error: boolean;
  loading: boolean;
  type: string;
}

const TeamChannelList: React.FC<TeamChannelListProps> = ({
  children,
  error = false,
  loading,
  type,
}) => {
  const dispatch = useAppDispatch();

  if (error) {
    return type === 'team' ? (
      <div className='team-channel-list'>
        <p className='team-channel-list__message'>
          Connection error, please wait a moment and try again.
        </p>
      </div>
    ) : null;
  }

  if (loading) {
    return (
      <div className='team-channel-list'>
        <p className='team-channel-list__message loading'>
          {type === 'team' ? 'Channels' : 'Messages'} loading...
        </p>
      </div>
    );
  }

  const addChannelHandler = (type: string) => {
    dispatch(setCreateType({ type: type === 'team' ? 'team' : 'messaging' }));
    dispatch(setIsCreating({ creating: true }));
    dispatch(setIsEditing({ editing: true }));
  };

  return (
    <div className='team-channel-list'>
      <div className='team-channel-list__header'>
        <p className='team-channel-list__header__title'>
          {type === 'team' ? 'Channels' : 'Direct Messages'}
        </p>
        <div
          onClick={() => {
            addChannelHandler(type);
          }}>
          <AddChannel />
        </div>
      </div>
      {children}
    </div>
  );
};

export default TeamChannelList;
