import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Auth from "../../Middleware/Auth";
import { Buffer } from "buffer";

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

        setImagePreviews(
          images.map((image) => {
            if (typeof image === "object" && image.data) {
              return Buffer.from(image.data, "binary").toString("base64");
            } else if (image == null) {
              console.error("Image is null ");
            } else {
              console.error("Unsupported image format:", image);
              throw new Error("Unsupported image format");
            }
          })
        );

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

    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);

    setImagePreviews(updatedPreviews);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const decoded = jwtToken ? jwtDecode(jwtToken) : null;
      const user_id = decoded.id;

      const formattedStartDate = `${formData.start_date} ${formData.start_time}:00+00`;
      const formattedEndDate = `${formData.end_date} ${formData.end_time}:00+00`;

      const dealData = new FormData();

      dealData.append("title", formData.title);
      dealData.append("description", formData.description);
      if (formData.permanent === false) {
        dealData.append("start_date", formattedStartDate);
        dealData.append("end_date", formattedEndDate);
      }
      dealData.append("price", formData.price);
      dealData.append("link", formData.link);
      dealData.append("shipping_cost", formData.shipping_cost);
      dealData.append("base_price", formData.base_price);
      dealData.append("brand", formData.brand);
      dealData.append("permanent", formData.permanent);
      dealData.append("creator_id", parseInt(user_id));

      formData.images.forEach((file, index) => {
        if (file instanceof File) {
          dealData.append("image", file);
        } else if (file instanceof Object) {
          dealData.append(`image${index + 1}`, file);
        }
      });

      await axios.put(`deals/${id}`, dealData);

      showToast("success", "Deal modifié avec succès");

      navigate(`/deals/${id}`);
    } catch (error) {
      showToast("error", "Erreur lors de la modification du deal");
      console.error("Erreur lors de la modification du deal :", error);
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
                    src={
                      preview.startsWith("data")
                        ? preview
                        : `data:image/png;base64,${preview}`
                    }
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
