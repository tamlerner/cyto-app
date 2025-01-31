'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { Alert, AlertDescription } from '@/components/ui/alert';

type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern';
type Currency = 'USD' | 'EUR' | 'AOA';

interface EmployeeFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  emergency_contact?: string;
  department: string;
  position: string;
  employment_type: EmploymentType;
  base_salary: number;
  salary_currency: Currency;
  tax_id?: string;
  social_security_number?: string;
  bank_name?: string;
  bank_account?: string;
  swift_code?: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function NewEmployeePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    emergency_contact: '',
    department: '',
    position: '',
    employment_type: 'full_time',
    base_salary: 0,
    salary_currency: 'USD',
    tax_id: '',
    social_security_number: '',
    bank_name: '',
    bank_account: '',
    swift_code: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.email?.includes('@')) newErrors.email = 'Invalid email';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (formData.base_salary <= 0) newErrors.base_salary = 'Invalid salary';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = <K extends keyof EmployeeFormData>(
    field: K,
    value: EmployeeFormData[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !validateForm()) return;
  
    try {
      setLoading(true);
      const employeeId = `EMP${Date.now().toString().slice(-6)}`;
      const todayDate = new Date().toISOString().split('T')[0];
  
      const { error: insertError } = await supabase
        .from('employees')
        .insert([{
          ...formData,
          user_id: user.id,
          employee_id: employeeId,
          hire_date: todayDate,
          status: 'active',
          vacation_days: 0,
          sick_days: 0
        }]);
  
      if (insertError) throw insertError;
      router.push('/payroll/employees');
    } catch (err) {
      const error = err as Error;
      console.error('Error creating employee:', error.message);
      setErrors({ 
        submit: error.message || 'Failed to create employee' 
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title={t('Add New Employee')}
        description={t('Create a new employee record')}
      />

      {errors.submit && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{errors.submit}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('Personal Information')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('First Name')}</Label>
                  <Input
                    value={formData.first_name}
                    onChange={e => handleInputChange('first_name', e.target.value)}
                    className={errors.first_name ? 'border-red-500' : ''}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm">{errors.first_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{t('Last Name')}</Label>
                  <Input
                    value={formData.last_name}
                    onChange={e => handleInputChange('last_name', e.target.value)}
                    className={errors.last_name ? 'border-red-500' : ''}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm">{errors.last_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{t('Email')}</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{t('Phone')}</Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('Emergency Contact')}</Label>
                  <Input
                    value={formData.emergency_contact}
                    onChange={e => handleInputChange('emergency_contact', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('Employment Information')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('Department')}</Label>
                  <Select 
                    value={formData.department}
                    onValueChange={value => handleInputChange('department', value)}
                  >
                    <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
                      <SelectValue placeholder={t('Select department')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">{t('Engineering')}</SelectItem>
                      <SelectItem value="sales">{t('Sales')}</SelectItem>
                      <SelectItem value="marketing">{t('Marketing')}</SelectItem>
                      <SelectItem value="hr">{t('HR')}</SelectItem>
                      <SelectItem value="finance">{t('Finance')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p className="text-red-500 text-sm">{errors.department}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{t('Position')}</Label>
                  <Input
                    value={formData.position}
                    onChange={e => handleInputChange('position', e.target.value)}
                    className={errors.position ? 'border-red-500' : ''}
                  />
                  {errors.position && (
                    <p className="text-red-500 text-sm">{errors.position}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{t('Employment Type')}</Label>
                  <Select
                    value={formData.employment_type}
                    onValueChange={value => handleInputChange('employment_type', value as EmploymentType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">{t('Full Time')}</SelectItem>
                      <SelectItem value="part_time">{t('Part Time')}</SelectItem>
                      <SelectItem value="contract">{t('Contract')}</SelectItem>
                      <SelectItem value="intern">{t('Intern')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('Base Salary')}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={formData.base_salary}
                      onChange={e => handleInputChange('base_salary', Number(e.target.value))}
                      min="0"
                      step="0.01"
                      className={errors.base_salary ? 'border-red-500' : ''}
                    />
                    <Select
                      value={formData.salary_currency}
                      onValueChange={value => handleInputChange('salary_currency', value as Currency)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="AOA">AOA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.base_salary && (
                    <p className="text-red-500 text-sm">{errors.base_salary}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('Additional Information')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('Tax ID')}</Label>
                  <Input
                    value={formData.tax_id}
                    onChange={e => handleInputChange('tax_id', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('Social Security Number')}</Label>
                  <Input
                    value={formData.social_security_number}
                    onChange={e => handleInputChange('social_security_number', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Banking Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('Banking Information')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('Bank Name')}</Label>
                  <Input
                    value={formData.bank_name}
                    onChange={e => handleInputChange('bank_name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('Bank Account')}</Label>
                  <Input
                    value={formData.bank_account}
                    onChange={e => handleInputChange('bank_account', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('SWIFT Code')}</Label>
                  <Input
                    value={formData.swift_code}
                    onChange={e => handleInputChange('swift_code', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                {t('Cancel')}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? t('Adding Employee...') : t('Add Employee')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}