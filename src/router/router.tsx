import { createBrowserRouter, Outlet } from "react-router-dom";
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
import ModalIsOpenContextProvider from "../context/ModalIsOpenContextProvider";
import UsersList from "../UI/pages/UsersList";
import UsersListAdmin from "../UI/pages/administration/UsersList";
import UserReviews from "../UI/pages/UserReviews";
import PrivateAdminRoute from "../UI/layout/components/PrivateAdminRoute";
import SidebarWithHeader from "../UI/layout/AdminLayout";
import Dashboard from "../UI/pages/administration/Dashboard";
import FeedbackList from "../UI/pages/administration/FeedbackList";
import ReviewList from "../UI/pages/administration/ReviewList";
import CategoryList from "../UI/pages/administration/CategoryList";
import ProductList from "../UI/pages/administration/ProductList";
import Pricing from "../UI/pages/Pricing";
import TaskList from "../UI/pages/TaskList";
import AnswersList from "../UI/pages/administration/AnswersList";
import TasksList from "../UI/pages/administration/TasksList";

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
        path: "users",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <UsersList />
          },
          {
            path: ":id",
            element: <Outlet />,
            children: [
                {
                  index: true,
                  element: <AccountPage />,
                },
                {
                  path: "reviews",
                  element: <UserReviews />
                }
            ]
          }
        ]
      },
      {
        path: "pricing",
        element: <Pricing />,
      },
      {
        path: "tasks",
        element: (
          <TaskList />
        ),
      },
      {
        path: "tasks/:id",
        element: (
          <OneTaskPage />
        ),
      },
    ],
  },
  {
    path: "/administration",
    element: (
      <PrivateAdminRoute>
        <SidebarWithHeader />
      </PrivateAdminRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <UsersListAdmin />
      },
      {
        path: "feedback",
        element: <FeedbackList />
      },
      {
        path: "reviews",
        element: <ReviewList />
      },
      {
        path: "categories",
        element: <CategoryList />
      },
      {
        path: "products",
        element: <ProductList />
      },
      {
        path: "answers",
        element: <AnswersList />
      },
      {
        path: "tasks",
        element: <TasksList />
      }
    ]
  }
]);

export default router;
// napicu udelany useAuth nefunguje log out... nic nefunguje tpc nevim
