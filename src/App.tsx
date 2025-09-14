import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import CourseMaterials from './pages/CourseMaterials';
import Materials from './pages/Materials';
import UploadMaterial from './pages/UploadMaterial';
import CreateUser from './pages/CreateUser';
import ManageUsers from './pages/ManageUsers';
import CreateSchool from './pages/CreateSchool';
import Schools from './pages/Schools';
import SchoolDetails from './pages/SchoolDetails';
import AdmitStudent from './pages/AdmitStudent';
import BulkAdmitStudents from './pages/BulkAdmitStudents';
import EnrollStudents from './pages/EnrollStudents';
import MyEnrollments from './pages/MyEnrollments';
import CourseSettings from './pages/CourseSettings';
import Chat from './pages/Chat';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:courseId" element={<CourseDetails />} />
            <Route path="courses/:courseId/materials" element={<CourseMaterials />} />
            <Route path="chat" element={<Chat />} />
            <Route path="materials" element={<Materials />} />
            
            {/* Teacher Routes */}
            <Route path="materials/upload" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <UploadMaterial />
              </ProtectedRoute>
            } />
            
            <Route path="courses/:courseId/enroll" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <EnrollStudents />
              </ProtectedRoute>
            } />
            
            <Route path="courses/:courseId/settings" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <CourseSettings />
              </ProtectedRoute>
            } />
            
            {/* Student Routes */}
            <Route path="student/enrollments" element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyEnrollments />
              </ProtectedRoute>
            } />
            
            {/* School Admin Routes */}
            <Route path="admin/create-user" element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <CreateUser />
              </ProtectedRoute>
            } />
            
            <Route path="admin/manage-users" element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <ManageUsers />
              </ProtectedRoute>
            } />
            
            <Route path="admin/admit-student" element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <AdmitStudent />
              </ProtectedRoute>
            } />
            
            <Route path="admin/bulk-admit" element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <BulkAdmitStudents />
              </ProtectedRoute>
            } />
            
            {/* Super Admin Routes */}
            <Route path="admin/create-school" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <CreateSchool />
              </ProtectedRoute>
            } />
            
            <Route path="schools" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <Schools />
              </ProtectedRoute>
            } />
            
            <Route path="schools/:schoolId" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SchoolDetails />
              </ProtectedRoute>
            } />
          </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;