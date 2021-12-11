/** @format */

import React, { useEffect, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

import { InviteIcon } from '../assets/InviteIcon';

const ListContainer: React.FC = ({ children }) => {
  return (
    <div className='user-list__container'>
      <div className='user-list__header'>
        <p>User</p>
        <p>Invite</p>
      </div>
      {children}
    </div>
  );
};

interface UserItemProps {
  user: any;
  setSelectedUsers: any;
}

const UserItem: React.FC<UserItemProps> = ({ user, setSelectedUsers }) => {
  const [selected, setSelected] = useState(false);

  const handleSelect = () => {
    if (selected) {
      setSelectedUsers((prevUsers: any[]) =>
        prevUsers.filter((prevUser: any) => prevUser !== user.id)
      );
    } else {
      setSelectedUsers((prevUsers: any) => [...prevUsers, user.id]);
    }

    setSelected((prevSelected) => !prevSelected);
  };

  return (
    <div className='user-item__wrapper' onClick={handleSelect}>
      <div className='user-item__name-wrapper'>
        <Avatar image={user.image} name={user.fullName || user.id} size={32} />
        <p className='user-item__name'>{user.fullName || user.id}</p>
      </div>
      {selected ? <InviteIcon /> : <div className='user-item__invite-empty' />}
    </div>
  );
};

interface UserListProps {
  setSelectedUsers: any;
}

const UserList: React.FC<UserListProps> = ({ setSelectedUsers }) => {
  const { client } = useChatContext();
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [listEmpty, setListEmpty] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const getUsers = async () => {
      if (loading) return;

      setLoading(true);

      try {
        const response = await client.queryUsers(
          { id: { $ne: client.userID! } },
          { id: 1 },
          { limit: 8 }
        );

        if (response.users.length) {
          setUsers(response.users);
        } else {
          setListEmpty(true);
        }
      } catch (error) {
        setError(true);
      }
      setLoading(false);
    };

    if (client) getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <ListContainer>
        <div className='user-list__message'>
          Error loading, please refresh and try again.
        </div>
      </ListContainer>
    );
  }

  if (listEmpty) {
    return (
      <ListContainer>
        <div className='user-list__message'>No users found.</div>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      {loading ? (
        <div className='user-list__message'>Loading users...</div>
      ) : (
        users?.map((user: any, i: any) => (
          <UserItem
            key={user.id}
            user={user}
            setSelectedUsers={setSelectedUsers}
          />
        ))
      )}
    </ListContainer>
  );
};

export default UserList;
