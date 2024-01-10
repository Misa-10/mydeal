import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const BurgerMenu = ({ isOpen, onClose }) => {
  const menuBurgerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuBurgerRef.current &&
        !menuBurgerRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuBurgerRef, onClose]);

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div
      ref={menuBurgerRef}
      className={`fixed right-0 top-24 h-full flex flex-col justify-between bg-secondary p-6 w-1/3 z-50 rounded-b-lg ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="flex flex-col space-y-4">
        <button
          className="text-text py-2 rounded hover:bg-accent focus:outline-none w-full"
          onClick={() => handleNavigate("/deal/create")}
        >
          Créer un Deal
        </button>
        <button
          className="text-text py-2 rounded hover:bg-accent focus:outline-none w-full"
          onClick={() => handleNavigate("/settings")}
        >
          Paramètres
        </button>
        <button
          onClick={onClose}
          className="text-text py-2 rounded hover:bg-accent focus:outline-none w-full"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
};

export default BurgerMenu;
