import { useContext, useEffect } from "react";
import LoginForm from "../components/LoginForm"
import { useNavigate } from "react-router-dom";
import authContext from "../../context/AuthContext";

const SignInPage = () => {

  const { value } = useContext(authContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (value) navigate("/account");
  }, [navigate, value]);

  return (
    <LoginForm />
  )
}

export default SignInPage