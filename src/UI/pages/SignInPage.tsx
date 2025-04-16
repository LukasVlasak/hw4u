import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import authContext from "../../context/AuthContext";
import useNavigateWithToast from "../../hooks/useNavigateWithToast";
import LoginForm from "../components/LoginForm";

const SignInPage = () => {
  const { value } = useContext(authContext);
  const navigateWithToast = useNavigateWithToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (value)
      navigateWithToast("/account", {
        status: "info",
        duration: 4000,
        isClosable: true,
        title: t("auth.redirection"),
        description: t("auth.alreadySignIn"),
      });
  }, [navigateWithToast, value, t]);

  return <LoginForm />;
};

export default SignInPage;
