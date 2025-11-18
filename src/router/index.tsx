import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout, ProtectedRoute } from "../components";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { PollsPage } from "../pages/PollsPage";
import { PollDetailPage } from "../pages/PollDetailPage";
import { CreatePollPage } from "../pages/CreatePollPage";
import { ProfilePage } from "../pages/ProfilePage";
import { NotFoundPage } from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "polls",
        element: <PollsPage />,
      },
      {
        path: "polls/:id",
        element: <PollDetailPage />,
      },
      {
        path: "create-poll",
        element: (
          <ProtectedRoute>
            <CreatePollPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "404",
        element: <NotFoundPage />,
      },
      {
        path: "*",
        element: <Navigate to="/404" replace />,
      },
    ],
  },
]);
