import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const AccountPage = () => {
  const { data, isLoading, isFetching, isError } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogOut = () => {
    localStorage.removeItem("x-auth-token");
    navigate("/");
    setTimeout(()=>{},50);
    queryClient.invalidateQueries({
      queryKey: ['auth']
    })
  }

  useEffect(() => {
    if (!isFetching) {
      if (isError) navigate("/login");
    }
  }, [isFetching, navigate, isError])

  if (isLoading) return <p>Loading...</p>

  return (
    data ? <p>{data[0].country} <span><button onClick={handleLogOut}>Log out</button></span></p> : <p>Loading...</p>
  )
};

export default AccountPage;
