import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import AddPet from "./pages/AddPet";
import ProtectedRoute from "./components/ProtectedRoute";

import AdoptionRequest from "./pages/AdoptionRequest";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Pets from "./pages/Pets";
import PetDetails from "./pages/PetDetails";

import "./App.css";

function App() {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/home" />} />

      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/register" element={<Register />} />
      <Route
        path="/pets"
        element={
          <ProtectedRoute>
            <Pets />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pets/:id"
        element={
          <ProtectedRoute>
            <PetDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-pet"
        element={
          <ProtectedRoute>
            <AddPet />
          </ProtectedRoute>
        }
      />

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
