import { ReactNode, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authContext from "../../../context/AuthContext";

interface Props {
  children: ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const { value } = useContext(authContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(value);
    
    if (!value) navigate("/login");
  }, [navigate, value]);

  return value ? <>{children}</> : null;
};

export default PrivateRoute;
