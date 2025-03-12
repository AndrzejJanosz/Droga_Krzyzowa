import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import RoadPage from "../pages/RoadPage";
import ConsiderationsPage from "../pages/ConsiderationsPage";
import NavigationPage from "../pages/NavigationPage";
import Test from "../pages/Test";



const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/drogi",
        element: <RoadPage />,
      },
      {
        path: "/nawigacja",
        element: <NavigationPage />,
      },
      {
        path: "/test",
        element: <Test />,
      },
      {
        path: "/rozwazania",
        element: <ConsiderationsPage />,
      }
    ]
    },
  ]);

  export default router;