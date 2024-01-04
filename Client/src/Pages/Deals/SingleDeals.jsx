import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTruck } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const SingleDeal = () => {
  const [deal, setDeal] = useState(null);
  const [userId, setUserId] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/deals/${id}`);
        setDeal(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du deal :", error);
      }
    };

    fetchDeal();
  }, [id]);

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    const decodedToken = jwtToken ? jwtDecode(jwtToken) : null;
    setUserId(decodedToken.id);
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
      await axios.delete(`http://localhost:3001/deals/${id}`);
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

  return (
    <div className="bg-background p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-primary mb-4">{deal.title}</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="text-lg text-accent">
            <s className="text-gray-500">{deal.base_price} €</s>{" "}
            <span className="text-primary">→ {deal.price} €</span>
          </span>
        </div>
        <div className="flex items-center">
          <FaTruck className="mr-2 text-primary" />
          <span className="text-lg text-primary">{deal.shipping_cost} €</span>
        </div>
      </div>

      <img
        src={`http://localhost:3001/images/${deal.image1}`}
        alt={`Deal ${deal.title}`}
        className="w-full max-h-96 object-cover rounded-lg mb-4"
      />

      <p className="text-text mb-4">{deal.description}</p>

      <div className="flex justify-between items-center mb-4">
        {deal.permanent === false ? (
          <span className="text-lg text-primary">
            Du {startDate} au {endDate}
          </span>
        ) : deal.permanent === true ? (
          <span className="text-lg text-primary">Offre permanente</span>
        ) : null}
        <a
          href={deal.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-text px-4 py-2 rounded hover:bg-accent text-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Voir le deal
        </a>
        {userId === deal.creator_id && (
          <>
            <a
              href={`/deal/edit/${deal.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-text px-4 py-2 rounded hover:bg-accent text-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Modifier le deal
            </a>
            <div className="flex items-center">
              <button
                onClick={handleDeleteConfirmation}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Supprimer le deal
              </button>
            </div>
          </>
        )}
      </div>

      <p className="text-text">
        <span className="font-bold">Marque:</span> {deal.brand}
      </p>
    </div>
  );
};

export default SingleDeal;
