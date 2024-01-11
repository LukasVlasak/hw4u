import { createBrowserRouter } from "react-router-dom";
import Layout from "../UI/layout/Layout";
import Error from "../UI/layout/components/Error";
import HomePage from "../UI/pages/HomePage";
import SignInPage from "../UI/pages/SignInPage";
import SignUpPage from "../UI/pages/SignUpPage";
import AccountPage from "../UI/pages/AccountPage";
import TaskPage from "../UI/pages/TaskPage";

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
        path: 'login',
        element: <SignInPage />
      },
      {
        path: 'register',
        element: <SignUpPage />
      },
      {
        path: 'account',
        element: <AccountPage />
      },
      {
        path: 'tasks',
        element: <TaskPage/>
      }
    ],
  },
]);

export default router;
