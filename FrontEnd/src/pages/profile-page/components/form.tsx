'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { profileUpdateSchema } from './schema';
import { onLogin } from '@/lib/redux/features/authSlices';
import axios from 'axios';
import { apiUrl } from '@/pages/config';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';

import { useProfileFormValues } from '../hooks/useProfileFormValues';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { AiOutlineClose } from 'react-icons/ai';

export default function ProfileForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const { initialValues, hasChanges } = useProfileFormValues();
  const isAuthorized = useAuthRedirect();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      if (!auth.token) {
        toast.error('Authorization token not found');
        return;
      }

      const updatedFields: Record<string, string> = {};

      if (values.name !== initialValues.name) updatedFields.name = values.name;
      if (values.email !== initialValues.email) updatedFields.email = values.email;
      if (values.new_password) updatedFields.new_password = values.new_password;
      if (values.old_password) updatedFields.old_password = values.old_password;


      const response = await axios.patch(`${apiUrl}/auth/user`, updatedFields, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });


      dispatch(onLogin({
        ...auth.user,
        ...response.data,
        isLogin: true,
        token: auth.token,
      }));

      toast.success('Profile updated successfully');
      router.push('/');
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const proceedResendVerification = async () => {
    try {
      setLoading(true);
      if (!auth.token) {
        toast.error('Authorization token not found');
        return;
      }

      const response = await axios.post(`${apiUrl}/auth/verify-email`, {}, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (response.status === 200) {
        toast.success('Verification email sent successfully');
      } else {
        toast.error('Failed to send verification email');
      }
    } catch (err) {
      console.error('Error sending verification email:', err);
      toast.error('Error sending verification email');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = () => {
    toast.custom((t) => (
      <div className={`bg-white p-4 rounded shadow-md max-w-sm w-full space-y-4 ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
        <p className="text-gray-800">Do you want to resend the verification email?</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              proceedResendVerification();
              toast.dismiss(t.id);
            }}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            OK
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  if (isAuthorized !== true) return null;

  return (
    <div className="flex text-black justify-center items-center min-h-screen bg-gray-50 transition-all duration-300">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg relative">
        <button
          type="button"
          className="absolute top-4 right-4 text-xl text-slate-400 hover:text-blue-500 transition"
          onClick={() => router.push('/')}
        >
          <AiOutlineClose />
        </button>

        <Formik
          initialValues={initialValues}
          validationSchema={profileUpdateSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values }) => (
            <Form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <Field name="name" className="w-full p-4 border border-gray-300 rounded-lg" />
                <ErrorMessage name="name" component="div" className="text-sm text-red-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Field type="email" name="email" className="w-full p-4 border border-gray-300 rounded-lg" />
                <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">New Password (optional)</label>
                <Field type="password" name="new_password" className="w-full p-4 border border-gray-300 rounded-lg" />
                <ErrorMessage name="new_password" component="div" className="text-sm text-red-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Old Password (optional)</label>
                <Field type="password" name="old_password" disabled={!values.new_password} className="w-full p-4 border border-gray-300 rounded-lg" />
                <ErrorMessage name="old_password" component="div" className="text-sm text-red-500" />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !hasChanges(values)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
