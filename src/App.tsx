import './App.css'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'
import NavBar from './components/Navbar'
import Auth from './components/Auth'
import CreatePlace from './components/CreatePlace'
import Home from './components/Home'
import Places from './components/Places'
import PlacesDetails from './components/PlacesDetails'

function App() {

  const router = createBrowserRouter([{
    element: (
      <>
        <NavBar></NavBar>
        <Outlet></Outlet>
      </>
    ),
    children:[
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/places",
        element: <Places />
      },
      {
        path: "/places/create",
        element: <CreatePlace />
      },
      {
        path: "/places/:id",
        element: <PlacesDetails />
      },
      {
        path: "/auth",
        element: <Auth />
      }
    ]
  }])

  return (
    <div className="wrapper">
      <RouterProvider router={router} />
    </div>
  )
  
}

export default App
