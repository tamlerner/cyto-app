'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { LanguageSelector } from '@/components/language-selector';
import { ThemeToggle } from '@/components/theme-toggle';
import { CytoTitle } from '@/components/ui/cyto-title';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';

export default function RegisterPage() {
 const { t } = useTranslation();
 const { signUp } = useAuth();
 const { toast } = useToast();
 const [loading, setLoading] = useState(false);

 const form = useForm<RegisterFormData>({
   resolver: zodResolver(registerSchema),
   defaultValues: {
     firstName: '',
     lastName: '',
     email: '',
     phoneNumber: '',
     countryCode: '+244',
     password: '',
     confirmPassword: '',
   },
 });

 async function onSubmit(data: RegisterFormData) {
   try {
     setLoading(true);
     await signUp(data.email, data.password);
   } catch (error) {
     toast({
       variant: 'destructive',
       title: t('Auth.RegisterError'),
       description: error instanceof Error ? error.message : 'An error occurred',
     });
   } finally {
     setLoading(false);
   }
 }

 return (
   <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/50 p-4">
     <div className="w-full max-w-md space-y-8 bg-card rounded-xl shadow-lg p-8 border border-border">
       <div className="fixed top-4 right-4 flex items-center gap-2">
         <LanguageSelector />
         <ThemeToggle />
       </div>
       
       <div className="flex flex-col items-center justify-center text-center">
         <CytoTitle size="lg" className="mb-6" />
         <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
           {t('Auth.CreateAccount')}
         </h2>
         <p className="text-sm text-muted-foreground mt-3">
           {t('Auth.EnterCredentials')}
         </p>
       </div>

       <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
           <div className="grid grid-cols-2 gap-4">
             <FormField
               control={form.control}
               name="firstName"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel className="text-sm font-medium">{t('Auth.FirstName')}</FormLabel>
                   <FormControl>
                     <Input 
                       {...field} 
                       className="h-10 focus:ring-2 focus:ring-primary/20"
                     />
                   </FormControl>
                   <FormMessage className="text-xs" />
                 </FormItem>
               )}
             />

             <FormField
               control={form.control}
               name="lastName"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel className="text-sm font-medium">{t('Auth.LastName')}</FormLabel>
                   <FormControl>
                     <Input 
                       {...field}
                       className="h-10 focus:ring-2 focus:ring-primary/20"
                     />
                   </FormControl>
                   <FormMessage className="text-xs" />
                 </FormItem>
               )}
             />
           </div>

           <FormField
             control={form.control}
             name="email"
             render={({ field }) => (
               <FormItem>
                 <FormLabel className="text-sm font-medium">{t('Auth.Email')}</FormLabel>
                 <FormControl>
                   <Input
                     type="email"
                     autoComplete="email"
                     className="h-10 focus:ring-2 focus:ring-primary/20"
                     {...field}
                   />
                 </FormControl>
                 <FormMessage className="text-xs" />
               </FormItem>
             )}
           />

           <FormField
             control={form.control}
             name="phoneNumber"
             render={({ field }) => (
               <FormItem>
                 <FormLabel className="text-sm font-medium">{t('Auth.Phone')}</FormLabel>
                 <FormControl>
                   <Input 
                     type="tel" 
                     className="h-10 focus:ring-2 focus:ring-primary/20"
                     {...field} 
                   />
                 </FormControl>
                 <FormMessage className="text-xs" />
               </FormItem>
             )}
           />

           <div className="space-y-4">
             <FormField
               control={form.control}
               name="password"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel className="text-sm font-medium">{t('Auth.Password')}</FormLabel>
                   <FormControl>
                     <Input
                       type="password"
                       autoComplete="new-password"
                       className="h-10 focus:ring-2 focus:ring-primary/20"
                       {...field}
                     />
                   </FormControl>
                   <FormMessage className="text-xs" />
                 </FormItem>
               )}
             />

             <FormField
               control={form.control}
               name="confirmPassword"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel className="text-sm font-medium">{t('Auth.ConfirmPassword')}</FormLabel>
                   <FormControl>
                     <Input
                       type="password"
                       autoComplete="new-password"
                       className="h-10 focus:ring-2 focus:ring-primary/20"
                       {...field}
                     />
                   </FormControl>
                   <FormMessage className="text-xs" />
                 </FormItem>
               )}
             />
           </div>

           <Button 
             className="w-full text-lg h-11 transition-all hover:scale-[1.02] bg-gradient-to-r from-primary to-primary/80"
             type="submit" 
             disabled={loading}
           >
             {loading ? (
               <div className="flex items-center gap-2">
                 <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                 {t('Auth.SigningUp')}
               </div>
             ) : (
               t('Auth.SignUp')
             )}
           </Button>
         </form>
       </Form>

       <div className="text-center text-sm pt-4 border-t border-border">
         {t('Auth.HaveAccount')}{' '}
         <Link 
           href="/login" 
           className="text-primary hover:underline font-medium transition-colors"
         >
           {t('Auth.SignIn')}
         </Link>
       </div>
     </div>
   </div>
 );
}