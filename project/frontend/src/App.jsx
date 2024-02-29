import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import './App.css';
import ItemList from './components/ItemList';
import MMHeader from './components/MMHeader';
import MVFooter from './components/MVFooter';
import ViewItems from './components/ViewItems';
import {
  changeDetails,
  getCategories,
  getItem,
  getItems,
  getProfile,
  redirectIfLoggedIn,
  tabselLoad
} from './helpers/loaderfunctions';
import DeleteAccount from './pages/DeleteAccount';
import ItemStatistics from './pages/ItemStatistics';
import KitchenOrders from './pages/KitchenOrders';
import KitchenStaffLogin from './pages/KitchenStaffLogin';
import LoggedSelect from './pages/LoggedSelect';
import Login from './pages/Login';
import LogRegGuest from './pages/LogRegGuest';
import ManagerEditMenu from './pages/ManagerEditMenu';
import ManagerGraph from './pages/ManagerGraph';
import ManagerLogin from './pages/ManagerLogin';
import Menu from './pages/Menu';
import OrderItem from './pages/OrderItem';
import OrderLog from './pages/OrderLog';
import PopularItems from './pages/PopularItems';
import Register from './pages/Register';
import Restaurant from './pages/Restaurant';
import SelectTable from './pages/SelectTable';
import StaffSelect from './pages/StaffSelect';
import UpdateAccount from './pages/UpdateAccount';
import UpdateDetails from './pages/UpdateDetails';
import WaitStaff from './pages/WaitStaff';
import WaitStaffLogin from './pages/WaitStaffLogin';

function App () {
  const [mode, setMode] = React.useState('');

  const theme = createTheme({
    typography: {
      fontFamily: 'Quicksand'
    }
  });

  function Layout () {
    return (
      <>
        <MMHeader mode={mode} setmode={setMode}/>
        <Outlet/>
        <MVFooter/>
      </>
    )
  }

  const router = createBrowserRouter([{
    element: <Layout/>,
    children: [
      {
        path: '/',
        element: <Restaurant/>
      }, {
        path: '/customerselect',
        element: <LogRegGuest setmode={setMode}/>,
        loader: redirectIfLoggedIn
      }, {
        path: '/tableselect',
        element: <SelectTable setmode={setMode}/>,
        loader: tabselLoad
      }, {
        path: '/register',
        element: <Register/>
      }, {
        path: '/login',
        element: <Login setmode={setMode}/>
      }, {
        path: '/updateaccount',
        element: <UpdateAccount setmode={setMode}/>,
        loader: getProfile
      }, {
        path: '/loggedselect',
        element: <LoggedSelect setmode={setMode}/>
      }, {
        path: '/changedetails',
        element: <UpdateDetails/>,
        loader: getProfile,
        action: async ({ request }) => {
          return await changeDetails(request);
        }
      }, {
        path: '/staffselect',
        element: <StaffSelect/>
      }, {
        path: '/waitstafflogin',
        element: <WaitStaffLogin/>
      }, {
        path: '/waitstaff',
        element: <WaitStaff/>,
        loader: tabselLoad
      }, {
        path: '/deleteaccount',
        element: <DeleteAccount setmode={setMode}/>,
      }, {
        path: '/menu',
        element: <Menu setmode={setMode}/>,
        loader: getCategories,
        children: [
          {
            path: ':categoryid',
            element: <ViewItems/>,
            loader: async ({ params }) => {
              return getItems(params);
            }
          }, {
            path: 'order/:itemid',
            element: <OrderItem/>,
            loader: async ({ params }) => {
              return getItem(params);
            }
          }
        ]
      }, {
        path: '/managereditmenu',
        element: <ManagerEditMenu setmode={setMode}/>,
        loader: getCategories,
        children: [
          {
            path: ':categoryid',
            element: <ItemList/>,
          }
        ]
      }, {
        path: '/kitchen',
        element: <KitchenOrders/>,
        loader: tabselLoad
      }, {
        path: '/kitchenstafflogin',
        element: <KitchenStaffLogin/>
      }, {
        path: '/managerlogin',
        element: <ManagerLogin/>
      }, {
        path: '/managergraph',
        element: <ManagerGraph/>,
        loader: getCategories
      }, {
        path: '/orderlog',
        element: <OrderLog/>
      }, {
        path: '/popularitems',
        element: <PopularItems/>,
        loader: getCategories
      }, {
        path: '/itemstatistics/:itemid',
        element: <ItemStatistics/>,
        loader: async ({ params }) => {
          return getItem(params);
        }
      }
    ]
  }]);

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router}/>
    </ThemeProvider>
  );
}

export default App;
