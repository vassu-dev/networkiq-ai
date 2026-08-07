import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { LandingPage } from '@/pages/LandingPage';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/pages/Dashboard';
import { UploadPage } from '@/pages/UploadPage';
import { AnalysisPage } from '@/pages/AnalysisPage';
import { RecommendationsPage } from '@/pages/RecommendationsPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { ProductSearch } from '@/pages/ProductSearch';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<AppLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="analysis" element={<AnalysisPage />} />
            <Route path="recommendations" element={<RecommendationsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="search" element={<ProductSearch />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
