import { useEffect } from "react";
import useAuth from "../../hooks/useAuth"
import LoginForm from "../components/LoginForm"
import { useNavigate } from "react-router-dom";

const SignInPage = () => {

  const { isError, isFetching } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isFetching) {
      if (!isError) return navigate("/account")
    }
  }, [navigate, isFetching, isError]);
  
  return (
    <LoginForm />
  )
}

export default SignInPage