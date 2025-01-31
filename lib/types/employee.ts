import { BaseEntity } from './base';

export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern';
export type EmploymentStatus = 'active' | 'inactive' | 'on_leave' | 'terminated';
export type Currency = 'USD' | 'EUR' | 'AOA';

export interface Employee extends BaseEntity {
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  emergency_contact?: string;
  date_of_birth: Date;
  hire_date: Date;
  termination_date?: Date;
  department: string;
  position: string;
  reports_to?: string;
  employment_type: EmploymentType;
  status: EmploymentStatus;
  base_salary: number;
  salary_currency: Currency;
  tax_id?: string;
  social_security_number?: string;
  bank_name?: string;
  bank_account?: string;
  swift_code?: string;
  vacation_days: number;
  sick_days: number;
}

export type EmployeeFormData = Omit<Employee, 'id' | 'created_at' | 'updated_at' | 'employee_id' | 'status' | 'vacation_days' | 'sick_days'>;