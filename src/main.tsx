import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './AuthContext.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './components/LoginPage.tsx'
import NotFoundPage from './components/NotFoundPage.tsx'
import AdminPage from './components/AdminPage.tsx'
import AdminRoute from './services/ProtectedRoutes.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFoundPage />,
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '',
    element: <AdminRoute/>,
    children: [
      {
        path: '/admin',
        element: <AdminPage />
      }
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
