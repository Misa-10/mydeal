import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import DealCard from "../Components/Deals/DealCard";
import Pagination from "../Components/Pagination";
import Loading from "../Components/Loading";

const Home = ({ SearchbarTerm }) => {
  const [deals, setDeals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(20);
  const [loading, setLoading] = useState(false);

  const fetchDeals = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `deals?page=${page}&name=${SearchbarTerm}`
      );

      setDeals(response.data.deals);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Erreur lors de la récupération des deals :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals(currentPage);
  }, [currentPage, SearchbarTerm]);

  return (
    <div className="bg-background text-text">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8 max-lg:text-3xl max-md:mb-4">
          Les dernières offres
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-up animate-once animate-delay-100">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
        {loading && <Loading />}
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
