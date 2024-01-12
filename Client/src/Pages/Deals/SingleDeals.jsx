import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";
import { FaTruck } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Loading from "../../Components/Loading";
import { Buffer } from "buffer";

const SingleDeal = () => {
  const [deal, setDeal] = useState(null);
  const [userId, setUserId] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`deals/${id}`);
        setDeal(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du deal :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [id]);

  useEffect(() => {
    if (localStorage.getItem("jwtToken")) {
      const jwtToken = localStorage.getItem("jwtToken");
      const decodedToken = jwtToken ? jwtDecode(jwtToken) : null;
      setUserId(decodedToken.id);
    }
  }, []);

  if (!deal) {
    return <div>Loading...</div>;
  }

  const startDate = new Date(deal.start_date).toLocaleDateString("fr-FR");
  const endDate = new Date(deal.end_date).toLocaleDateString("fr-FR");

  const handleDeleteConfirmation = () => {
    const isConfirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce deal ?"
    );
    if (isConfirmed) {
      handleDeleteDeal();
    }
  };

  const handleDeleteDeal = async () => {
    try {
      await axios.delete(`deals/${id}`);
      showToast("success", "Deal supprimé avec succès");
      navigate("/");
    } catch (error) {
      showToast("error", "Erreur lors de la suppression du deal");
      console.error("Erreur lors de la suppression du deal :", error);
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

  let image1;

  if (deal.image1 === null) {
    console.error("Image is null for deal:", deal);
  } else if (
    deal.image1 &&
    typeof deal.image1 === "object" &&
    deal.image1.data
  ) {
    image1 = Buffer.from(deal.image1.data, "binary").toString("base64");
  } else {
    console.error("Unsupported image format:", deal.image1);

    throw new Error("Unsupported image format");
  }

  return (
    <div className="bg-background p-8 rounded-lg shadow-lg max-sm:p-4">
      <div className="flex  items-start mb-4 max-sm:flex-col max-sm:items-center">
        <div className="sm:w-full md:w-1/2 pr-4 ">
          <img
            src={`data:image/png;base64,${image1}`}
            alt={`Deal ${deal.title}`}
            className="w-full max-h-96 object-cover rounded-lg mb-4 max-sm:max-h-64"
          />
        </div>
        <div className="sm:w-full md:w-1/2  mb-4 md:mb-0 pl-4">
          <h2 className="text-3xl font-bold text-primary mb-4 max-lg:text-2xl">
            {deal.title}
          </h2>
          <p className="text-text mb-2">
            <span className="font-bold">Marque:</span> {deal.brand}
          </p>
          <p className="text-text mb-2">
            <span className="font-bold">Description:</span> {deal.description}
          </p>
          <p className="text-lg text-primary mb-2 max-lg:text-base">
            {deal.permanent === false
              ? `Du ${startDate} au ${endDate}`
              : deal.permanent === true
              ? "Offre permanente"
              : null}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 max-sm:flex-col-reverse">
        <div className="sm:w-1/2 flex justify-evenly max-lg:flex-col max-lg:align-center max-sm:mt-6">
          <a
            href={deal.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-text px-4 py-2 rounded hover:bg-accent text-lg transition duration-300 ease-in-out transform hover:scale-105 mt-2 text-center max-lg:text-base max-lg:w-60"
          >
            Voir le deal
          </a>
          {parseInt(userId) === deal.creator_id && (
            <>
              <a
                href={`/deal/edit/${deal.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-text px-4 py-2 rounded hover:bg-accent text-lg transition duration-300 ease-in-out transform hover:scale-105 mt-2 text-center max-lg:text-base max-lg:w-60"
              >
                Modifier le deal
              </a>
              <button
                onClick={handleDeleteConfirmation}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-lg transition duration-300 ease-in-out transform hover:scale-105 mt-2 text-center max-lg:text-base max-lg:w-60"
              >
                Supprimer le deal
              </button>
            </>
          )}
        </div>
        <div className="sm:w-1/2 flex">
          <div className="flex items-center mr-8 ">
            <span className="text-xl text-accent max-lg:text-lg">
              <s className="text-gray-500">{deal.base_price} €</s>{" "}
              <span className="text-primary">→ {deal.price} €</span>
            </span>
          </div>
          <div className="flex items-center">
            <FaTruck className="mr-2 text-primary" />
            <span className="text-lg text-primary max-lg:text-base">
              {deal.shipping_cost} €
            </span>
          </div>
        </div>
      </div>

      {loading && <Loading />}
    </div>
  );
};

export default SingleDeal;
