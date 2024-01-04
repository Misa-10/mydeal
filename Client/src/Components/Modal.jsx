import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

const Modal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/; // Regex for a valid username
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for a valid email address
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/; // Regex for a strong password

  const switchForm = () => {
    setIsLogin(!isLogin);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const showToast = (type, message) => {
    toast[type](message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      style: {
        background: "#212a78",
        color: "#fff",
      },
    });
  };

  const validateForm = () => {
    if (isLogin) {
      return emailRegex.test(formData.email) && formData.password.length > 0;
    } else {
      return (
        usernameRegex.test(formData.username) &&
        emailRegex.test(formData.email) &&
        passwordRegex.test(formData.password)
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("error", "Les champs ne sont pas valides");
      return;
    }

    const url = isLogin
      ? "http://localhost:3001/auth/login"
      : "http://localhost:3001/users";

    const options = {
      method: "POST",
      url: url,
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        const { token } = response.data;

        // Save the token to localStorage or a secure storage method
        localStorage.setItem("jwtToken", token);
        if (isLogin) {
          showToast("success", "Vous êtes connecté");
        } else {
          showToast("success", "Votre compte a été créé");
        }
        onClose();
      })
      .catch(function (error) {
        console.error(error);
        showToast("error", "Une erreur est survenue");
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div className="bg-background bg-opacity-75 absolute inset-0"></div>
      <div className="bg-secondary p-6 rounded-lg z-10 relative">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-text hover:text-primary focus:outline-none"
          >
            Fermer
          </button>
        </div>
        <h2 className="text-3xl text-primary mb-4">
          {isLogin ? "Connexion" : "Créer un compte"}
        </h2>

        {isLogin ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-text mb-1">
                Email:
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-fade text-text focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-text mb-1">
                Mot de passe:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-fade text-text focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-primary text-text px-4 py-2 rounded hover:bg-accent"
            >
              Connexion
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="newUsername" className="block text-text mb-1">
                Nom d&apos;utilisateur:
              </label>
              <input
                type="text"
                id="newUsername"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-fade text-text focus:outline-none"
              />
              <ul className="list-disc pl-5 mt-1 text-sm text-text">
                <li>3 à 20 caractères alphanumériques</li>
              </ul>
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-text mb-1">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-fade text-text focus:outline-none"
              />
            </div>

            <div className="mb-4 relative">
              <label htmlFor="newPassword" className="block text-text mb-1">
                Mot de passe:
              </label>
              <div className="flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-fade text-text focus:outline-none pr-10" // Add right padding for the icon
                />
                {showPassword ? (
                  <IoIosEyeOff
                    className="absolute right-2 transform  text-primary cursor-pointer text-xl"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <IoIosEye
                    className="absolute right-2 transform text-primary cursor-pointer text-xl"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>
              <ul className="list-disc pl-5 mt-1 text-sm text-text">
                <li>Au moins 8 caractères</li>
                <li>Au moins une lettre</li>
                <li>Au moins un chiffre</li>
                <li>Au moins une majuscule</li>
              </ul>
            </div>

            <button
              type="submit"
              className="bg-primary text-text px-4 py-2 rounded hover:bg-accent"
            >
              Créer un compte
            </button>
          </form>
        )}
        <p className="mt-4 text-text">
          {isLogin
            ? "Vous n'avez pas de compte ?"
            : "Vous avez déjà un compte ?"}
          <span
            className="text-primary cursor-pointer ml-1"
            onClick={switchForm}
          >
            {isLogin ? "Créez un compte ici" : "Connectez-vous ici"}
          </span>
        </p>
      </div>
    </div>
  );
};

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Modal;
