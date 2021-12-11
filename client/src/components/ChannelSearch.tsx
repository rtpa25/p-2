/** @format */

import React, { useState, useEffect } from 'react';
import { useChatContext } from 'stream-chat-react';
import { ResultsDropdown } from './z(exporter)';
import { SearchIcon } from '../assets/SearchIcon';

const ChannelSearch = () => {
  const { client, setActiveChannel } = useChatContext();
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [teamChannels, setTeamChannels] = useState<any[]>([]);
  const [directChannels, setDirectChannels] = useState<any[]>([]);

  useEffect(() => {
    if (!query) {
      setTeamChannels([]);
      setDirectChannels([]);
    }
  }, [query]);

  const getChannels = async (text: string) => {
    try {
      const channelResponse = client.queryChannels({
        type: 'team',
        name: { $autocomplete: text },
        members: { $in: [client.userID] } as any,
      });
      const userResponse = client.queryUsers({
        id: { $ne: client.userID! },
        name: { $autocomplete: text },
      });

      const [channels, { users }] = await Promise.all([
        channelResponse,
        userResponse,
      ]);

      if (channels.length) setTeamChannels(channels);
      if (users.length) setDirectChannels(users);
    } catch (error) {
      setQuery('');
    }
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoading(true);
    setQuery(e.target.value);
    getChannels(e.target.value);
  };

  const setChannel = (channel: any) => {
    setQuery('');
    setActiveChannel(channel);
  };

  return (
    <div className='channel-search__container'>
      <div className='channel-search__input__wrapper'>
        <div className='channel-search__input__icon'>
          <SearchIcon />
        </div>
        <input
          type='text'
          placeholder='Search'
          value={query}
          className='channel-search__input__text'
          onChange={onSearch}
        />
      </div>
      {query && (
        <ResultsDropdown
          teamChannels={teamChannels}
          directChannels={directChannels}
          loading={loading}
          setChannel={setChannel}
          focusedId={undefined}
        />
      )}
    </div>
  );
};

export default ChannelSearch;
