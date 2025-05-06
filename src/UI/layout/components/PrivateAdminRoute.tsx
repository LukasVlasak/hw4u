import React, { ReactNode, useEffect } from "react";
import useNavigateWithToast from "../../../hooks/useNavigateWithToast";
import useAuth from "../../../hooks/useAuth";
import LoadingComponents from "../../components/LoadingComponents";

interface Props {
  children: ReactNode;
}

const PrivateAdminRoute = ({ children }: Props) => {
  const { data: user, isLoading } = useAuth();
  const navigateWithToast = useNavigateWithToast();

  useEffect(() => {
    if (!user && !isLoading) {
      navigateWithToast("/login", {
        title: "Přihlašte se prosím",
        status: "warning",
      });
    }
    if (user && !user[0].is_admin) {      
      navigateWithToast("/", {
        title: "Nemáte oprávnění",
        status: "error",
      });
    }
  }, [isLoading]);
  return user && !isLoading ? <div>{children}</div> : <LoadingComponents />;
};

export default PrivateAdminRoute;
