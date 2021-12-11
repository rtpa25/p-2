/** @format */
import { ChannelList, useChatContext } from 'stream-chat-react';
import Cookies from 'universal-cookie';
import HospitalIcon from '../assets/hospital.png';
import LogoutIcon from '../assets/logout.png';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setToggleContainer } from '../store/slices/creationSlice';

import {
  ChannelSearch,
  TeamChannelList,
  TeamChannelPreview,
} from './z(exporter)';

const Cookie = new Cookies();

interface SideBarProps {
  logout: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ logout }) => (
  <div className='channel-list__sidebar'>
    <div className='channel-list__sidebar__icon1'>
      <div className='icon1__inner'>
        <img
          src={HospitalIcon}
          alt='Hospital'
          width='30'
          onClick={() => {
            window.location.reload();
          }}
        />
      </div>
    </div>
    <div className='channel-list__sidebar__icon2'>
      <div className='icon1__inner'>
        <img src={LogoutIcon} alt='Logout' width='30' onClick={logout} />
      </div>
    </div>
  </div>
);

const CompanyHeader: React.FC = () => (
  <div className='channel-list__header'>
    <p className='channel-list__header__text'>Medico</p>
  </div>
);

const customChannelTeamFilter = (channels: any) => {
  return channels.filter((channel: any) => channel.type === 'team');
};

const customChannelMessagingFilter = (channels: any) => {
  return channels.filter((channel: any) => channel.type === 'messaging');
};

const ChannelListContent: React.FC = () => {
  const { client } = useChatContext();
  const logoutHandler = () => {
    Cookie.remove('token');
    Cookie.remove('userId');
    Cookie.remove('username');
    Cookie.remove('fullName');
    Cookie.remove('avatarURL');
    Cookie.remove('hashedPassword');
    Cookie.remove('phoneNumber');
    window.location.reload();
  };
  const filters = { members: { $in: [client.userID] } };
  return (
    <>
      <SideBar logout={logoutHandler} />
      <div className='channel-list__list__wrapper'>
        <CompanyHeader />
        <ChannelSearch />
        <ChannelList
          filters={filters as any}
          channelRenderFilterFn={customChannelTeamFilter}
          List={(listProps) => (
            <TeamChannelList
              type={'team'}
              error={false}
              loading={false}
              {...listProps}
            />
          )}
          Preview={(previewProps) => (
            <TeamChannelPreview type={'team'} {...previewProps} />
          )}
        />
        <ChannelList
          filters={filters as any}
          channelRenderFilterFn={customChannelMessagingFilter}
          List={(listProps) => (
            <TeamChannelList
              type={'messaging'}
              error={false}
              loading={false}
              {...listProps}
            />
          )}
          Preview={(previewProps) => (
            <TeamChannelPreview type={'messaging'} {...previewProps} />
          )}
        />
      </div>
    </>
  );
};

const ChannelListContainer: React.FC = () => {
  const { toggleContainer } = useAppSelector((state) => state.creation);
  const dispatch = useAppDispatch();

  return (
    <>
      <div className='channel-list__container'>
        <ChannelListContent />
      </div>

      <div
        className='channel-list__container-responsive'
        style={{
          left: toggleContainer ? '0%' : '-89%',
          backgroundColor: '#005fff',
        }}>
        <div className='channel-list__container-toggle'></div>
        <ChannelListContent />
        <button
          onClick={() => dispatch(setToggleContainer())}
          style={{
            cursor: 'pointer',
            border: 'none',
            backgroundColor: '#5a94fa',
          }}>
          clickable
        </button>
      </div>
    </>
  );
};

export default ChannelListContainer;
