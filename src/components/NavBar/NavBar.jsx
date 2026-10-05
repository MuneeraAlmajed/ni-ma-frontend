import { useContext } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import { removeToken } from '../../lib/helpers/jwt-helpers';

const NavBar = () => {

  const { user, setUser } = useContext(UserContext)

  const handleSignOut = ()=>{
    removeToken()
    setUser(null)
  }

  return (
    <nav>
      <ul>

        { user
          ?
          <>
            <li>Hello {user.username}</li>
            <li><Link to="/client/dashboard">Dashboard</Link></li>
            <li><Link to="/" onClick={handleSignOut}>Sign Out</Link></li>
          </>
          :
          <>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to='/register'>Register</Link></li>
            <li><Link to='/login'>Login</Link></li>
          </>
        }
      </ul>
    </nav>
  );
};

export default NavBar;