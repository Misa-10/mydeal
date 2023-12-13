import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const CreateDeal = () => {
  const [isPermanent, setIsPermanent] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    price: 0,
    link: "",
    shipping_cost: 0,
    base_price: 0,
    brand: "",
    permanent: isPermanent,
    creator_id: null,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const [imagePreviews, setImagePreviews] = useState([]);

  const navigate = useNavigate();

  const [dateFieldsDisabled, setDateFieldsDisabled] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
      setIsPermanent(checked);
      setDateFieldsDisabled(checked); // Désactive les champs de date et d'heure si la case est cochée
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    const previews = [...imagePreviews];
    let formDataImages = formData.images || [];

    // Limiter à un maximum de 3 images
    const remainingSlots = 3 - formDataImages.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    for (let i = 0; i < filesToAdd.length; i++) {
      const file = filesToAdd[i];
      const reader = new FileReader();

      reader.onloadend = () => {
        previews.push(reader.result);

        if (i === filesToAdd.length - 1) {
          setImagePreviews(previews);
        }
      };

      reader.readAsDataURL(file);
      formDataImages.push(file);
    }

    // Assurez-vous que formData.images est initialisé comme un tableau
    formDataImages = formDataImages || [];

    setFormData({ ...formData, images: formDataImages });
  };

  const handleRemoveImage = (index) => {
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);

    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);

    setImagePreviews(updatedPreviews);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleNextPage = () => {
    setCurrentPage(2);
  };

  const handlePrevPage = () => {
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Envoie les images et récupère les URL
      const imageUrls = await uploadImages();

      const jwtToken = localStorage.getItem("jwtToken");
      const decoded = jwtToken ? jwtDecode(jwtToken) : null;
      const user_id = decoded.id;

      const formattedStartDate = `${formData.start_date} ${formData.start_time}:00+00`;
      const formattedEndDate = `${formData.end_date} ${formData.end_time}:00+00`;

      // Met à jour les données du deal avec les URL des images
      const dealDataWithImages = {
        title: formData.title,
        description: formData.description,
        start_date: formData.permanent == false ? formattedStartDate : null,
        end_date: formData.permanent == false ? formattedEndDate : null,
        price: formData.price,
        link: formData.link,
        shipping_cost: formData.shipping_cost,
        base_price: formData.base_price,
        brand: formData.brand,
        image1: imageUrls[0] || null,
        image2: imageUrls[1] || null,
        image3: imageUrls[2] || null,
        permanent: formData.permanent,
        creator_id: parseInt(user_id),
      };

      // Envoie les données du deal au serveur
      const response = await axios.post(
        "http://localhost:3001/deals",
        dealDataWithImages
      );

      navigate(`/deals/${response.data.id}`);
      showToast("success", "Deal créé avec succès");
      console.log("Deal créé avec succès :", response.data);
    } catch (error) {
      showToast("error", "Erreur lors de la création du deal");
      console.error("Erreur lors de la création du deal :", error);
    }
  };

  const uploadImages = async () => {
    try {
      const formDataToUpload = new FormData();

      for (let i = 0; i < formData.images.length; i++) {
        formDataToUpload.append(`images`, formData.images[i]);
      }

      const response = await axios.post(
        "http://localhost:3001/deals/upload-image",
        formDataToUpload
      );

      // Récupère les noms de fichier des images téléchargées
      const filenames = response.data.filenames;

      // Construit les URL complètes des images téléchargées
      const imageUrls = filenames.map((filename) => `${filename}`);

      return imageUrls;
    } catch (error) {
      console.error("Erreur lors de l'envoi des images :", error);
      throw new Error("Erreur lors de l'envoi des images");
    }
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

  return (
    <div className="bg-background flex items-center justify-center h-he1">
      <div className="bg-secondary p-8 rounded-lg w-full max-w-2xl animate-fade-up animate-once animate-delay-100">
        <h2 className="text-3xl text-primary mb-4">Create Deal</h2>
        {currentPage === 1 && (
          <form onSubmit={handleNextPage} className="flex flex-wrap">
            <div className="w-full md:w-1/2 pr-4">
              <div className="block text-text mb-1">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-text"
                >
                  Titre
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-fade text-text focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-text"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-fade text-text focus:outline-none"
                  style={{ resize: "none" }}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="isPermanent"
                  className="block text-sm font-medium text-text"
                >
                  Deal Permanent
                </label>
                <input
                  type="checkbox"
                  id="isPermanent"
                  name="permanent"
                  checked={isPermanent}
                  onChange={handleChange}
                  className="ml-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="start_date"
                  className="block text-sm font-medium text-text"
                >
                  Date de début
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className={`w-full p-2 rounded bg-fade text-text focus:outline-none dark:[color-scheme:dark] ${
                    dateFieldsDisabled ? "bg-disabledBackground" : ""
                  }`}
                  disabled={dateFieldsDisabled}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="end_date"
                  className="block text-sm font-medium text-text"
                >
                  Date de fin
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className={`w-full p-2 rounded bg-fade text-text focus:outline-none dark:[color-scheme:dark] ${
                    dateFieldsDisabled ? "bg-disabledBackground" : ""
                  }`}
                  disabled={dateFieldsDisabled}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="start_time"
                  className="block text-sm font-medium text-text"
                >
                  Heure de début
                </label>
                <input
                  type="time"
                  id="start_time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className={`w-full p-2 rounded bg-fade text-text focus:outline-none dark:[color-scheme:dark] ${
                    dateFieldsDisabled ? "bg-disabledBackground" : ""
                  }`}
                  disabled={dateFieldsDisabled}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="end_time"
                  className="block text-sm font-medium text-text"
                >
                  Heure de fin
                </label>
                <input
                  type="time"
                  id="end_time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  className={`w-full p-2 rounded bg-fade text-text focus:outline-none dark:[color-scheme:dark] ${
                    dateFieldsDisabled ? "bg-disabledBackground" : ""
                  }`}
                  disabled={dateFieldsDisabled}
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 pl-4">
              <div className="mb-4">
                <label
                  htmlFor="link"
                  className="block text-sm font-medium text-text"
                >
                  Lien
                </label>
                <input
                  type="text"
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-fade text-text focus:outline-none"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="shipping_cost"
                  className="block text-sm font-medium text-text"
                >
                  Frais de port
                </label>
                <input
                  type="number"
                  id="shipping_cost"
                  name="shipping_cost"
                  value={formData.shipping_cost}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-fade text-text focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-text"
                >
                  Marque
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-fade text-text focus:outline-none"
                  required
                />
              </div>
              <div className="flex items-center mb-4">
                <div className="w-1/2 pr-2">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-text"
                  >
                    Prix
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-fade text-text focus:outline-none"
                    required
                  />
                </div>
                <div className="w-1/2 pl-2">
                  <label
                    htmlFor="base_price"
                    className="block text-sm font-medium text-text"
                  >
                    Prix de base
                  </label>
                  <input
                    type="number"
                    id="base_price"
                    name="base_price"
                    value={formData.base_price}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-fade text-text focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextPage}
              className="bg-primary text-text px-4 py-2 rounded hover:bg-accent focus:outline-none"
            >
              Suivant
            </button>
          </form>
        )}
        {currentPage === 2 && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4 ">
              <label
                htmlFor="images"
                className="block text-sm font-medium text-text"
              >
                Images
              </label>
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                onChange={handleImageChange}
                multiple
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-primary text-text"
              />
            </div>

            <div className="flex flex-wrap -mx-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="mb-4 ml-4">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="max-w-xs h-auto object-cover w-40"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="mt-2 bg-red-500 text-text px-4 py-2 rounded hover:bg-red-700 focus:outline-none"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handlePrevPage}
              className="mr-2 bg-secondary text-text px-4 py-2 rounded hover:bg-accent focus:outline-none"
            >
              Précédent
            </button>

            <button
              type="submit"
              className="bg-primary text-text px-4 py-2 rounded hover:bg-accent focus:outline-none"
            >
              Créer le Deal
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateDeal;
