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

export default function UpdateTodoForm() {
  const auth = useAppSelector((state) => state.auth);
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [initialValues, setInitialValues] = useState<TodoUpdateFormValues | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTodo = async () => {
      try {
        // const token = auth.token;
        // if (!token) throw new Error('Missing token');

        const res = await axios.get(`${apiUrl}/todo?id=${id}`);

        const todo = res.data.data.data[0];

        // const isAuthorized = todo.creatorId === auth.user.email || todo.userId === auth.user.email;

        // if (!isAuthorized) {
        //   router.push('/unauthorized');
        //   return;
        // }

        setInitialValues({
          id: Number(id),
          title: todo.title,
          description: todo.description,
          status: todo.status,
          userId: todo.userId,
          startDate: todo.startDate.split('T')[0],
          endDate: todo.endDate.split('T')[0],
        });
      } catch (err) {
        showError('Failed to fetch todo data');
      }
    };

    fetchTodo();
  }, [id, auth.token, auth.user.email, router]);

  const handleSubmit = async (
    values: TodoUpdateFormValues,
    { setSubmitting }: { setSubmitting: (val: boolean) => void }
  ) => {
    const promise = new Promise<string>(async (resolve, reject) => {
      try {
        await axios.patch(`${apiUrl}/todo`, values)

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
              {isSubmitting ? 'Updating...' : 'Update Todo'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
