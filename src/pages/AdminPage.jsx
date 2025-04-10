import React from 'react';
import AdminPanel from './AdminPanel';
import AdminLogin from '../components/AdminLogin';

const AdminPage = () => {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  const isAdmin = token && email === 'admin@personalphotomap.co.uk';

  return isAdmin ? <AdminPanel /> : <AdminLogin />;
};

export default AdminPage;
