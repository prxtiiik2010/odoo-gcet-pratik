import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { payrollRecords, employees, getNetSalary, getGrossSalary, getTotalDeductions, PayrollRecord } from '@/lib/mock-data';
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
import { Separator } from '@/components/ui/separator';
import { Download } from 'lucide-react';

export default function Payroll() {
  const { user } = useAuth();
  const [records, setRecords] = useState<Record<string, PayrollRecord>>(payrollRecords);

  if (!user) return null;

  const isHR = user.role === 'hr';
  const userPayroll = records[user.id];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleUpdateSalary = (employeeId: string, field: keyof PayrollRecord, value: number) => {
    setRecords(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [field]: value,
      }
    }));
  };

  // Employee View
  if (!isHR && userPayroll) {
    const gross = getGrossSalary(userPayroll);
    const deductions = getTotalDeductions(userPayroll);
    const net = getNetSalary(userPayroll);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Payroll</h1>
            <p className="text-sm text-muted-foreground mt-1">Your salary details for {userPayroll.month}</p>
          </div>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Download Payslip
          </Button>
        </div>

        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-medium text-foreground">Salary Breakdown</h2>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Earnings */}
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Earnings</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Basic Pay</span>
                  <span className="text-foreground">{formatCurrency(userPayroll.basicPay)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">House Rent Allowance</span>
                  <span className="text-foreground">{formatCurrency(userPayroll.hra)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Transport Allowance</span>
                  <span className="text-foreground">{formatCurrency(userPayroll.transportAllowance)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Medical Allowance</span>
                  <span className="text-foreground">{formatCurrency(userPayroll.medicalAllowance)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Other Allowances</span>
                  <span className="text-foreground">{formatCurrency(userPayroll.otherAllowances)}</span>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-sm font-medium">
                <span>Gross Salary</span>
                <span>{formatCurrency(gross)}</span>
              </div>
            </div>

            <Separator />

            {/* Deductions */}
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Deductions</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Provident Fund</span>
                  <span className="text-destructive">-{formatCurrency(userPayroll.providentFund)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Professional Tax</span>
                  <span className="text-destructive">-{formatCurrency(userPayroll.professionalTax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Income Tax</span>
                  <span className="text-destructive">-{formatCurrency(userPayroll.incomeTax)}</span>
                </div>
                {userPayroll.otherDeductions > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">Other Deductions</span>
                    <span className="text-destructive">-{formatCurrency(userPayroll.otherDeductions)}</span>
                  </div>
                )}
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-sm font-medium">
                <span>Total Deductions</span>
                <span className="text-destructive">-{formatCurrency(deductions)}</span>
              </div>
            </div>

            <Separator />

            {/* Net Pay */}
            <div className="flex justify-between text-base font-semibold">
              <span>Net Salary</span>
              <span className="text-primary">{formatCurrency(net)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // HR View
  const nonHrEmployees = employees.filter(e => e.role !== 'hr');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Payroll Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage employee salaries and generate payslips</p>
      </div>

      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-medium text-foreground">Employee Salaries - January 2024</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead className="text-right">Basic Pay</TableHead>
                <TableHead className="text-right">HRA</TableHead>
                <TableHead className="text-right">Other Allow.</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Salary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nonHrEmployees.map((emp) => {
                const payroll = records[emp.id];
                if (!payroll) return null;

                return (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={payroll.basicPay}
                        onChange={(e) => handleUpdateSalary(emp.id, 'basicPay', parseInt(e.target.value) || 0)}
                        className="h-8 w-24 text-right ml-auto"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={payroll.hra}
                        onChange={(e) => handleUpdateSalary(emp.id, 'hra', parseInt(e.target.value) || 0)}
                        className="h-8 w-20 text-right ml-auto"
                      />
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatCurrency(payroll.transportAllowance + payroll.medicalAllowance + payroll.otherAllowances)}
                    </TableCell>
                    <TableCell className="text-right text-destructive">
                      -{formatCurrency(getTotalDeductions(payroll))}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(getNetSalary(payroll))}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8">
                        <Download size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
