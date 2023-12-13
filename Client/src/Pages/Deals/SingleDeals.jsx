import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTruck } from "react-icons/fa";
import { useParams } from "react-router-dom";

const SingleDeal = () => {
  const [deal, setDeal] = useState(null);
  const { id } = useParams();

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

  if (!deal) {
    return <div>Loading...</div>;
  }

  // Formater les dates
  const startDate = new Date(deal.start_date).toLocaleDateString("fr-FR");
  const endDate = new Date(deal.end_date).toLocaleDateString("fr-FR");

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
        src={`http://localhost:3001/img/${deal.image1}`}
        alt={`Deal ${deal.title}`}
        className="w-full max-h-96 object-cover rounded-lg mb-4"
      />

      <p className="text-text mb-4">{deal.description}</p>

      <div className="flex justify-between items-center mb-4">
        <span className="text-lg text-primary">
          Du {startDate} au {endDate}
        </span>
        <a
          href={deal.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-text px-4 py-2 rounded hover:bg-accent text-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Voir le deal
        </a>
        <a
          href={`/deal/edit/${deal.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-text px-4 py-2 rounded hover:bg-accent text-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Modifier le deal
        </a>
      </div>

      <p className="text-text">
        <span className="font-bold">Marque:</span> {deal.brand}
      </p>
    </div>
  );
};

export default SingleDeal;
