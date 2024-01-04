import { toast } from "react-toastify";

const Toast = ({ type, message }) => {
  // eslint-disable-next-line no-unused-vars
  const showToast = () => {
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
};

export default Toast;
