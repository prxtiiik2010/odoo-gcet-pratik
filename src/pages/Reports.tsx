import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Download, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Reports() {
  const { user } = useAuth();

  if (!user) return null;

  const isHR = user.role === 'hr';

  const reports = isHR ? [
    {
      id: 'attendance',
      title: 'Attendance Report',
      description: 'Monthly attendance summary for all employees',
      icon: BarChart3,
    },
    {
      id: 'leave',
      title: 'Leave Summary',
      description: 'Overview of leave requests and balances',
      icon: FileText,
    },
    {
      id: 'payroll',
      title: 'Payroll Report',
      description: 'Monthly salary disbursement report',
      icon: FileText,
    },
    {
      id: 'headcount',
      title: 'Headcount Report',
      description: 'Employee count by department',
      icon: BarChart3,
    },
  ] : [
    {
      id: 'attendance',
      title: 'My Attendance Report',
      description: 'Your monthly attendance summary',
      icon: BarChart3,
    },
    {
      id: 'salary-slip',
      title: 'Salary Slip',
      description: 'Download your monthly payslips',
      icon: FileText,
    },
    {
      id: 'leave-balance',
      title: 'Leave Balance',
      description: 'Your remaining leave balance',
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isHR ? 'Generate and download HR reports' : 'Access your personal reports'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded bg-accent flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">{report.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-8">
                  <Download size={14} className="mr-1.5" />
                  Export
                </Button>
              </div>

              {/* Placeholder content */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="h-24 bg-muted rounded flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">Report preview</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Coming soon section */}
      <div className="bg-muted/50 border border-border rounded-lg p-6 text-center">
        <p className="text-sm text-muted-foreground">
          More advanced reports and analytics coming soon
        </p>
      </div>
    </div>
  );
}
