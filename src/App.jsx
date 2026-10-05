import { useContext } from 'react';
import { Route, Routes } from 'react-router';


import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Dashboard from './components/Dashboard/Dashboard'
import Landing from './components/Landing/Landing'
import Profile from './components/Profile/Profile'
import ClientDashboard from './components/ClientDasboard/ClientDashboard';
import DonationDetails from './components/DonationDetails/DonationDetails';
import ItemDetails from './components/ItemDetails/ItemDetails';
import DonationRequest from './components/DonationRequest/DonationRequest';
import AdminDashboard from './components/Admin/AdminDashboard';


import { UserContext } from './contexts/UserContext';

const App = () => {
  const { user } = useContext(UserContext)

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path='/register' element={<SignUpForm />} />
        <Route path='/login' element={<SignInForm />} />

        <Route path='/profile' element={<Profile />}/>
        <Route path='/client/dashboard' element={<ClientDashboard />}/>
        <Route path='/client/donations/:id'element={<DonationDetails />}/>
        <Route path='/client/donations/new' element={<DonationRequest />}/>

        <Route path='/client/items/:id' element={<ItemDetails /> }/>

        <Route path='/admin/dashboard' element={<AdminDashboard/>}/>

      </Routes>
    </>
  );
};

export default App;
