import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { HomePage } from '@/pages/HomePage'
import { ProductOverviewPage } from '@/pages/ProductOverviewPage'
import { HumanRiskOverviewPage } from '@/pages/HumanRiskOverviewPage'
import { PlaceholderTabPage } from '@/pages/PlaceholderTabPage'
import { SimulationPage } from '@/pages/SimulationPage'
import { TrainingPage } from '@/pages/TrainingPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { LogoutPage } from '@/pages/LogoutPage'
import { DigitalRiskOverviewPage } from '@/pages/DigitalRiskOverviewPage'
import { DRPTabPage } from '@/pages/DRPTabPage'
import { EmailTabPage } from '@/pages/EmailTabPage'
import { EmailOverviewPage } from '@/pages/EmailOverviewPage'
import { CourseStudioPage } from '@/pages/CourseStudioPage'

const router = createBrowserRouter([
  { path: '/course-studio', element: <CourseStudioPage /> },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'logout', element: <LogoutPage /> },
      // Digital Risk Protection
      { path: 'brand-protection', element: <DigitalRiskOverviewPage /> },
      { path: 'brand-protection/overview', element: <DigitalRiskOverviewPage /> },
      { path: 'brand-protection/doppel-review', element: <DRPTabPage /> },
      { path: 'brand-protection/needs-confirmation', element: <DRPTabPage /> },
      { path: 'brand-protection/actioned', element: <DRPTabPage /> },
      { path: 'brand-protection/resolved', element: <DRPTabPage /> },
      { path: 'brand-protection/monitoring', element: <DRPTabPage /> },
      { path: 'brand-protection/archived', element: <DRPTabPage /> },
      // Human Risk Management
      { path: 'human-risk', element: <HumanRiskOverviewPage /> },
      { path: 'human-risk/overview', element: <HumanRiskOverviewPage /> },
      { path: 'human-risk/tab2', element: <SimulationPage /> },
      { path: 'human-risk/tab3', element: <TrainingPage /> },
      // Email Protection
      { path: 'email-protection', element: <EmailOverviewPage /> },
      { path: 'email-protection/overview', element: <EmailOverviewPage /> },
      { path: 'email-protection/needs-review', element: <EmailTabPage /> },
      { path: 'email-protection/archive', element: <EmailTabPage /> },
      // Generic fallback
      { path: ':productKey/overview', element: <ProductOverviewPage /> },
      { path: ':productKey/:tabKey', element: <PlaceholderTabPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
