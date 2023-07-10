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
import { tabsel_load, redirect_if_logged_in, get_profile, change_details, get_categories, get_items, get_item } from './helpers/loaderfunctions';
import UpdateAccount from './pages/UpdateAccount';
import LoggedSelect from './pages/LoggedSelect';
import UpdateDetails from './pages/UpdateDetails';
import StaffSelect from './pages/StaffSelect';
import WaitStaffLogin from './pages/WaitStaffLogin';
import WaitStaff from './pages/WaitStaff';
import DeleteAccount from './pages/DeleteAccount';
import ViewItems from './components/ViewItems';
import Menu from './pages/Menu';
import OrderItem from './pages/OrderItem';

function App() {
  const [mode, setMode] = React.useState('');

  function Layout() {
    return (
      <>
        <MMHeader mode={mode} setmode={setMode}/>
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
        element: <Login setmode={setMode}/>
      }, {
        path: "/updateaccount",
        element: <UpdateAccount />,
        loader: get_profile
      }, {
        path: "/loggedselect",
        element: <LoggedSelect />
      }, {
        path: "/changedetails",
        element: <UpdateDetails />,
        loader: get_profile,
        action: async ({ request }) => {
          return await change_details(request);
        }
      }, {
        path: "/staffselect",
        element: <StaffSelect />
      }, {
        path: "/waitstafflogin",
        element: <WaitStaffLogin />
      }, {
        path: "/waitstaff",
        element: <WaitStaff />
      }, {
        path: "/deleteaccount",
        element: <DeleteAccount />,
      }, {
        path: "/menu",
        element: <Menu />,
        loader: get_categories,
        children: [
          {
            path: ":categoryid",
            element: <ViewItems />,
            loader: async ({params}) => {
              return get_items(params);
            }
          }, {
            path: "order/:itemid",
            element: <OrderItem />,
            loader: async ({params}) => {
              return get_item(params);
            }
          }
        ]
      }
    ]
  }]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
