import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useNavigateWithToast from "../../hooks/useNavigateWithToast";
import LoginForm from "../components/LoginForm";
import useAuth from "../../hooks/useAuth";

const SignInPage = () => {
  const { data } = useAuth();
  const navigateWithToast = useNavigateWithToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (data)
      navigateWithToast("/account", {
        status: "info",
        duration: 4000,
        isClosable: true,
        title: t("auth.redirection"),
        description: t("auth.alreadySignIn"),
      });
  }, [navigateWithToast, data, t]);

  return <LoginForm />;
};

export default SignInPage;
