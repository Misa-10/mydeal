import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "../axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import Auth from "../Middleware/Auth";

const Settings = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    avatar: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

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
      case "avatar":
        return formData.avatar.length > 0;
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
        avatar: decoded.avatar || "",
      });
      setSelectedAvatar(decoded.avatar);
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

    const options = {
      method: "PUT",
      url: `users/${decodedToken.id}`,
      data: updatedField,
    };

    axios
      .request(options)
      .then(function (response) {
        const token = response.data.token;
        localStorage.removeItem("jwtToken");
        localStorage.setItem("jwtToken", token);
        setDecodedToken(jwtDecode(token));
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
      url: `users/${decodedToken.id}`,
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const BaseurlAvatar = "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=";

  const NameAvatar = [
    "Milo",
    "Maggie",
    "Daisy",
    "Annie",
    "Angel",
    "Garfield",
    "Abby",
    "Bella",
    "Buster",
    "Gracie",
    "Leo",
    "Casper",
    "Max",
    "Chester",
    "Bailey",
    "Charlie",
    "Kiki",
    "Jasper",
  ];

  const [selectedAvatar, setSelectedAvatar] = useState("");

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setFormData({
      ...formData,
      avatar: avatar,
    });
  };

  return (
    <div className="bg-background flex items-center justify-center m-auto">
      <div className="bg-secondary p-8 rounded-lg w-full max-w-md animate-fade-up animate-once animate-delay-100 max-sm:p-4 max-sm:mx-2 ">
        <h2 className="text-3xl text-primary mb-4">Settings</h2>
        <form>
          <div className="mb-4">
            <h3 className="text-xl text-text mb-2">Choose Avatar:</h3>
            <div className="flex flex-wrap gap-2">
              {NameAvatar.map((name) => (
                <div
                  key={name}
                  className={`cursor-pointer rounded-full overflow-hidden border-4 ${
                    selectedAvatar === name
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() => handleAvatarSelect(name)}
                >
                  <img
                    src={`${BaseurlAvatar}${name}`}
                    alt={name}
                    className="w-10 h-10 object-cover"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "avatar")}
              className="bg-primary text-text px-4 py-2 rounded hover:bg-accent focus:outline-none ml-2 mt-4"
            >
              Save
            </button>
          </div>
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

          <div className="mb-4 relative">
            <label htmlFor="newPassword" className="block text-text mb-1">
              New Password:
            </label>
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-fade text-text focus:outline-none pr-10"
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

export default Auth(Settings);
