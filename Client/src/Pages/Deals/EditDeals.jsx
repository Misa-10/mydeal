import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Auth from "../../Middleware/Auth";

const EditDeal = () => {
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
    permanent: false,
    creator_id: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [imagePreviews, setImagePreviews] = useState([]);
  const navigate = useNavigate();

  const [isPermanent, setIsPermanent] = useState(false);
  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`deals/${id}`);
        response.data.permanent && setIsPermanent(true);

        const formattedData = {
          ...response.data,
          start_date: new Date(response.data.start_date)
            .toISOString()
            .split("T")[0],
          end_date: new Date(response.data.end_date)
            .toISOString()
            .split("T")[0],
          start_time: new Date(response.data.start_date)
            .toISOString()
            .split("T")[1]
            .slice(0, 5),
          end_time: new Date(response.data.end_date)
            .toISOString()
            .split("T")[1]
            .slice(0, 5),
        };

        const images = [
          response.data.image1,
          response.data.image2,
          response.data.image3,
        ].filter((image) => image);

        setImagePreviews(images.map((image) => `${BaseAPIurl}images/${image}`));

        setFormData({ ...formattedData, images });
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du deal :",
          error
        );
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    if (e.target.name === "permanent") {
      setIsPermanent(e.target.value === "true");
    }

    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    formDataImages = formDataImages || [];

    setFormData({ ...formData, images: formDataImages });
  };

  const handleRemoveImage = (index) => {
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);

    console.log(formData.images);

    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);

    setImagePreviews(updatedPreviews);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const imageUrls = await uploadImages();

      const jwtToken = localStorage.getItem("jwtToken");
      const decoded = jwtToken ? jwtDecode(jwtToken) : null;
      const user_id = decoded.id;

      const formattedStartDate = `${formData.start_date} ${formData.start_time}:00+00`;
      const formattedEndDate = `${formData.end_date} ${formData.end_time}:00+00`;

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

      await axios.put(`deals/${id}`, dealDataWithImages);

      showToast("success", "Deal modifié avec succès");

      navigate(`/deals/${id}`);
    } catch (error) {
      showToast("error", "Erreur lors de la modification du deal");
      console.error("Erreur lors de la modification du deal :", error);
    }
  };

  const uploadImages = async () => {
    try {
      const formDataToUpload = new FormData();

      for (let i = 0; i < formData.images.length; i++) {
        formDataToUpload.append(`images`, formData.images[i]);
      }

      const response = await axios.post("deals/upload-image", formDataToUpload);

      const filenames = response.data.filenames;

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

  const handleNextPage = () => {
    setCurrentPage(2);
  };

  const handlePrevPage = () => {
    setCurrentPage(1);
  };

  // eslint-disable-next-line no-undef
  const BaseAPIurl = process.env.REACT_APP_API_BASE_URL;

  return (
    <div className="bg-background flex items-center justify-center h-he1">
      <div className="bg-secondary p-8 rounded-lg w-full max-w-2xl animate-fade-up animate-once animate-delay-100">
        <h2 className="text-3xl text-primary mb-4">Modifier le Deal</h2>
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
                <div className="flex items-center">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="permanent"
                      value="true"
                      checked={isPermanent}
                      onChange={handleChange}
                      className="form-radio h-5 w-5 text-primary"
                    />
                    <span className="ml-2 text-text">Permanent</span>
                  </label>
                  <label className="inline-flex items-center ml-4">
                    <input
                      type="radio"
                      name="permanent"
                      value="false"
                      checked={!isPermanent}
                      onChange={handleChange}
                      className="form-radio h-5 w-5 text-primary"
                    />
                    <span className="ml-2 text-text">Non Permanent</span>
                  </label>
                </div>
              </div>
              {!isPermanent && (
                <>
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
                      className={`w-full p-2 rounded bg-fade text-text focus:outline-none dark:[color-scheme:dark]`}
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
                      className={`w-full p-2 rounded bg-fade text-text focus:outline-none dark:[color-scheme:dark] `}
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
                      className={`w-full p-2 rounded bg-fade text-text focus:outline-none dark:[color-scheme:dark]`}
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
                      className={`w-full p-2 rounded bg-fade text-text focus:outline-none dark:[color-scheme:dark]`}
                    />
                  </div>
                </>
              )}
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
              Modifier le Deal
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth(EditDeal);
