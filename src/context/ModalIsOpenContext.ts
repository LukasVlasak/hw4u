import { Dispatch, SetStateAction, createContext } from "react";

interface ModalContextI {
    value: boolean;
    setValue: Dispatch<SetStateAction<boolean>>;
}

const modalContext = createContext<ModalContextI>({} as ModalContextI);

export default modalContext;