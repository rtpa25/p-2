/** @format */

import { Avatar, useChatContext } from 'stream-chat-react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setToggleContainer } from '../store/slices/creationSlice';

const channelByUser = async (
  client: any,
  setActiveChannel: any,
  channel: any,
  setChannel: any
) => {
  const filters = {
    type: 'messaging',
    member_count: 2,
    members: { $eq: [client.user.id, client.userID] },
  };

  const [existingChannel] = await client.queryChannels(filters);

  if (existingChannel) return setActiveChannel(existingChannel);

  const newChannel = client.channel('messaging', {
    members: [channel.id, client.userID],
  });

  setChannel(newChannel);

  return setActiveChannel(newChannel);
};

interface SearchResultProps {
  channel: any;
  focusedId: any;
  type: any;
  setChannel: any;
}

const SearchResult: React.FC<SearchResultProps> = ({
  channel,
  focusedId,
  type,
  setChannel,
}) => {
  const dispatch = useAppDispatch();
  const { toggleContainer } = useAppSelector((state) => state.creation);
  const { client, setActiveChannel } = useChatContext();

  if (type === 'channel') {
    return (
      <div
        onClick={() => {
          setChannel(channel);
          if (toggleContainer) {
            dispatch(setToggleContainer());
          }
        }}
        className={
          focusedId === channel.id
            ? 'channel-search__result-container__focused'
            : 'channel-search__result-container'
        }>
        <div className='result-hashtag'>#</div>
        <p className='channel-search__result-text'>{channel.data.name}</p>
      </div>
    );
  }

  return (
    <div
      onClick={async () => {
        channelByUser(client, setActiveChannel, channel, setChannel);
        if (toggleContainer) {
          dispatch(setToggleContainer());
        }
      }}
      className={
        focusedId === channel.id
          ? 'channel-search__result-container__focused'
          : 'channel-search__result-container'
      }>
      <div className='channel-search__result-user'>
        <Avatar
          image={channel.image || undefined}
          name={channel.name}
          size={24}
        />
        <p className='channel-search__result-text'>{channel.name}</p>
      </div>
    </div>
  );
};

interface ResultsDropdownProps {
  teamChannels: any;
  directChannels: any;
  focusedId: any;
  loading: any;
  setChannel: any;
}

const ResultsDropdown: React.FC<ResultsDropdownProps> = ({
  teamChannels,
  directChannels,
  focusedId,
  loading,
  setChannel,
}) => {
  return (
    <div className='channel-search__results'>
      <p className='channel-search__results-header'>Channels</p>
      {loading && !teamChannels.length && (
        <p className='channel-search__results-header'>
          <i>Loading...</i>
        </p>
      )}
      {!loading && !teamChannels.length ? (
        <p className='channel-search__results-header'>
          <i>No channels found</i>
        </p>
      ) : (
        teamChannels?.map((channel: any, i: any) => (
          <SearchResult
            channel={channel}
            focusedId={focusedId}
            key={i}
            setChannel={setChannel}
            type='channel'
          />
        ))
      )}
      <p className='channel-search__results-header'>Users</p>
      {loading && !directChannels.length && (
        <p className='channel-search__results-header'>
          <i>Loading...</i>
        </p>
      )}
      {!loading && !directChannels.length ? (
        <p className='channel-search__res ults-header'>
          <i>No direct messages found</i>
        </p>
      ) : (
        directChannels?.map((channel: any, i: any) => (
          <SearchResult
            channel={channel}
            focusedId={focusedId}
            key={i}
            setChannel={setChannel}
            type='user'
          />
        ))
      )}
    </div>
  );
};

export default ResultsDropdown;
