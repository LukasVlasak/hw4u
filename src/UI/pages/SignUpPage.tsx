import { useContext, useEffect } from "react";
import RegisterForm from "../components/RegisterForm"
import { useNavigate } from "react-router-dom";
import authContext from "../../context/AuthContext";

const SignUpPage = () => {

  const { value } = useContext(authContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (value) navigate("/account");
  }, [navigate, value]);

  return (
    <RegisterForm />
  )
}

export default SignUpPage