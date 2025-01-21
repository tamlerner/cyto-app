'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { toast } from '@/components/ui/use-toast';
import { supabase, handleSupabaseError } from '@/lib/supabase/client';

const PayrollPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [payrolls, setPayrolls] = useState([]);

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('payrolls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setPayrolls(data || []);
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      toast({
        variant: 'destructive',
        title: t('Error'),
        description: t(errorMessage)
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    router.push('/payroll/new');
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title={t('Payroll')}
        description={t('Manage employee payroll and compensation')}
        action={
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            {t('Create New Payroll')}
          </Button>
        }
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t('Recent Payrolls')}</CardTitle>
          <CardDescription>
            {t('View and manage your payroll records')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : payrolls.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              {t('No payroll records found')}
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-medium">{t('Period')}</th>
                    <th className="p-4 text-left font-medium">{t('Status')}</th>
                    <th className="p-4 text-left font-medium">{t('Employees')}</th>
                    <th className="p-4 text-left font-medium">{t('Total Amount')}</th>
                    <th className="p-4 text-left font-medium">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {payrolls.map((payroll: any) => (
                    <tr key={payroll.id} className="border-b">
                      <td className="p-4">{payroll.period}</td>
                      <td className="p-4">{payroll.status}</td>
                      <td className="p-4">{payroll.employee_count}</td>
                      <td className="p-4">{payroll.total_amount}</td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          onClick={() => router.push(`/payroll/${payroll.id}`)}
                        >
                          {t('View')}
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
    </div>
  );
};

export default PayrollPage;