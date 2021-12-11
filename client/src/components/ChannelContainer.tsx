/** @format */

import { Channel, MessageTeam } from 'stream-chat-react';
import { useAppSelector } from '../hooks';
import { ChannelInner, CreateChannel, EditChannel } from './z(exporter)';

const ChannelContainer = () => {
  const { isCreating, isEditing, createType } = useAppSelector(
    (state) => state.creation
  );

  if (isCreating) {
    return (
      <div className='channel__container'>
        <CreateChannel createType={createType} />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className='channel__container'>
        <EditChannel />
      </div>
    );
  }

  const EmptyState = () => (
    <div className='channel-empty__container'>
      <p className='channel-empty__first'>
        This is the beginning of your chat history.
      </p>
      <p className='channel-empty__second'>
        Send messages, attachments, links, emojis, and more!
      </p>
    </div>
  );
  return (
    <div className='channel__container'>
      <Channel
        EmptyStateIndicator={EmptyState}
        Message={(messageProps, i) => (
          <MessageTeam key={i} {...messageProps} />
        )}>
        <ChannelInner />
      </Channel>
    </div>
  );
};

export default ChannelContainer;
