'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  UserPlus,
  Search,
  MoreHorizontal,
  Download,
  Building2,
  Filter
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { supabase, handleSupabaseError } from '@/lib/supabase/client';

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  position: string;
  status: 'active' | 'inactive' | 'on_leave';
  employment_type: string;
  hire_date: string;
  base_salary: number;
  salary_currency: string;
}

export default function EmployeesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchEmployees();
  }, [departmentFilter, statusFilter]);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('employees')
        .select('*')
        .order('last_name', { ascending: true });

      if (departmentFilter !== 'all') {
        query = query.eq('department', departmentFilter);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      toast({
        variant: 'destructive',
        title: t('Error'),
        description: t(errorMessage),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = () => {
    router.push('/payroll/employees/new');
  };

  const handleViewEmployee = (id: string) => {
    router.push(`/payroll/employees/${id}`);
  };

  const filteredEmployees = employees.filter(employee => {
    const searchString = `${employee.first_name} ${employee.last_name} ${employee.email} ${employee.position}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'destructive';
      case 'on_leave':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('Employees')}</h1>
          <p className="text-muted-foreground">
            {t('Manage your employee directory')}
          </p>
        </div>
        <Button onClick={handleAddEmployee}>
          <UserPlus className="mr-2 h-4 w-4" />
          {t('Add Employee')}
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('Employee Statistics')}</CardTitle>
          <CardDescription>{t('Quick overview of your workforce')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('Total Employees')}
                </p>
                <h3 className="text-2xl font-bold">
                  {filteredEmployees.length}
                </h3>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('Active Employees')}
                </p>
                <h3 className="text-2xl font-bold">
                  {filteredEmployees.filter(e => e.status === 'active').length}
                </h3>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('Departments')}
                </p>
                <h3 className="text-2xl font-bold">
                  {new Set(filteredEmployees.map(e => e.department)).size}
                </h3>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-1 gap-4">
              <div className="flex-1 max-w-sm">
                <Input
                  placeholder={t('Search employees...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('Department')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('All Departments')}</SelectItem>
                  <SelectItem value="engineering">{t('Engineering')}</SelectItem>
                  <SelectItem value="sales">{t('Sales')}</SelectItem>
                  <SelectItem value="marketing">{t('Marketing')}</SelectItem>
                  <SelectItem value="hr">{t('HR')}</SelectItem>
                  <SelectItem value="finance">{t('Finance')}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('Status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('All Status')}</SelectItem>
                  <SelectItem value="active">{t('Active')}</SelectItem>
                  <SelectItem value="inactive">{t('Inactive')}</SelectItem>
                  <SelectItem value="on_leave">{t('On Leave')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              {t('No employees found')}
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="h-12 px-4 align-middle font-medium">{t('Name')}</th>
                    <th className="h-12 px-4 align-middle font-medium">{t('Position')}</th>
                    <th className="h-12 px-4 align-middle font-medium">{t('Department')}</th>
                    <th className="h-12 px-4 align-middle font-medium">{t('Status')}</th>
                    <th className="h-12 px-4 align-middle font-medium">{t('Base Salary')}</th>
                    <th className="h-12 px-4 align-middle font-medium">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4">
                        <div>
                          <div className="font-medium">
                            {employee.first_name} {employee.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {employee.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{employee.position}</td>
                      <td className="p-4">
                        <Badge variant="outline">{employee.department}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={getStatusBadgeVariant(employee.status)}>
                          {t(employee.status)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {formatCurrency(employee.base_salary, employee.salary_currency)}
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">{t('Open menu')}</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewEmployee(employee.id)}>
                              {t('View Details')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/payroll/employees/${employee.id}/edit`)}>
                              {t('Edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(`/api/employees/${employee.id}/payslip`, '_blank')}>
                              {t('Download Payslip')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}