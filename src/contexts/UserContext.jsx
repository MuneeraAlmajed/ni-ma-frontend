import { createContext, useEffect, useState } from 'react';
import { getUserFromToken } from '../lib/helpers/jwt-helpers';
import { currentUser } from '../services/userService';

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getUserFromToken();

    if (token) {
      currentUser()
        .then((data) => {
          setUser(data);
        })
        .catch(() => {
          setUser(null);
        });
    }
  }, []);

  const value = { user, setUser };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider, UserContext };