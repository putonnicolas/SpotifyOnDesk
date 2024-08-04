import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Player from './components/Player.jsx'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App/>
    },
    {
      path : '/player',
      element: <Player/>
    }
  ]
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
