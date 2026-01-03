import React, { useState } from 'react';
import { employees, leaveRequests, attendanceRecords, LeaveRequest } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Users, CalendarCheck, Clock } from 'lucide-react';

export function AdminDashboard() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>(leaveRequests);
  const [rejectModal, setRejectModal] = useState<{ open: boolean; leaveId: string | null }>({
    open: false,
    leaveId: null,
  });
  const [rejectComment, setRejectComment] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const nonHrEmployees = employees.filter(e => e.role !== 'hr');
  const pendingLeaves = leaves.filter(l => l.status === 'pending');
  
  // Count today's attendance
  const todayPresent = Object.values(attendanceRecords).filter(records => {
    const todayRecord = records.find(r => r.date === todayStr);
    return todayRecord && todayRecord.status === 'present';
  }).length;

  const handleApprove = (leaveId: string) => {
    setLeaves(prev => prev.map(l => 
      l.id === leaveId ? { ...l, status: 'approved' as const, reviewedBy: 'Emily Chen' } : l
    ));
  };

  const handleReject = () => {
    if (rejectModal.leaveId) {
      setLeaves(prev => prev.map(l => 
        l.id === rejectModal.leaveId 
          ? { ...l, status: 'rejected' as const, reviewedBy: 'Emily Chen', reviewComment: rejectComment } 
          : l
      ));
    }
    setRejectModal({ open: false, leaveId: null });
    setRejectComment('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">HR Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage employees, attendance, and leave requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded bg-accent flex items-center justify-center">
              <Users size={18} className="text-accent-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Employees</p>
              <p className="text-lg font-medium text-foreground">{nonHrEmployees.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded bg-accent flex items-center justify-center">
              <CalendarCheck size={18} className="text-accent-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending Leave Requests</p>
              <p className="text-lg font-medium text-foreground">{pendingLeaves.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded bg-accent flex items-center justify-center">
              <Clock size={18} className="text-accent-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Present Today</p>
              <p className="text-lg font-medium text-foreground">{todayPresent} / {nonHrEmployees.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Leave Approvals */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-medium text-foreground">Pending Leave Approvals</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingLeaves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No pending leave requests
                </TableCell>
              </TableRow>
            ) : (
              pendingLeaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell className="font-medium">{leave.employeeName}</TableCell>
                  <TableCell className="capitalize">{leave.type}</TableCell>
                  <TableCell className="text-sm">
                    {leave.startDate} to {leave.endDate}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {leave.reason}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs"
                        onClick={() => handleApprove(leave.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs text-destructive border-destructive/50 hover:bg-destructive/10"
                        onClick={() => setRejectModal({ open: true, leaveId: leave.id })}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Employee List */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-medium text-foreground">Employee Directory</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Join Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nonHrEmployees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell className="font-medium">{emp.name}</TableCell>
                <TableCell className="text-muted-foreground">{emp.employeeId}</TableCell>
                <TableCell>{emp.department}</TableCell>
                <TableCell>{emp.position}</TableCell>
                <TableCell className="text-muted-foreground">{emp.joinDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Reject Modal */}
      <Dialog open={rejectModal.open} onOpenChange={(open) => setRejectModal({ open, leaveId: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Add a comment (optional)"
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModal({ open: false, leaveId: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
