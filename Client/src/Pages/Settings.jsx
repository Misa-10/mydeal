import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("jwtToken")) {
      navigate("/");
    }
  });

  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

  const [decodedToken, setDecodedToken] = useState(null);

  const validateForm = (field) => {
    switch (field) {
      case "username":
        return usernameRegex.test(formData.username);
      case "email":
        return emailRegex.test(formData.email);
      case "newPassword":
        return passwordRegex.test(formData.newPassword);
      default:
        return false;
    }
  };

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");

    if (jwtToken) {
      const decoded = jwtToken ? jwtDecode(jwtToken) : null;
      setDecodedToken(decoded);
      setFormData({
        username: decoded.username || "",
        email: decoded.email || "",
        currentPassword: "",
        newPassword: "",
      });
    }
  }, []);

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

  const handleSubmit = (e, field) => {
    e.preventDefault();

    if (!validateForm(field)) {
      showToast("error", "Le champ n'est pas valide");
      return;
    }

    if (!decodedToken) {
      showToast("error", "Token est vide");
      return;
    }

    const updatedField = {
      [field]: formData[field],
    };
    console.log(updatedField);
    const options = {
      method: "PUT",
      url: `http://localhost:3001/api/users/${decodedToken.id}`,
      data: updatedField,
    };

    axios
      .request(options)
      .then(function (response) {
        const token = response.data.token;
        localStorage.removeItem("jwtToken");
        localStorage.setItem("jwtToken", token);
        showToast(
          "success",
          "Vos informations ont été mises à jour avec succès."
        );
      })
      .catch(function (error) {
        console.error(error);
        showToast("error", "Une erreur s'est produite.");
      });
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();

    const options = {
      method: "DELETE",
      url: `http://localhost:3001/api/users/${decodedToken.id}`,
    };

    axios
      .request(options)
      .then(function () {
        localStorage.removeItem("jwtToken");
        navigate("/");
        showToast("success", "Votre compte a été supprimé avec succès.");
      })
      .catch(function (error) {
        console.error(error);
        showToast("error", "Une erreur s'est produite.");
      });
  };

  return (
    <div className="bg-background flex items-center justify-center h-he1">
      <div className="bg-secondary p-8 rounded-lg w-full max-w-md animate-fade-up animate-once animate-delay-100">
        <h2 className="text-3xl text-primary mb-4">Settings</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="username" className="block text-text mb-1">
              Username:
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-fade text-text focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={(e) => handleSubmit(e, "username")}
                className="bg-primary text-text px-4 py-2 rounded hover:bg-accent focus:outline-none ml-2"
              >
                Save
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-text mb-1">
              Email:
            </label>
            <div className="flex items-center">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-fade text-text focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={(e) => handleSubmit(e, "email")}
                className="bg-primary text-text px-4 py-2 rounded hover:bg-accent focus:outline-none ml-2"
              >
                Save
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-text mb-1">
              New Password:
            </label>
            <div className="flex items-center">
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-fade text-text focus:outline-none"
              />
              <button
                type="button"
                onClick={(e) => handleSubmit(e, "newPassword")}
                className="bg-primary text-text px-4 py-2 rounded hover:bg-accent focus:outline-none ml-2"
              >
                Save
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="bg-red-500 text-text px-4 py-2 rounded hover:bg-red-700 focus:outline-none"
          >
            Delete Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
