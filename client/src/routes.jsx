import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './features/auth/ProtectedRoute.jsx';
import { AdminRoute } from './features/auth/AdminRoute.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const Explore = lazy(() => import('./pages/Explore.jsx'));
const ContentDetail = lazy(() => import('./pages/ContentDetail.jsx'));
const MapPage = lazy(() => import('./pages/MapPage.jsx'));
const TimelinePage = lazy(() => import('./pages/TimelinePage.jsx'));
const SearchPage = lazy(() => import('./pages/SearchPage.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const ShareStory = lazy(() => import('./pages/user/ShareStory.jsx'));
const MyContributions = lazy(() => import('./pages/user/MyContributions.jsx'));
const ContributionDetail = lazy(() => import('./pages/user/ContributionDetail.jsx'));
const Favorites = lazy(() => import('./pages/user/Favorites.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/jelajah" element={<Explore />} />
      <Route path="/konten/:slugOrId" element={<ContentDetail />} />
      <Route path="/artikel/:slugOrId" element={<ContentDetail />} />
      <Route path="/artikel" element={<Navigate to="/jelajah?type=artikel" replace />} />
      <Route path="/sejarah" element={<Navigate to="/jelajah?type=sejarah" replace />} />
      <Route path="/budaya" element={<Navigate to="/jelajah?type=budaya" replace />} />
      <Route path="/artefak" element={<Navigate to="/jelajah?type=artefak" replace />} />
      <Route path="/tokoh" element={<Navigate to="/jelajah?type=tokoh" replace />} />
      <Route path="/tempat-bersejarah" element={<Navigate to="/jelajah?type=tempat" replace />} />
      <Route path="/tempat" element={<Navigate to="/jelajah?type=tempat" replace />} />
      <Route path="/peta" element={<MapPage />} />
      <Route path="/garis-waktu" element={<TimelinePage />} />
      <Route path="/pencarian" element={<SearchPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/masuk" element={<Navigate to="/login" replace />} />

      {/* Protected User routes */}
      <Route path="/bagikan-jejak" element={<ProtectedRoute><ShareStory /></ProtectedRoute>} />
      <Route path="/kontribusi-saya" element={<ProtectedRoute><MyContributions /></ProtectedRoute>} />
      <Route path="/kontribusi/:id" element={<ProtectedRoute><ContributionDetail /></ProtectedRoute>} />
      <Route path="/favorit" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />

      {/* Admin route */}
      <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
