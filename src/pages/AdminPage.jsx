import React from 'react';
import AdminLogin from '../components/AdminLogin';
import AdminPanel from './AdminPanel'; 

const AdminPage = () => {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  const isAdmin = token && email === 'admin@personalphotomap.co.uk';

  return isAdmin ? <AdminPanel /> : <AdminLogin />;
};

export default AdminPage;
