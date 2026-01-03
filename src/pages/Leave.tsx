import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { leaveRequests, LeaveRequest } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { employees } from '@/lib/mock-data';

const leaveTypes = [
  { value: 'casual', label: 'Casual Leave' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'annual', label: 'Annual Leave' },
  { value: 'unpaid', label: 'Unpaid Leave' },
];

export default function Leave() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>(leaveRequests);
  const [formData, setFormData] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [rejectModal, setRejectModal] = useState<{ open: boolean; leaveId: string | null }>({
    open: false,
    leaveId: null,
  });
  const [rejectComment, setRejectComment] = useState('');

  if (!user) return null;

  const isHR = user.role === 'hr';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLeave: LeaveRequest = {
      id: `LR${Date.now()}`,
      employeeId: user.id,
      employeeName: user.name,
      type: formData.type as LeaveRequest['type'],
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };

    setLeaves(prev => [newLeave, ...prev]);
    setFormData({ type: '', startDate: '', endDate: '', reason: '' });
  };

  const handleApprove = (leaveId: string) => {
    setLeaves(prev => prev.map(l => 
      l.id === leaveId ? { ...l, status: 'approved' as const, reviewedBy: user.name } : l
    ));
  };

  const handleReject = () => {
    if (rejectModal.leaveId) {
      setLeaves(prev => prev.map(l => 
        l.id === rejectModal.leaveId 
          ? { ...l, status: 'rejected' as const, reviewedBy: user.name, reviewComment: rejectComment } 
          : l
      ));
    }
    setRejectModal({ open: false, leaveId: null });
    setRejectComment('');
  };

  const userLeaves = leaves.filter(l => l.employeeId === user.id);
  const pendingLeaves = leaves.filter(l => l.status === 'pending');

  // Employee View
  if (!isHR) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Leave Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Apply for leave and track your requests</p>
        </div>

        {/* Leave Application Form */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h2 className="text-sm font-medium text-foreground mb-4">Apply for Leave</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Leave Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                placeholder="Briefly describe the reason for leave"
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
              />
            </div>

            <Button 
              type="submit" 
              disabled={!formData.type || !formData.startDate || !formData.endDate || !formData.reason}
            >
              Submit Application
            </Button>
          </form>
        </div>

        {/* Leave History */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-medium text-foreground">Your Leave Requests</h2>
          </div>
          {userLeaves.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No leave requests yet
            </div>
          ) : (
            <div className="divide-y divide-border">
              {userLeaves.map((leave) => (
                <div key={leave.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">{leave.type} Leave</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {leave.startDate} to {leave.endDate}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{leave.reason}</p>
                    </div>
                    <span className={`text-xs ${
                      leave.status === 'approved' ? 'text-success' :
                      leave.status === 'rejected' ? 'text-destructive' :
                      'text-muted-foreground'
                    }`}>
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </div>
                  {leave.reviewComment && (
                    <p className="mt-2 text-xs text-muted-foreground italic">
                      Comment: {leave.reviewComment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // HR View
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Leave Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Review and manage employee leave requests</p>
      </div>

      {/* Pending Requests */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-medium text-foreground">Pending Requests ({pendingLeaves.length})</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Applied On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingLeaves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No pending requests
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
                  <TableCell className="text-sm text-muted-foreground">{leave.appliedOn}</TableCell>
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

      {/* All Requests */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-medium text-foreground">All Leave Requests</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reviewed By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaves.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell className="font-medium">{leave.employeeName}</TableCell>
                <TableCell className="capitalize">{leave.type}</TableCell>
                <TableCell className="text-sm">
                  {leave.startDate} to {leave.endDate}
                </TableCell>
                <TableCell>
                  <span className={`text-xs ${
                    leave.status === 'approved' ? 'text-success' :
                    leave.status === 'rejected' ? 'text-destructive' :
                    'text-muted-foreground'
                  }`}>
                    {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {leave.reviewedBy || '-'}
                </TableCell>
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
