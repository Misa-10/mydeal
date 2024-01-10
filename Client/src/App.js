import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Settings from "./Pages/Settings";
import Navbar from "./Components/Navbar";
import CreateDeal from "./Pages/Deals/CreateDeals";
import SingleDeal from "./Pages/Deals/SingleDeals";
import EditDealPage from "./Pages/Deals/EditDeals";

const App = () => {
  const [dataFromNavbar, setDataFromNavbar] = useState("");

  const handleDataFromNavbar = (data) => {
    setDataFromNavbar(data);
  };

  return (
    <Router>
      <div className="App bg-background flex flex-col w-screen min-h-screen">
        <Navbar onDataFromNavbar={handleDataFromNavbar} />
        <Routes>
          <Route path="/" element={<Home SearchbarTerm={dataFromNavbar} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/deal/create" element={<CreateDeal />} />
          <Route path="/deal/:id" element={<SingleDeal />} />
          <Route path="/deal/edit/:id" element={<EditDealPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
