import React from 'react';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import MMHeader from './components/MMHeader';
import MVFooter from './components/MVFooter';
import Restaurant from './pages/Restaurant';
import LogRegGuest from './pages/LogRegGuest';
import Register from './pages/Register';
import SelectTable from './pages/SelectTable';
import Login from './pages/Login';
import { tabsel_load, redirect_if_logged_in } from './helpers/loaderfunctions';

function App() {
  const [mode, setMode] = React.useState('');

  function Layout() {
    return (
      <>
        <MMHeader mode={mode} />
        <Outlet />
        <MVFooter />
      </>
    )
  }

  const router = createBrowserRouter([{
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Restaurant />
      }, {
        path: "/customerselect",
        element: <LogRegGuest />,
        loader: redirect_if_logged_in
      }, {
        path: "/tableselect",
        element: <SelectTable />,
        loader: tabsel_load
      }, {
        path: "/register",
        element: <Register />
      }, {
        path: "/login",
        element: <Login />
      }
    ]
  }]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
