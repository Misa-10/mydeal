// Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import DealCard from "../Components/DealCard";

const Home = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    // Effectuez la requête pour obtenir la liste des deals depuis votre API
    const fetchDeals = async () => {
      try {
        const response = await axios.get("http://localhost:3001/deals");
        setDeals(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des deals :", error);
      }
    };

    fetchDeals();
  }, []); // Assurez-vous de ne déclencher cette requête qu'une seule fois (au montage du composant)

  return (
    <div className="bg-background text-text">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8">Les dernières offres</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
