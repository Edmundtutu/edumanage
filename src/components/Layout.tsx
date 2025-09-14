import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 overflow-auto lg:ml-64 h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;