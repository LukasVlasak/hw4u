import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import authContext from "../../context/AuthContext";
import LoadingComponents from "../components/LoadingComponents";
import { useLogout } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { useToast } from "@chakra-ui/react";

const AccountPage = () => {
  const navigate = useNavigate();
  const { value } = useContext(authContext);
  const { t } = useTranslation();
  const toast = useToast();
  const { mutate } = useLogout(() => {
    // callback
    
    navigate("/"); 
    console.log('ef');

    toast({
      status: "success",
      duration: 5000,
      isClosable: true,
      title: t("auth.successSignOut"),
      description: t("auth.successSignOutDesc"),
    });
  });

  return (
    value ? <p>{value.country} <span><button onClick={() => mutate()}>Log out</button></span></p> : <LoadingComponents />
  )
};

export default AccountPage;