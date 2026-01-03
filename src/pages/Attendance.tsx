import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { attendanceRecords, AttendanceRecord } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { employees } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function Attendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState<Record<string, AttendanceRecord[]>>(attendanceRecords);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) return null;

  const isHR = user.role === 'hr';
  const todayStr = new Date().toISOString().split('T')[0];
  const userRecords = records[user.id] || [];

  const handleCheckIn = () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setRecords(prev => ({
      ...prev,
      [user.id]: prev[user.id].map(r => 
        r.date === todayStr 
          ? { ...r, checkIn: timeStr, status: 'present' as const }
          : r
      )
    }));
  };

  const handleCheckOut = () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setRecords(prev => ({
      ...prev,
      [user.id]: prev[user.id].map(r => 
        r.date === todayStr 
          ? { ...r, checkOut: timeStr }
          : r
      )
    }));
  };

  const todayRecord = userRecords.find(r => r.date === todayStr);

  const getStatusDot = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return 'bg-success';
      case 'absent':
        return 'bg-muted-foreground';
      case 'half-day':
        return 'bg-warning';
      case 'leave':
        return 'bg-primary';
      default:
        return 'bg-muted-foreground';
    }
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Employee View
  if (!isHR) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Attendance</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your daily attendance</p>
        </div>

        {/* Check In/Out */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Today, {formatDate(todayStr)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {todayRecord?.checkIn 
                  ? `Checked in at ${todayRecord.checkIn}` 
                  : 'Not checked in yet'}
                {todayRecord?.checkOut && ` • Checked out at ${todayRecord.checkOut}`}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCheckIn}
                disabled={!!todayRecord?.checkIn}
                size="sm"
              >
                Check In
              </Button>
              <Button
                onClick={handleCheckOut}
                disabled={!todayRecord?.checkIn || !!todayRecord?.checkOut}
                variant="outline"
                size="sm"
              >
                Check Out
              </Button>
            </div>
          </div>
        </div>

        {/* Weekly View */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-medium text-foreground">This Week</h2>
          </div>
          <div className="grid grid-cols-7 divide-x divide-border">
            {userRecords.map((record) => (
              <div 
                key={record.id} 
                className={cn(
                  "p-3 text-center",
                  record.date === todayStr && "bg-accent/30"
                )}
              >
                <p className="text-xs text-muted-foreground">{getDayName(record.date)}</p>
                <p className="text-sm font-medium text-foreground mt-1">{formatDate(record.date).split(' ')[1]}</p>
                <div className="flex justify-center mt-2">
                  <span className={cn("h-2 w-2 rounded-full", getStatusDot(record.status))} />
                </div>
                <p className="text-xs text-muted-foreground mt-1 capitalize">{record.status}</p>
                {record.checkIn && (
                  <p className="text-xs text-muted-foreground mt-1">{record.checkIn}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success" /> Present
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-muted-foreground" /> Absent
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-warning" /> Half-day
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" /> Leave
          </span>
        </div>
      </div>
    );
  }

  // HR View
  const nonHrEmployees = employees.filter(e => e.role !== 'hr');
  const filteredEmployees = nonHrEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedEmployee === 'all' || emp.id === selectedEmployee;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Attendance Management</h1>
        <p className="text-sm text-muted-foreground mt-1">View and manage employee attendance</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs h-9"
        />
        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger className="w-48 h-9">
            <SelectValue placeholder="All employees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All employees</SelectItem>
            {nonHrEmployees.map((emp) => (
              <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Attendance Table */}
      <div className="bg-card border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              {userRecords.slice(0, 7).map((record) => (
                <TableHead key={record.date} className="text-center">
                  {getDayName(record.date)}<br />
                  <span className="text-xs font-normal">{formatDate(record.date)}</span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((emp) => {
              const empRecords = records[emp.id] || [];
              return (
                <TableRow key={emp.id}>
                  <TableCell className="font-medium">{emp.name}</TableCell>
                  <TableCell className="text-muted-foreground">{emp.department}</TableCell>
                  {empRecords.slice(0, 7).map((record) => (
                    <TableCell key={record.id} className="text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-xs",
                      )}>
                        <span className={cn("h-2 w-2 rounded-full", getStatusDot(record.status))} />
                        {record.checkIn || '-'}
                      </span>
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
