import { useEffect } from "react";
import RegisterForm from "../components/RegisterForm"
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const SignUpPage = () => {

  const { isError, isFetching } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isFetching) {
      if (!isError) return navigate("/account")
    }
  }, [navigate, isFetching, isError]);
  
  return (
    <RegisterForm />
  )
}

export default SignUpPage