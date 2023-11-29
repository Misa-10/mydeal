import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Settings from "./Pages/Settings";
import Navbar from "./Components/Navbar";

const App = () => {
  return (
    <Router>
      <div className="App bg-background flex flex-col w-screen min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
