'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import IRegister from '@/pages/register-page/components/type';
import { Formik, Form, Field, FormikProps } from 'formik';
import registerSchema from '@/pages/register-page/components/schema';
import Link from 'next/link';
import { AiOutlineClose } from 'react-icons/ai';
import { apiUrl } from '@/pages/config';

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<{ email?: string; referral_code?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state
  const [IsRegistered, setIsRegistered] = useState(false); // Flag for email verification sent
  const router = useRouter();

  const initialValue: IRegister = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const register = async (values: IRegister) => {
    try {
      setLoading(true);
      setErrorMessages({});
      setSuccessMessage(null);
      const { data } = await axios.post(`${apiUrl}/auth/register`, values);
      setIsRegistered(true); // Set the flag when registration is successful
      setSuccessMessage('Registration success!');
      setTimeout(() => {
        router.push('/login'); // Redirect after 5 seconds or immediately
      }, 5000);
    } catch (err: any) {
      const statusCode = err?.response?.status;
      const errorMessage = err?.response?.data?.message || 'Registration failed. Please try again.';
      if (statusCode === 409) {
        setErrorMessages((prev) => ({ ...prev, email: 'Email already registered.' }));
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({
    label,
    name,
    type = 'text',
    value,
    handleChange,
    handleFocus,
    error,
    touched,
  }: {
    label: string;
    name: keyof IRegister;
    type?: string;
    value?: string;
    handleChange: React.ChangeEventHandler<HTMLInputElement>;
    handleFocus: (name: keyof IRegister) => void;
    error?: string;
    touched?: boolean;
  }) => (
    <div className="flex flex-col w-full">
      <label className="text-sm font-medium text-slate-700 mb-1">{label}</label>
      <Field
        type={type}
        name={name}
        onChange={handleChange}
        onFocus={() => handleFocus(name)}
        value={value || ''}
        className="border border-slate-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md p-2 h-10 w-full bg-white text-slate-800 placeholder-slate-400 outline-none transition-all"
      />
      {(isSubmitted || touched) && error && <div className="text-red-600 text-xs mt-1">{error}</div>}
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 px-4">
      <Formik
        initialValues={initialValue}
        validationSchema={registerSchema}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={(values, { setSubmitting }) => {
          setIsSubmitted(true);
          register(values);
          setSubmitting(false);
        }}
      >
        {(props: FormikProps<IRegister>) => {
          const { values, handleChange, touched, errors, setFieldTouched, setFieldError, isSubmitting } = props;

          const handleFocus = (field: keyof IRegister) => {
            setFieldError(field, '');
            setFieldTouched(field, false);
          };

          return (
            <Form className="flex flex-col gap-5 w-full max-w-xl bg-white p-10 rounded-2xl shadow-md relative">
              {/* Close Button */}
              <button
                type="button"
                className="absolute top-4 right-4 text-xl text-slate-400 hover:text-blue-500 transition"
                onClick={() => router.push('/')}
              >
                <AiOutlineClose />
              </button>

              <h2 className="text-2xl font-semibold text-slate-800 mb-4">Create an Account</h2>

              {IsRegistered && (
                <div className="bg-green-100 text-green-800 p-3 rounded-md text-sm mb-4">
                  <p>{successMessage}</p>
                  <p>Redirecting you to the login page...</p>
                </div>
              )}

              <InputField label="First Name:*" name="name" value={values.name} handleChange={handleChange} handleFocus={handleFocus} error={errors.name} touched={touched.name} />
                
              <InputField label="E-Mail:*" name="email" type="email" value={values.email} handleChange={handleChange} handleFocus={handleFocus} error={errors.email || errorMessages.email} touched={touched.email} />

              <InputField label="Password:*" name="password" type="password" value={values.password} handleChange={handleChange} handleFocus={handleFocus} error={errors.password} touched={touched.password} />

              <InputField label="Confirm Password:*" name="confirmPassword" type="password" value={values.confirmPassword} handleChange={handleChange} handleFocus={handleFocus} error={errors.confirmPassword} touched={touched.confirmPassword} />

              <button
                type="submit"
                className="mt-2 p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all disabled:opacity-50"
                disabled={isSubmitting || loading}
              >
                {loading ? 'Submitting...' : 'Register'}
              </button>

              <p className="text-sm text-center text-slate-600 mt-4">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Log In Here
                </Link>
              </p>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
