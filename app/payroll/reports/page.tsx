'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { DateRange as DateRangeType } from "react-day-picker";
import { toast } from '@/components/ui/use-toast';
import { supabase, handleSupabaseError } from '@/lib/supabase/client';
import { BarChart, XAxis, YAxis, Bar, ResponsiveContainer, CartesianGrid, Tooltip, Legend } from 'recharts';

type DateRangeValue = DateRangeType | undefined;

interface PayrollCost {
  id: string;
  name: string;
  department: string;
  total_pay: number;
}

interface EmployeeGrowth {
  month: string;
  new_hires: number;
}

interface AbsenteeismTrend {
  month: string;
  absences: number;
}

const PayrollReports = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    department: '',
    dateRange: [undefined, undefined] as DateRangeValue
  });
  const [isLoading, setIsLoading] = useState(false);
  const [payrollCosts, setPayrollCosts] = useState<PayrollCost[]>([]);
  const [employeeGrowth, setEmployeeGrowth] = useState<EmployeeGrowth[]>([]);
  const [absenteeismTrends, setAbsenteeismTrends] = useState<AbsenteeismTrend[]>([]);

  const fetchPayrollCosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('payroll_payments')
        .select(`
          employee_id,
          net_pay,
          employees (
            id,
            first_name,
            last_name,
            department
          )  
        `)
        .eq('employees.department', filters.department)
        .gte('payroll_payments.created_at', filters.dateRange[0]) 
        .lte('payroll_payments.created_at', filters.dateRange[1])
        .order('net_pay', { ascending: false });
      if (error) throw error;
      const employeeCosts = data.reduce((result, payment) => {
        const employee = result.find(e => e.id === payment.employee_id);
        if (employee) {
          employee.total_pay += payment.net_pay;
        } else {
          result.push({
            id: payment.employee_id,
            name: `${payment.employees.first_name} ${payment.employees.last_name}`,
            department: payment.employees.department,  
            total_pay: payment.net_pay
          });  
        }
        return result;
      }, [] as PayrollCost[]);
      setPayrollCosts(employeeCosts);
    } catch(error) {
      handleError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchEmployeeGrowth = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('employees')  
        .select(`
          hire_date
        `)
        .eq('department', filters.department)
        .gte('hire_date', filters.dateRange[0])
        .lte('hire_date', filters.dateRange[1])
        .order('hire_date', { ascending: true });
      if (error) throw error;
      const monthCounts = data.reduce((result, employee) => {
        const month = new Date(employee.hire_date).toLocaleString('default', { month: 'short' });
        result[month] = (result[month] || 0) + 1;
        return result;  
      }, {} as Record<string, number>);
      const growthData = Object.entries(monthCounts).map(([month, hires]) => ({
        month, 
        new_hires: hires
      }));
      setEmployeeGrowth(growthData); 
    } catch(error) {
      handleError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchAbsenteeismTrends = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('attendance_records')
        .select(`
          date,
          status  
        `)
        .eq('employees.department', filters.department) 
        .gte('date', filters.dateRange[0])
        .lte('date', filters.dateRange[1])
        .eq('status', 'absent');
      if (error) throw error;
      const monthCounts = data.reduce((result, record) => {
        const month = new Date(record.date).toLocaleString('default', { month: 'short' }); 
        result[month] = (result[month] || 0) + 1;
        return result;
      }, {} as Record<string, number>);
      const absenteeismData = Object.entries(monthCounts).map(([month, absences]) => ({
        month,
        absences  
      }));
      setAbsenteeismTrends(absenteeismData);
    } catch(error) {
      handleError(error as Error); 
    } finally {
      setIsLoading(false);  
    }
  }, [filters]);

  useEffect(() => {
    fetchPayrollCosts();
    fetchEmployeeGrowth();   
    fetchAbsenteeismTrends();
  }, [filters, fetchPayrollCosts, fetchEmployeeGrowth, fetchAbsenteeismTrends]);

  const handleError = (error: Error) => {
    const errorMessage = handleSupabaseError(error);
    toast({
      variant: 'destructive', 
      title: t('Error'),
      description: t(errorMessage),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-2xl font-bold">{t('Payroll Reports')}</h2>
        <div className="flex flex-col xs:flex-row gap-2">
          <Select
            value={filters.department}
            onValueChange={value => setFilters({ ...filters, department: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('Department')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('All Departments')}</SelectItem>
              <SelectItem value="engineering">{t('Engineering')}</SelectItem>
              <SelectItem value="sales">{t('Sales')}</SelectItem>
              <SelectItem value="marketing">{t('Marketing')}</SelectItem>
              <SelectItem value="hr">{t('HR')}</SelectItem>
              <SelectItem value="finance">{t('Finance')}</SelectItem>
            </SelectContent>
          </Select>
          <DateRangeType 
            value={filters.dateRange}
            onChange={val => setFilters({ ...filters, dateRange: val })}
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t('Payroll Costs')}</CardTitle>   
            <CardDescription>{t('Total net pay by employee')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={payrollCosts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />  
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_pay" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>   
            <CardTitle>{t('Employee Growth')}</CardTitle>
            <CardDescription>{t('New hires per month')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>  
              <BarChart data={employeeGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" /> 
                <YAxis />
                <Tooltip />  
                <Legend />
                <Bar dataKey="new_hires" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>  
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('Absenteeism Trends')}</CardTitle>  
            <CardDescription>{t('Absences per month')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={absenteeismTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />  
                <Tooltip />
                <Legend /> 
                <Bar dataKey="absences" fill="#ffc658" />
              </BarChart> 
            </ResponsiveContainer>
          </CardContent>
        </Card>  
      </div>
    </div>
  );  
};

export default PayrollReports;