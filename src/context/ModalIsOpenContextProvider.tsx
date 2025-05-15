import { ReactNode, useState } from "react"
import modalContext from "./ModalIsOpenContext"

interface Props {
    children: ReactNode;
}

const ModalIsOpenContextProvider = ({children}: Props) => {

    const [value, setValue] = useState(false);

    return (
        <modalContext.Provider value={{value, setValue}}>{children}</modalContext.Provider>
  )
}

export default ModalIsOpenContextProvider