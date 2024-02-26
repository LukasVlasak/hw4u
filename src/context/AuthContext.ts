import { createContext } from "react";
import { User } from "../services/userService";
import { AuthAction } from "../reducers/AuthReducer";

interface AuthContextType {
    value: User | null;
    dispatch: (action: AuthAction) => void;
}

const authContext = createContext<AuthContextType>({} as AuthContextType);

export default authContext;