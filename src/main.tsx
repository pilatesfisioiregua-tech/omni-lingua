import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { Layout } from './app/Layout'
import { Home } from './app/Home'
import { ROUTES } from './app/routes'
import { applyTheme, getTheme } from './shared/theme/themeStore'
import { maybeNotifyOnStart } from './shared/notifications/notify'

applyTheme(getTheme())
void maybeNotifyOnStart()

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      ...ROUTES.map((r) => ({ path: r.path.slice(1), Component: r.component })),
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
