import { ReactNode, useEffect, useReducer } from "react"
import authContext from "./AuthContext";
import AuthReducer from "../reducers/AuthReducer";
import useAuth from "../hooks/useAuth";

interface Props {
    children: ReactNode;
}

const AuthContextProvider = ({children}: Props) => {

    const { data } = useAuth();
      
    const [value, dispatch] = useReducer(AuthReducer, null);

    useEffect(() => {
      if (data) {
        // data[0] protoze se backend vola pomoci getAll, coz ocekava array
        dispatch({type: 'LOGIN', payload: {user: data[0]}})
      }
    }, [data]);
  return (
    <authContext.Provider value={{value, dispatch}}>
        {children}
    </authContext.Provider>
  )
}

export default AuthContextProvider