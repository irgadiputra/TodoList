'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { AiOutlineClose } from 'react-icons/ai';
import { useAppSelector } from '@/lib/redux/hooks';
import { showError, showPromiseToast } from '@/utils/toast';
import { apiUrl } from '../config';
import { TodoStatus } from '../Hero/components/type';
import { TodoUpdateFormValues } from './components/type';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

export default function UpdateTodoForm() {
  const auth = useAppSelector((state) => state.auth);
  const [users, setUsers] = useState<{ id: number; email: string }[]>([]);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [initialValues, setInitialValues] = useState<TodoUpdateFormValues | null>(null);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().optional(),
    userId: Yup.number().required('Assignee is required'),
    startDate: Yup.string().required('Start date is required'),
    endDate: Yup.string().required('End date is required'),
  });

  useEffect(() => {
    if (!auth.isLogin) {
      toast.error('You need to be logged in');
      router.replace('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${apiUrl}/auth/email`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setUsers(res.data.data); // Expected: { id, email }[]
      } catch (err) {
        toast.error('Failed to fetch users');
      }
    };

    const fetchTodo = async () => {
      try {
        const res = await axios.get(`${apiUrl}/todo?id=${id}`);

        const todo = res.data.data.data[0];
        setInitialValues({
          id: Number(id),
          title: todo.title,
          description: todo.description,
          status: todo.status,
          userId: Number(todo.userId),
          startDate: todo.startDate.split('T')[0],
          endDate: todo.endDate.split('T')[0],
        });
      } catch (err) {
        showError('Failed to fetch todo data');
      }
    };

    fetchUsers();
    setIsAuthorized(true);
    fetchTodo();
  }, [id, auth.token, auth.user.email, router, auth.isLogin]);

  const handleSubmit = async (
    values: TodoUpdateFormValues,
    { setSubmitting }: { setSubmitting: (val: boolean) => void }
  ) => {
    const promise = new Promise<string>(async (resolve, reject) => {
      try {
        const payload = {
          ...values,
          userId: parseInt(values.userId as any, 10), // ensure it's a number
        };
        await axios.patch(`${apiUrl}/todo`, payload)

        resolve('Todo updated successfully!');
        router.push(`/todo/${id}`);
      } catch (err: any) {
        reject(err.response?.data.message || 'Failed to update todo');
      }
    });

    showPromiseToast(promise, {
      loading: 'Updating todo...',
      success: (msg) => msg,
      error: (msg) => `Error: ${msg}`,
    });

    setSubmitting(false);
  };

  if (!initialValues) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="flex text-black items-center justify-center min-h-screen bg-slate-100 px-4">
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-5 w-full max-w-xl bg-white p-10 rounded-2xl shadow-md relative">
            <button
              type="button"
              className="absolute top-4 right-4 text-xl text-slate-400 hover:text-blue-500"
              onClick={() => router.push('/todo')}
            >
              <AiOutlineClose />
            </button>

            <h2 className="text-2xl font-semibold text-slate-800 mb-2">Update Todo</h2>

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
              <label className="text-sm font-medium text-slate-700">Status</label>
              <Field as="select" name="status" className="border rounded-md p-2 h-10">
                {Object.entries(TodoStatus).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="status" component="div" className="text-red-600 text-xs mt-1" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700">Assignee (User Email)</label>
              <Field as="select" name="userId" className="border rounded-md p-2 h-10">
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.email}
                  </option>
                ))}
              </Field>
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
              {isSubmitting ? 'Updating...' : 'Update Todo'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
