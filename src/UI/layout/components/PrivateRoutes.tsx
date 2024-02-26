import { ReactNode, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authContext from "../../../context/AuthContext";
import LoadingComponents from "../../components/LoadingComponents";

interface Props {
  children: ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const { value } = useContext(authContext);
  const navigate = useNavigate();

  useEffect(() => {    
    if (!value) navigate("/login");
  }, [navigate, value]);

  return value ? <>{children}</> : <LoadingComponents />;
};

export default PrivateRoute;
