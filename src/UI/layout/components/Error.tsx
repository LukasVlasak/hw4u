import { AxiosError } from "axios";
import { isRouteErrorResponse, useRouteError } from "react-router-dom"

const Error = () => {

    const error = useRouteError();
    const isNotFound = isRouteErrorResponse(error);

  return (
    <p>
      {isNotFound ? '404 route doesnt exist' : (error instanceof AxiosError ? error.response?.data : 'server error')}
    </p>
  )
}

export default Error