'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  WalletCards, 
  BarChart3,
  UserPlus,
  Building2,
  Calendar,
  DollarSign,
  Clock,
  FileText
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { toast } from '@/components/ui/use-toast';
import { supabase, handleSupabaseError } from '@/lib/supabase/client';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  totalPayroll: number;
  averageSalary: number;
  departmentCounts: Record<string, number>;
  pendingPayments: number;
  pendingLeaves: number;
}

const PayrollDashboard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('status, department')
        .not('status', 'eq', 'terminated');

      if (employeeError) throw employeeError;

      const { data: payrollData, error: payrollError } = await supabase
        .from('payroll_payments')
        .select('net_pay')
        .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());

      if (payrollError) throw payrollError;

      const departmentCounts = employeeData.reduce((acc: Record<string, number>, curr) => {
        acc[curr.department] = (acc[curr.department] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalEmployees: employeeData.length,
        activeEmployees: employeeData.filter(e => e.status === 'active').length,
        totalPayroll: payrollData.reduce((sum, p) => sum + p.net_pay, 0),
        averageSalary: payrollData.length ? payrollData.reduce((sum, p) => sum + p.net_pay, 0) / payrollData.length : 0,
        departmentCounts,
        pendingPayments: 0,
        pendingLeaves: 0
      });

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

  const handleRunPayroll = () => {
    router.push('/payroll/new');
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title={t('Payroll & HR Management')}
        description={t('Manage employees, payroll, and generate reports')}
      />

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">
            <Users className="mr-2 h-4 w-4" />
            {t('Employee Management')}
          </TabsTrigger>
          <TabsTrigger value="payroll" className="opacity-50 cursor-not-allowed" title="Coming Soon">
          <WalletCards className="mr-2 h-4 w-4" />
          {t('Payroll Management')}
        </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart3 className="mr-2 h-4 w-4" />
            {t('Reports & Analytics')}
          </TabsTrigger> 
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button onClick={handleAddEmployee}>
              <UserPlus className="mr-2 h-4 w-4" />
              {t('Add Employee')}
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('Total Employees')}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalEmployees || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {t('Across all departments')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('Active Employees')}
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeEmployees || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {t('Currently working')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('Pending Leave Requests')}
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pendingLeaves || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {t('Awaiting approval')}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <div className="text-center py-12 text-muted-foreground">
            <WalletCards className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">{t('Coming Soon')}</h3>
            <p>{t('Payroll management features will be available soon')}</p>
          </div>
        </TabsContent>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('Total Payroll')}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats?.totalPayroll.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('This month')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('Average Salary')}
                </CardTitle>
                <WalletCards className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${Math.round(stats?.averageSalary || 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('Per employee')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('Pending Payments')}
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pendingPayments || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {t('To be processed')}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full cursor-pointer hover:bg-muted/50" onClick={() => router.push('/reports/payroll')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>{t('Payroll Reports')}</CardTitle>
                  <CardDescription>
                    {t('View detailed payroll reports and analytics')}
                  </CardDescription>
                </div>
                <FileText className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
            </Card>

            <Card className="col-span-full cursor-pointer hover:bg-muted/50" onClick={() => router.push('/reports/employees')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>{t('Employee Reports')}</CardTitle>
                  <CardDescription>
                    {t('View employee statistics and trends')}
                  </CardDescription>
                </div>
                <Users className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
            </Card>

            <Card className="col-span-full cursor-pointer hover:bg-muted/50" onClick={() => router.push('/reports/attendance')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>{t('Attendance Reports')}</CardTitle>
                  <CardDescription>
                    {t('View attendance and leave statistics')}
                  </CardDescription>
                </div>
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayrollDashboard;