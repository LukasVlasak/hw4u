import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import authContext from "../../context/AuthContext";

const AccountPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { value } = useContext(authContext);

  const handleLogOut = () => {
    localStorage.removeItem("x-auth-token");
    navigate("/");
    setTimeout(()=>{},50);
    queryClient.invalidateQueries({
      queryKey: ['auth']
    })
  }

  return (
    value ? <p>{value.country} <span><button onClick={handleLogOut}>Log out</button></span></p> : null
  )
};

export default AccountPage;
