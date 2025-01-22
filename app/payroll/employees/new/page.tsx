'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { addYears, startOfDay, isAfter } from 'date-fns';


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
import { toast } from '@/components/ui/use-toast';
import { supabase, handleSupabaseError } from '@/lib/supabase/client';

export default function NewEmployeePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const maxBirthDate = startOfDay(addYears(new Date(), -18));
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: new Date(),
    employeeId: '',
    hireDate: new Date(),
    department: '',
    position: '',
    employmentType: 'full_time',
    status: 'active',
    baseSalary: '',
    currency: 'USD',
    bankName: '',
    bankAccount: '',
    swiftCode: '',
    taxId: '',
    socialSecurityNumber: '',
    emergencyContact: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('employees')
        .insert([{
          user_id: user?.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth,
          employee_id: formData.employeeId,
          hire_date: formData.hireDate,
          department: formData.department,
          position: formData.position,
          employment_type: formData.employmentType,
          status: formData.status,
          base_salary: parseFloat(formData.baseSalary),
          salary_currency: formData.currency,
          bank_name: formData.bankName,
          bank_account: formData.bankAccount,
          swift_code: formData.swiftCode,
          tax_id: formData.taxId,
          social_security_number: formData.socialSecurityNumber,
          emergency_contact: formData.emergencyContact
        }]);

      if (error) throw error;

      toast({
        title: t('Success'),
        description: t('Employee has been successfully created'),
      });

      router.push('/payroll/employees');
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="mr-4"
          onClick={() => router.push('/payroll/employees')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('Back to Employees')}
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t('Add New Employee')}</h1>
          <p className="text-muted-foreground">
            {t('Enter the employee details to create a new record')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">{t('Personal Information')}</TabsTrigger>
            <TabsTrigger value="employment">{t('Employment Details')}</TabsTrigger>
            <TabsTrigger value="financial">{t('Financial Information')}</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>{t('Personal Information')}</CardTitle>
                <CardDescription>
                  {t('Enter the basic personal information of the employee')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('First Name')}</label>
                    <Input
                      required
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('Last Name')}</label>
                    <Input
                      required
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('Email')}</label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('Phone')}</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('Date of Birth')}</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={!formData.dateOfBirth ? "text-muted-foreground" : ""}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.dateOfBirth
                            ? format(formData.dateOfBirth, 'PPP')
                            : <span>{t('Pick a date')}</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.dateOfBirth}
                          onSelect={(date) => {
                            if (date && isAfter(date, maxBirthDate)) {
                              toast({
                                variant: 'destructive',
                                title: t('Invalid Date'),
                                description: t('Employee must be at least 18 years old'),
                              });
                              return;
                            }
                            handleInputChange('dateOfBirth', date);
                          }}
                          disabled={(date) => isAfter(date, maxBirthDate)}
                          initialFocus
                          captionLayout="dropdown-buttons" // Enable dropdown for year and month
                          fromYear={1900} // Set the earliest selectable year
                          toYear={new Date().getFullYear() - 18} // Limit to 18 years ago
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('Emergency Contact')}</label>
                    <Input
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employment">
            <Card>
              <CardHeader>
                <CardTitle>{t('Employment Details')}</CardTitle>
                <CardDescription>{t('Enter work-related information')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('Employee ID')}</label>
                    <Input
                      required
                      value={formData.employeeId}
                      onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('Department')}</label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => handleInputChange('department', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select department')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('Position')}</label>
                    <Input
                      required
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('Employment Type')}</label>
                    <Select
                      value={formData.employmentType}
                      onValueChange={(value) => handleInputChange('employmentType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select type')} />
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
                    <label className="text-sm font-medium">{t('Status')}</label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select status')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">{t('Active')}</SelectItem>
                        <SelectItem value="inactive">{t('Inactive')}</SelectItem>
                        <SelectItem value="on_leave">{t('On Leave')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('Hire Date')}</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={!formData.hireDate ? "text-muted-foreground" : ""}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.hireDate ? format(formData.hireDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.hireDate}
                          onSelect={(date) => handleInputChange('hireDate', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>{t('Financial Information')}</CardTitle>
                <CardDescription>{t('Enter salary and banking details')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('Base Salary')}</label>
                    <Input
                      type="number"
                      required
                      value={formData.baseSalary}
                      onChange={(e) => handleInputChange('baseSalary', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('Currency')}</label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => handleInputChange('currency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select currency')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="AOA">AOA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('Bank Name')}</label>
                    <Input
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('Bank Account')}</label>
                    <Input
                      value={formData.bankAccount}
                      onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('Swift Code')}</label>
                    <Input
                      value={formData.swiftCode}
                      onChange={(e) => handleInputChange('swiftCode', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('Tax ID')}</label>
                    <Input
                      value={formData.taxId}
                      onChange={(e) => handleInputChange('taxId', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('Social Security Number')}</label>
                    <Input
                      value={formData.socialSecurityNumber}
                      onChange={(e) => handleInputChange('socialSecurityNumber', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>  {/* Add this closing tag */}

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/payroll/employees')}
            disabled={isLoading}
          >
            {t('Cancel')}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t('Creating...') : t('Create Employee')}
          </Button>
        </div>
      </form>
    </div>
  );
}