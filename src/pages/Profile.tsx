import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { payrollRecords, getNetSalary } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Pencil, X, Check } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    email: user?.email || '',
  });

  if (!user) return null;

  const isHR = user.role === 'hr';
  const userPayroll = payrollRecords[user.id];
  const netSalary = userPayroll ? getNetSalary(userPayroll) : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      phone: user.phone,
      email: user.email,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage your profile information</p>
        </div>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Pencil size={14} className="mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X size={14} className="mr-2" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Check size={14} className="mr-2" />
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-lg">
        {/* Profile Header */}
        <div className="p-6 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xl font-semibold text-primary-foreground">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.position}</p>
          </div>
        </div>

        <Separator />

        {/* Basic Information */}
        <div className="p-6">
          <h3 className="text-sm font-medium text-foreground mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Employee ID</Label>
              <p className="text-sm text-foreground">{user.employeeId}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Department</Label>
              <p className="text-sm text-foreground">{user.department}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Position</Label>
              <p className="text-sm text-foreground">{user.position}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Join Date</Label>
              <p className="text-sm text-foreground">{user.joinDate}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div className="p-6">
          <h3 className="text-sm font-medium text-foreground mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Email</Label>
              {isEditing ? (
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="h-9"
                />
              ) : (
                <p className="text-sm text-foreground">{user.email}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Phone</Label>
              {isEditing ? (
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="h-9"
                />
              ) : (
                <p className="text-sm text-foreground">{user.phone}</p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Salary Information (Read-only for employees) */}
        <div className="p-6">
          <h3 className="text-sm font-medium text-foreground mb-4">Salary Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Net Monthly Salary</Label>
              <p className="text-sm text-foreground">{formatCurrency(netSalary)}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Role</Label>
              <p className="text-sm text-foreground">{isHR ? 'HR Admin' : 'Employee'}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            For detailed salary breakdown, visit the Payroll section.
          </p>
        </div>
      </div>
    </div>
  );
}
