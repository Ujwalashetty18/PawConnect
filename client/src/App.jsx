import { Routes, Route, Navigate } from "react-router-dom";
import MyAdoptions from "./pages/MyAdoptions";
import AdminAdoptions from "./pages/AdminAdoptions";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Donation from "./pages/Donation";
import Home from "./pages/Home";
import Pets from "./pages/Pets";
import PetDetails from "./pages/PetDetails";
import AddPet from "./pages/AddPet";
import AdoptionRequest from "./pages/AdoptionRequest";
import MyPets from "./pages/MyPets";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/home" />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Public */}
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Dashboard */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/my-adoptions" element={<MyAdoptions />} />
      {/* Find Pets */}
      <Route
        path="/pets"
        element={
          <ProtectedRoute>
            <Pets />
          </ProtectedRoute>
        }
      />

      {/* Pet Details */}
      <Route
        path="/pets/:id"
        element={
          <ProtectedRoute>
            <PetDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donations"
        element={
          <ProtectedRoute>
            <Donation />
          </ProtectedRoute>
        }
      />

      {/* Put My Pet Up For Adoption */}
      <Route
        path="/add-pet"
        element={
          <ProtectedRoute>
            <AddPet />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-pets"
        element={
          <ProtectedRoute>
            <MyPets />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/adoptions" element={<AdminAdoptions />} />
      {/* Adoption Request */}
      <Route
        path="/pets/:id/adopt"
        element={
          <ProtectedRoute>
            <AdoptionRequest />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
