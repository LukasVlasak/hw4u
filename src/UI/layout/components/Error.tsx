import { AxiosError } from "axios";
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import "../../css/Error.css";
import { Button } from "@chakra-ui/react";

const Error = () => {
  const error = useRouteError();
  const isNotFound = isRouteErrorResponse(error);

  return (
      <div id="notfound">
        <div className="notfound">
          <div className="notfound-404">
            <h1>
              {isNotFound
                ? "404"
                : error instanceof AxiosError
                ? error.response?.status
                : "500"}
            </h1>
          </div>
          <h2>
            {isNotFound
              ? "We are sorry page not found"
              : error instanceof AxiosError
              ? error.message
              : "unknown error"}
          </h2>
          <p>
            {isNotFound
              ? "The page you are looking for might have been removed had its name changed or is temporarily unavailable."
              : error instanceof AxiosError
              ? error.response?.data.message
              : "REPORT ERROR"}
          </p>
          <Link to="/">
            <Button p={6} colorScheme="blue">
              Back To Homepage
            </Button>
          </Link>
        </div>
      </div>
  );
};

export default Error;
