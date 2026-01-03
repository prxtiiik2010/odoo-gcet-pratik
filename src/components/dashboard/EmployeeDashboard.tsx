import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { attendanceRecords, leaveRequests } from '@/lib/mock-data';
import { Clock, CalendarDays, User, ArrowRight } from 'lucide-react';

export function EmployeeDashboard() {
  const { user } = useAuth();
  
  if (!user) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const userAttendance = attendanceRecords[user.id] || [];
  const todayRecord = userAttendance.find(r => r.date === todayStr);
  
  const userLeaveRequests = leaveRequests.filter(l => l.employeeId === user.id);
  const pendingLeaves = userLeaveRequests.filter(l => l.status === 'pending').length;

  const getAttendanceStatus = () => {
    if (!todayRecord || !todayRecord.checkIn) {
      return { text: 'Not checked in', color: 'text-muted-foreground' };
    }
    if (todayRecord.status === 'present') {
      return { text: 'Present', color: 'text-success' };
    }
    if (todayRecord.status === 'half-day') {
      return { text: 'Half day', color: 'text-warning' };
    }
    return { text: 'Absent', color: 'text-destructive' };
  };

  const attendanceStatus = getAttendanceStatus();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="text-sm text-muted-foreground mt-1">Here's your overview for today</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded bg-accent flex items-center justify-center">
              <Clock size={18} className="text-accent-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Today's Status</p>
              <p className={`text-sm font-medium ${attendanceStatus.color}`}>
                {attendanceStatus.text}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded bg-accent flex items-center justify-center">
              <CalendarDays size={18} className="text-accent-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending Leave Requests</p>
              <p className="text-sm font-medium text-foreground">{pendingLeaves}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded bg-accent flex items-center justify-center">
              <User size={18} className="text-accent-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Department</p>
              <p className="text-sm font-medium text-foreground">{user.department}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h2 className="text-sm font-medium text-foreground mb-4">Quick Actions</h2>
        <div className="space-y-2">
          <Link
            to="/profile"
            className="flex items-center justify-between p-3 rounded border border-border hover:bg-muted/50 transition-colors"
          >
            <span className="text-sm text-foreground">View Profile</span>
            <ArrowRight size={16} className="text-muted-foreground" />
          </Link>
          <Link
            to="/leave"
            className="flex items-center justify-between p-3 rounded border border-border hover:bg-muted/50 transition-colors"
          >
            <span className="text-sm text-foreground">Apply for Leave</span>
            <ArrowRight size={16} className="text-muted-foreground" />
          </Link>
          <Link
            to="/attendance"
            className="flex items-center justify-between p-3 rounded border border-border hover:bg-muted/50 transition-colors"
          >
            <span className="text-sm text-foreground">View Attendance</span>
            <ArrowRight size={16} className="text-muted-foreground" />
          </Link>
        </div>
      </div>

      {/* Recent Leave Requests */}
      {userLeaveRequests.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h2 className="text-sm font-medium text-foreground mb-4">Recent Leave Requests</h2>
          <div className="space-y-3">
            {userLeaveRequests.slice(0, 3).map((leave) => (
              <div key={leave.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm text-foreground capitalize">{leave.type} Leave</p>
                  <p className="text-xs text-muted-foreground">
                    {leave.startDate} to {leave.endDate}
                  </p>
                </div>
                <span className={`text-xs ${
                  leave.status === 'approved' ? 'text-success' :
                  leave.status === 'rejected' ? 'text-destructive' :
                  'text-muted-foreground'
                }`}>
                  {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
