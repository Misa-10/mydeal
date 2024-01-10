import React from "react";
import { FaTruck } from "react-icons/fa";
import { Buffer } from "buffer";

const DealCard = ({ deal }) => {
  const startDate = new Date(deal.start_date).toLocaleDateString("fr-FR");
  const endDate = new Date(deal.end_date).toLocaleDateString("fr-FR");

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
    <div
      className="bg-secondary p-6 mb-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
      onClick={() => {
        window.location.href = `/deal/${deal.id}`;
      }}
    >
      <div className="flex justify-around items-center mb-4">
        <h2 className="text-2xl font-bold text-primary mb-2 max-lg:text-xl">
          {deal.title}
        </h2>
        <img
          src={`data:image/png;base64,${image1}`}
          alt={`Deal ${deal.title}`}
          className="w-20 h-20 object-cover rounded-lg mr-4"
        />
      </div>
      <div className="flex justify-center items-center mb-4">
        <p className="text-text mb-2">{deal.description}</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="text-lg text-accent max-lg:text-base">
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

      <div className="flex justify-between items-center max-lg:flex-col">
        {deal.permanent === false ? (
          <span className="text-lg text-primary max-lg:text-base">
            Du {startDate} au {endDate}
          </span>
        ) : deal.permanent === true ? (
          <span className="text-lg text-primary max-lg:text-base">
            Offre permanente
          </span>
        ) : null}

        <a
          href={deal.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-text px-4 py-2 rounded hover:bg-accent text-lg max-2xl:text-base max-lg:mt-4"
        >
          Voir le deal
        </a>
      </div>
    </div>
  );
};

export default DealCard;
