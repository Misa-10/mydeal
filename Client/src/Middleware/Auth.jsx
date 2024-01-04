import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Auth = (WrappedComponent) => {
  const WithAuthMiddleware = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      const hasToken = localStorage.getItem("jwtToken");

      if (!hasToken) {
        navigate("/");
      }
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };

  return WithAuthMiddleware;
};

export default Auth;
