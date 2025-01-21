'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import {
  CalendarIcon,
  ArrowLeft,
  Pencil,
  Download,
  Save,
  X,
  Clock
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase, handleSupabaseError } from '@/lib/supabase/client';

interface EmployeeDetails {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  employee_id: string;
  hire_date: string;
  department: string;
  position: string;
  employment_type: string;
  status: string;
  base_salary: number;
  salary_currency: string;
  bank_name: string;
  bank_account: string;
  swift_code: string;
  tax_id: string;
  social_security_number: string;
  emergency_contact: string;
}

interface PayrollHistory {
  id: string;
  period: string;
  amount: number;
  currency: string;
  status: string;
}

export default function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [employee, setEmployee] = useState<EmployeeDetails | null>(null);
  const [editedEmployee, setEditedEmployee] = useState<EmployeeDetails | null>(null);
  const [payrollHistory, setPayrollHistory] = useState<PayrollHistory[]>([]);

  useEffect(() => {
    fetchEmployeeDetails();
    fetchPayrollHistory();
  }, [params.id]);

  const fetchEmployeeDetails = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setEmployee(data);
      setEditedEmployee(data);
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

  const fetchPayrollHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('payroll_payments')
        .select('*')
        .eq('employee_id', params.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayrollHistory(data || []);
    } catch (error) {
      console.error('Error fetching payroll history:', error);
    }
  };

  const handleInputChange = (field: keyof EmployeeDetails, value: any) => {
    if (editedEmployee) {
      setEditedEmployee({ ...editedEmployee, [field]: value });
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('employees')
        .update(editedEmployee!)
        .eq('id', params.id);

      if (error) throw error;

      toast({
        title: t('Success'),
        description: t('Employee details updated successfully'),
      });

      setIsEditing(false);
      setEmployee(editedEmployee);
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

  const getStatusBadgeVariant = (status: string) => {
    const variants: Record<string, string> = {
      active: 'success',
      inactive: 'destructive',
      on_leave: 'warning',
    };
    return variants[status] || 'secondary';
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (isLoading || !employee) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/payroll/employees')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('Back')}
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {employee.first_name} {employee.last_name}
            </h1>
            <p className="text-muted-foreground">
              {employee.position} • {employee.department}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button onClick={() => setIsEditing(false)} variant="outline">
                <X className="h-4 w-4 mr-2" />
                {t('Cancel')}
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {t('Save Changes')}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => window.open(`/api/employees/${employee.id}/payslip`, '_blank')}
              >
                <Download className="h-4 w-4 mr-2" />
                {t('Download Payslip')}
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                {t('Edit')}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('Status')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={getStatusBadgeVariant(employee.status)}>
              {t(employee.status)}
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('Employment Type')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">
              {t(employee.employment_type)}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('Base Salary')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(employee.base_salary, employee.salary_currency)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('Hire Date')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(new Date(employee.hire_date), 'MMM d, yyyy')}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">{t('Employee Details')}</TabsTrigger>
          <TabsTrigger value="payroll">{t('Payroll History')}</TabsTrigger>
          <TabsTrigger value="documents">{t('Documents')}</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('Personal Information')}</CardTitle>
                <CardDescription>
                  {t('Basic employee information and contact details')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('First Name')}
                    </label>
                    <Input
                      value={editedEmployee?.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('Last Name')}
                    </label>
                    <Input
                      value={editedEmployee?.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('Email')}
                    </label>
                    <Input
                      value={editedEmployee?.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      type="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('Phone')}
                    </label>
                    <Input
                      value={editedEmployee?.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('Employment Information')}</CardTitle>
                <CardDescription>
                  {t('Work-related details and position information')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('Department')}
                    </label>
                    <Select
                      value={editedEmployee?.department}
                      onValueChange={(value) => handleInputChange('department', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">{t('Engineering')}</SelectItem>
                        <SelectItem value="sales">{t('Sales')}</SelectItem>
                        <SelectItem value="marketing">{t('Marketing')}</SelectItem>
                        <SelectItem value="hr">{t('HR')}</SelectItem>
                        <SelectItem value="finance">{t('Finance')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('Position')}
                    </label>
                    <Input
                      value={editedEmployee?.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payroll">
          <Card>
            <CardHeader>
              <CardTitle>{t('Payroll History')}</CardTitle>
              <CardDescription>
                {t('Past payments and salary history')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payrollHistory.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  {t('No payroll history found')}
                </div>
              ) : (
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          {t('Period')}
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          {t('Amount')}
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          {t('Status')}
                        </th>
                        <th className="h-12 px-4text-left align-middle font-medium">
                          {t('Actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {payrollHistory.map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-b transition-colors hover:bg-muted/50"
                        >
                          <td className="p-4">
                            {format(new Date(payment.period), 'MMMM yyyy')}
                          </td>
                          <td className="p-4">
                            {formatCurrency(payment.amount, payment.currency)}
                          </td>
                          <td className="p-4">
                            <Badge variant={payment.status === 'paid' ? 'success' : 'warning'}>
                              {t(payment.status)}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`/api/payroll/${payment.id}/download`, '_blank')}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              {t('Download')}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>{t('Employee Documents')}</CardTitle>
              <CardDescription>
                {t('Important documents and certificates')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contract Document */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {t('Employment Contract')}
                      </CardTitle>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>
                      {t('Last updated')}: {format(new Date(employee.hire_date), 'MMM d, yyyy')}
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Tax Document */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {t('Tax Documents')}
                      </CardTitle>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>
                      {t('Tax ID')}: {employee.tax_id}
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* ID Documents */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {t('ID Documents')}
                      </CardTitle>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>
                      {t('Identity verification documents')}
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Banking Information */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {t('Banking Information')}
                      </CardTitle>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>
                      {employee.bank_name} - {employee.bank_account}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="mt-6">
            {t('Deactivate Employee')}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Are you absolutely sure?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('This will deactivate the employee account and remove their system access. This action cannot be undone.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  const { error } = await supabase
                    .from('employees')
                    .update({ status: 'inactive' })
                    .eq('id', employee.id);

                  if (error) throw error;

                  toast({
                    title: t('Success'),
                    description: t('Employee has been deactivated'),
                  });

                  router.push('/payroll/employees');
                } catch (error) {
                  toast({
                    variant: 'destructive',
                    title: t('Error'),
                    description: t('Failed to deactivate employee'),
                  });
                }
              }}
            >
              {t('Deactivate')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}