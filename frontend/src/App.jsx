import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Recorder from './pages/Recorder';
import Parameterization from './pages/Parameterization';
import Reports from './pages/Reports';
import About from './pages/About';
import Timeline from './pages/Timeline';
import TechStack from './pages/TechStack';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="record" element={<Recorder />} />
          <Route path="parameterize/:id" element={<Parameterization />} />
          <Route path="reports" element={<Reports />} />
          <Route path="about" element={<About />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="tech" element={<TechStack />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
