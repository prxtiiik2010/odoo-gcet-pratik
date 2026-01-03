import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EmployeeDashboard } from '@/components/dashboard/EmployeeDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return user.role === 'hr' ? <AdminDashboard /> : <EmployeeDashboard />;
}
