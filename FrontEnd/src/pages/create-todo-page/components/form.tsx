'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { TodoStatus } from '@/pages/Hero/components/type';
import { ITodoCreateFormValues } from './type';
import { apiUrl } from '@/pages/config';

export interface TodoUpdateFormValues {
  title?: string;
  description?: string;
  userId: number;
  startDate: string;
  endDate: string;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().optional(),
  userId: Yup.number().required('Assignee is required'),
  startDate: Yup.string().required('Start date is required'),
  endDate: Yup.string().required('End date is required'),
});

export default function CreateTodoForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!auth.isLogin) {
      toast.error('You need to be logged in');
      router.replace('/login');
      return;
    }
    setIsAuthorized(true);
  }, [auth.isLogin, router]);

  if (!isAuthorized) return <p className="text-center mt-20">Checking authorization...</p>;

  const initialValues: TodoUpdateFormValues = {
    title: '',
    description: '',
    userId: 0,
    startDate: '',
    endDate: '',
  };

  const handleSubmit = async (values: TodoUpdateFormValues, { setSubmitting }: any) => {
    try {
      const res = await axios.post(`${apiUrl}/todo`, values, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      toast.success('Todo created successfully');
      console.log(res);
      router.push(`/todo/${res.data.data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create todo');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex text-black items-center justify-center min-h-screen bg-slate-100 px-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-5 w-full max-w-xl bg-white p-10 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">Create Todo</h2>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700">Title</label>
              <Field name="title" className="border rounded-md p-2 h-10" />
              <ErrorMessage name="title" component="div" className="text-red-600 text-xs mt-1" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <Field as="textarea" name="description" className="border rounded-md p-2" rows={3} />
              <ErrorMessage name="description" component="div" className="text-red-600 text-xs mt-1" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700">Assignee (User ID)</label>
              <Field name="userId" type="number" className="border rounded-md p-2 h-10" />
              <ErrorMessage name="userId" component="div" className="text-red-600 text-xs mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700">Start Date</label>
                <Field type="date" name="startDate" className="border rounded-md p-2 h-10" />
                <ErrorMessage name="startDate" component="div" className="text-red-600 text-xs mt-1" />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700">End Date</label>
                <Field type="date" name="endDate" className="border rounded-md p-2 h-10" />
                <ErrorMessage name="endDate" component="div" className="text-red-600 text-xs mt-1" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              {isSubmitting ? 'Creating...' : 'Create Todo'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
