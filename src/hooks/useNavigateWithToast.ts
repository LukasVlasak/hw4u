import { UseToastOptions, useToast } from "@chakra-ui/react";
import { NavigateOptions, useNavigate } from "react-router-dom";


const useNavigateWithToast = () => {
    const navigate = useNavigate();
    const toast = useToast();
    
    const customNavigate = (to: string, toastOptions?: UseToastOptions, options?: NavigateOptions) => {
        if (toastOptions) {
            toast(toastOptions);
        }

        navigate(to, options);
    }
    return customNavigate;
}

export default useNavigateWithToast;