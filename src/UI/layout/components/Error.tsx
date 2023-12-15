import { isRouteErrorResponse, useRouteError } from "react-router-dom"

const Error = () => {

    const error = useRouteError();
    const isNotFound = isRouteErrorResponse(error);

  return (
    <div>Error</div>
  )
}

export default Error