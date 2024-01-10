import React, { useState, useEffect } from "react";
import Modal from "./Modal";

import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import BurgerMenu from "./BurgerMenu";
import { FaCog, FaSignOutAlt, FaBars } from "react-icons/fa";
import _debounce from "lodash/debounce";

const Navbar = ({ onDataFromNavbar }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    avatar: "",
  });

  const navigate = useNavigate();
  const [isMenuOpenBurger, setMenuOpenBurger] = useState(false);

  const openMenuBurger = () => {
    setMenuOpenBurger(true);
  };

  const closeMenuBurger = () => {
    setMenuOpenBurger(false);
  };

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      setIsLogin(true);
      const decoded = jwtToken ? jwtDecode(jwtToken) : null;
      setUserData({
        username: decoded.username || "",
        email: decoded.email || "",
        avatar: decoded.avatar || "",
      });
    } else {
      setIsLogin(false);
    }
  }, []);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleLogout = () => {
    setIsLogin(false);
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const debouncedSearch = _debounce((value) => {
    setDebouncedSearchTerm(value);
  }, 300);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    debouncedSearch(event.target.value);
  };

  useEffect(() => {
    onDataFromNavbar(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <>
      <div className="bg-secondary p-4 flex justify-between items-center ">
        <img
          src="http://localhost:3000/BlueDeals.png"
          alt="Logo"
          className="cursor-pointer w-16 h-16 rounded"
          onClick={() => navigate("/")}
        />

        <input
          type="text"
          placeholder="Rechercher"
          className="p-2 rounded bg-fade text-text focus:outline-none"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {isLogin ? (
          <div className="flex items-center space-x-4">
            <button
              className="bg-primary text-text py-2 px-4 rounded hover:bg-accent focus:outline-none max-md:hidden"
              onClick={() => navigate("/deal/create")}
            >
              Créer un Deal
            </button>
            {/* <button
            className="bg-primary text-text py-2 px-4 rounded hover:bg-accent focus:outline-none"
            onClick={() => navigate("/promo/create")}
          >
            Créer un Code Promo
          </button> */}
            <div className="rounded-full overflow-hidden w-12 h-12">
              <img
                src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${userData.avatar}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <button
              className="text-primary hover:text-accent focus:outline-none max-md:hidden"
              title="Settings"
              onClick={() => navigate("/settings")}
            >
              <FaCog size={24} />
            </button>
            <button
              onClick={handleLogout}
              className="text-primary hover:text-accent focus:outline-none max-md:hidden"
              title="Log Out"
            >
              <FaSignOutAlt size={24} />
            </button>

            <button
              className="text-primary hover:text-accent focus:outline-none md:hidden"
              title="Toggle Menu"
              onClick={openMenuBurger}
            >
              <FaBars size={24} />
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

        {isModalOpen && <Modal onClose={closeModal} />}
      </div>
      {isMenuOpenBurger && (
        <BurgerMenu isOpen={isMenuOpenBurger} onClose={closeMenuBurger} />
      )}
    </>
  );
};

export default Navbar;
