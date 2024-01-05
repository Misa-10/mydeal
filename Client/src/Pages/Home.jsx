// Home.jsx
import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import DealCard from "../Components/Deals/DealCard";
import Pagination from "../Components/Pagination";

const Home = () => {
  const [deals, setDeals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(20);

  const fetchDeals = async (page) => {
    try {
      const response = await axios.get(`deals?page=${page}`);

      setDeals(response.data.deals);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Erreur lors de la récupération des deals :", error);
    }
  };

  useEffect(() => {
    fetchDeals(currentPage);
  }, [currentPage]);

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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Home;
