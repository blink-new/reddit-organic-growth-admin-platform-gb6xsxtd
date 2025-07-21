
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { BrandsPage } from './pages/BrandsPage';
import { StrategyPage } from './pages/StrategyPage';
import { OutreachPage } from './pages/OutreachPage';
import { BeaconPage } from './pages/BeaconPage';
import { TrendsPage } from './pages/TrendsPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { SettingsPage } from './pages/SettingsPage';
import { BrandStrategyPage } from './pages/BrandStrategyPage';
import { blink } from './blink/client';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user);
      setLoading(state.isLoading);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<BrandsPage />} />
          <Route path="/strategy" element={<StrategyPage />} />
          <Route path="/outreach" element={<OutreachPage />} />
          <Route path="/beacon" element={<BeaconPage />} />
          <Route path="/trends" element={<TrendsPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/brand/:brandId" element={<BrandStrategyPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
