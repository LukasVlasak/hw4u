import { User } from "../services/userService";

interface AuthLogout {
    type: 'LOGOUT';
}

interface AuthLogin {
    type: 'LOGIN',
    payload: {
        user: User;
    }
}

export type AuthAction = AuthLogin | AuthLogout;

const AuthReducer = (state: User | null, action: AuthAction) => {
    if (action.type === 'LOGIN')  {
        return action.payload.user;
    }
    if (action.type === 'LOGOUT') {
        return null;
    }

    return state; //nepotreba bcs typescript si pohlida ze to ma bejt logout nebo login
}

export default AuthReducer;
