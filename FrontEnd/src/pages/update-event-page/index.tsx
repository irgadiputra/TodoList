'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { AiOutlineClose } from 'react-icons/ai';
import { apiUrl } from '../config';
import { EventSchema } from './components/schema';
import { IEvent } from './components/type';
import { useAppSelector } from '@/lib/redux/hooks';
import { showError, showPromiseToast } from '@/utils/toast';
import { ErrorMessage, Field, Form, Formik } from 'formik';

export default function UpdateEventForm() {
  const auth = useAppSelector((state) => state.auth); // Use Redux to access authentication state
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<IEvent | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const token = auth.token; // Get token from Redux state
        if (!token) throw new Error('Token is missing'); // Early check for missing token

        const res = await axios.get(`${apiUrl}/event/${id}/organizer/${auth.user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const event = res.data.data;
        setInitialValues({
          ...event,
          start_date: event.start_date.split('T')[0],
          end_date: event.end_date.split('T')[0],
        });
        if (event.image) setFilePreview(`${apiUrl}${event.image}`);
      } catch (err) {
        showError('Failed to fetch event data');
      }
    };

    fetchEvent();
  }, [id, auth.token, auth.user.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    } else {
      alert('Please select a valid image');
    }
  };

  const handleSubmit = async (
    values: IEvent,
    { setSubmitting }: { setSubmitting: (val: boolean) => void }
  ) => {
    const promise = new Promise<string>(async (resolve, reject) => {  // Explicitly typing the Promise to return string
      try {
        const token = auth.token; // Get token from Redux state
        if (!token) throw new Error('Token is missing'); // Early check for missing token

        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('location', values.location);
        formData.append('start_date', values.start_date);
        formData.append('end_date', values.end_date);
        formData.append('quota', String(Number(values.quota)));
        formData.append('price', String(Number(values.price)));
        formData.append('status', values.status);
        formData.append('description', values.description);
        if (file) formData.append('file', file);

        await axios.patch(`${apiUrl}/event/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        resolve('Event updated successfully!');
        router.push('/my-event')
      } catch (err: any) {
        reject(err.response?.data.message || 'Failed to update event');
      }
    });

    showPromiseToast(promise, {
      loading: 'Updating event...',
      success: (data: string) => data,  
      error: (err: string) => `Failed to update event: ${err}`, 
    });

    setSubmitting(false);
  };

  if (!initialValues) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 px-4">
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={EventSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-5 w-full max-w-xl bg-white p-10 rounded-2xl shadow-md relative">
            <button
              type="button"
              className="absolute top-4 right-4 text-xl text-slate-400 hover:text-blue-500"
              onClick={() => router.push('/my-event')}
            >
              <AiOutlineClose />
            </button>

            <h2 className="text-2xl font-semibold text-slate-800 mb-2">Update Event</h2>

            {/* Name, Location (disabled), Quota, Price */}
            {['name', 'location', 'quota', 'price'].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-sm font-medium text-slate-700 capitalize">{field}</label>
                <Field
                  name={field}
                  className={`border rounded-md p-2 h-10 ${
                    ['name', 'location'].includes(field)
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : ''
                  }`}
                  disabled={['name', 'location'].includes(field)}
                />
                <ErrorMessage name={field} component="div" className="text-red-600 text-xs mt-1" />
              </div>
            ))}

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700">Start Date</label>
                <Field type="date" name="start_date" className="border rounded-md p-2 h-10" />
                <ErrorMessage name="start_date" component="div" className="text-red-600 text-xs mt-1" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700">End Date</label>
                <Field type="date" name="end_date" className="border rounded-md p-2 h-10" />
                <ErrorMessage name="end_date" component="div" className="text-red-600 text-xs mt-1" />
              </div>
            </div>

            {/* Description (disabled) */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <Field
                as="textarea"
                name="description"
                className="border rounded-md p-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                rows={3}
                disabled
              />
              <ErrorMessage name="description" component="div" className="text-red-600 text-xs mt-1" />
            </div>

            {/* Status (disabled) */}
            <div className="flex gap-4">
              {['gratis', 'berbayar'].map((s) => (
                <label key={s} className="flex items-center text-gray-500 cursor-not-allowed">
                  <Field
                    type="radio"
                    name="status"
                    value={s}
                    className="mr-2"
                    disabled
                  />
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </label>
              ))}
              <ErrorMessage name="status" component="div" className="text-red-600 text-xs mt-1" />
            </div>

            {/* Image upload */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-1">Upload Image</label>
              <label
                htmlFor="file-upload"
                className="cursor-pointer w-fit text-sm text-slate-900 border rounded py-2 px-4"
              >
                Choose Image
              </label>
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {filePreview && (
                <img
                  src={filePreview}
                  alt="Preview"
                  className="w-32 h-32 mt-2 object-cover rounded"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              {isSubmitting ? 'Updating...' : 'Update Event'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
