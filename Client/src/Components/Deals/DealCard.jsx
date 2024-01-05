// DealCard.jsx
import React from "react";
import { FaTruck } from "react-icons/fa";

const DealCard = ({ deal }) => {
  // Formater les dates
  const startDate = new Date(deal.start_date).toLocaleDateString("fr-FR");
  const endDate = new Date(deal.end_date).toLocaleDateString("fr-FR");

  // eslint-disable-next-line no-undef
  const BaseAPIurl = process.env.REACT_APP_API_BASE_URL;

  return (
    <div
      className="bg-secondary p-6 mb-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
      onClick={() => {
        window.location.href = `/deal/${deal.id}`;
      }}
    >
      <div className="flex justify-around items-center mb-4">
        <h2 className="text-2xl font-bold text-primary mb-2">{deal.title}</h2>
        <img
          src={`${BaseAPIurl}images/${deal.image1}`}
          alt={`Deal ${deal.title}`}
          className="w-20 h-20 object-cover rounded-lg mr-4"
        />
      </div>
      <div className="flex justify-center items-center mb-4">
        <p className="text-text mb-2">{deal.description}</p>
      </div>

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

      <div className="flex justify-between items-center">
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
          className="bg-primary text-text px-4 py-2 rounded hover:bg-accent text-lg"
        >
          Voir le deal
        </a>
      </div>
    </div>
  );
};

export default DealCard;
