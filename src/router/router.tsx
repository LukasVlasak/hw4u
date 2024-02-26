import { createBrowserRouter } from "react-router-dom";
import Layout from "../UI/layout/Layout";
import Error from "../UI/layout/components/Error";
import HomePage from "../UI/pages/HomePage";
import SignInPage from "../UI/pages/SignInPage";
import SignUpPage from "../UI/pages/SignUpPage";
import AccountPage from "../UI/pages/AccountPage";
import TaskPage from "../UI/pages/TaskPage";
import ServerSideFiltering from "../UI/components/ServerSideFiltering";
import OneTaskPage from "../UI/pages/OneTaskPage";
import axios from "axios";
import PrivateRoute from "../UI/layout/components/PrivateRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        element: <HomePage />,
        index: true,
      },
      {
        path: "login",
        element: <SignInPage />,
      },
      {
        path: "register",
        element: <SignUpPage />,
      },
      {
        path: "account",
        element: (
          <PrivateRoute>
            <AccountPage />
          </PrivateRoute>
        ),
      },
      {
        path: "tasks",
        element: <TaskPage />,
      },
      {
        path: "tasks_archive",
        element: <ServerSideFiltering />,
      },
      {
        path: "task/:id",
        id: "task",
        loader: ({ params, request }) => {
          
           // commonly used na serachparametres - user neco hleda tak presmeruji na ?q=neco, loader to zachyti,
          // z url adresy si vesmu co chci a udelam request na server

          return axios.get("http://localhost:3001/api/tasks/" + params.id);
        },
        element: <PrivateRoute><OneTaskPage /></PrivateRoute>,
      },
    ],
  },
]);

export default router;
// napicu udelany useAuth nefunguje log out... nic nefunguje tpc nevim
