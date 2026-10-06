import { Route, Routes, useLocation } from "react-router";

import NavBar from "./components/NavBar/NavBar";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import SignInForm from "./components/SignInForm/SignInForm";
import Landing from "./components/Landing/Landing";
import Profile from "./components/Profile/Profile";
import ClientDashboard from "./components/ClientDasboard/ClientDashboard";
import DonationDetails from "./components/DonationDetails/DonationDetails";
import ItemDetails from "./components/ItemDetails/ItemDetails";
import DonationRequest from "./components/DonationRequest/DonationRequest";
import AddItem from "./components/AddItem/AddItem";

import AdminDashboard from "./components/Admin/AdminDashboard";
import CollectorDashboard from "./components/Collector/CollectorDashboard";

const App = () => {
  const location = useLocation();

  const hideNavBar = location.pathname === "/register";

  return (
    <>
      {!hideNavBar && <NavBar />}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<SignUpForm />} />
        <Route path="/login" element={<SignInForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/client/donations/:id" element={<DonationDetails />} />
        <Route path="/client/donations/new" element={<DonationRequest />} />
        <Route path="/client/items/:id" element={<ItemDetails />} />
        <Route
          path="/client/donations/:donationId/items/new"
          element={<AddItem />}
        />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/collectors" element={<AdminDashboard />} />
        <Route path="/admin/donations" element={<AdminDashboard />} />
        <Route path="/collector/dashboard" element={<CollectorDashboard />} />
      </Routes>
    </>
  );
};

export default App;
