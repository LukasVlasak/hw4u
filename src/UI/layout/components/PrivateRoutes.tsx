import { ReactNode, useContext, useEffect } from "react";
import LoadingComponents from "../../components/LoadingComponents";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import useNavigateWithMessage from "../../../hooks/useNavigateWithToast";
import { useTranslation } from "react-i18next";
import useAuth from "../../../hooks/useAuth";

interface Props {
  children: ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const { data, isLoading } = useAuth();
  const isFetching = useIsFetching();
  const navigateWithToast = useNavigateWithMessage();
  const { t } = useTranslation();
  
  useEffect(() => {
    // u obraceneho pristupu tj. u SignInPage a registerPage je toto zbytecne - value je null automaticky od zacatku
    // useContext total zbytecnej - nacita se to do nej pozdeji nez do queryData -> context je null ale querydata ne
    // - query client je taky context - proste picovina - jo tak neni zbytecnej - getQueryData totiz neni state - tudiz
    // react nepozna, ze je v tom neco jinyho tudiz se neprenace useEffect - takze potrebuju context, aby se nacital useEffect
    // priste vole nejakej zustand nebo neco, potrebuju i useFetching protoze kdyz nejsem prihlasenej tak value se nikdy nezmeni - bude furt null :))))
    if (!data && !isLoading) {
      navigateWithToast("/login", {
        duration: 4000,
        status: "info",
        isClosable: true,
        title: t("auth.redirection"),
        description: t("auth.firstSignIn"),
      });
    }
    // i kdyz je fetching = 0, tak ve value je null - proto jen menit pouze pokud se zmeni value
    // eslint-disable-next-line
  }, [data, isFetching]);

  return data ? <>{children}</> : <LoadingComponents />;
};

export default PrivateRoute;
