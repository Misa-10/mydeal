import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  });

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleLogout = () => {
    setIsLogin(false);
    localStorage.removeItem("jwtToken");
  };

  return (
    <div className="bg-secondary p-4 flex justify-between items-center ">
      {/* Logo */}
      <img
        src="http://localhost:3000/BlueDeals.png"
        alt="Logo"
        className="cursor-pointer w-16 h-16 rounded"
        onClick={() => navigate("/")}
      />

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher"
        className="p-2 rounded bg-fade text-text focus:outline-none"
      />

      {isLogin ? (
        <div className="flex items-center space-x-4">
          <div className="rounded-full overflow-hidden w-12 h-12">
            <img
              src="http://localhost:3000/profile.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            className="text-primary hover:text-accent focus:outline-none"
            title="Settings"
            onClick={() => navigate("/settings")}
          >
            <FiSettings size={24} />
          </button>
          <button
            onClick={handleLogout}
            className="text-primary hover:text-accent focus:outline-none"
            title="Log Out"
          >
            <FiLogOut size={24} />
          </button>
        </div>
      ) : (
        <button
          onClick={openModal}
          className="bg-variant-700 text-text py-2 px-4 rounded hover:bg-variant-600 focus:outline-none"
        >
          Connexion / Créer un compte
        </button>
      )}

      {/* Modal for connection / account creation */}
      {isModalOpen && <Modal onClose={closeModal} />}
    </div>
  );
};

export default Navbar;
