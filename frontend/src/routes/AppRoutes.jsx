import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import ResumeUpload from '../pages/ResumeUpload/ResumeUpload';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<ResumeUpload />} />
          <Route path="analysis" element={<div>Analysis Page (Coming Soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes;