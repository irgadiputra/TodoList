'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { FaTimes } from 'react-icons/fa';
import { apiUrl } from '../config';
import { ITodo } from '../Hero/components/type';

const TodoDetails = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  
  const [todo, setTodo] = useState<ITodo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Todo ID is missing');
      setLoading(false);
      return;
    }

    const loadTodoDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${apiUrl}/todo?id=${id}`);
        setTodo(response.data.data.data[0]);
      } catch (err) {
        setError('Failed to load Todo details.');
      } finally {
        setLoading(false);
      }
    };

    loadTodoDetails();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading event details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!todo) return <p className="text-center text-gray-500">Event not found.</p>;

  const formattedStartDate = format(new Date(todo.startDate), 'd MMM yyyy, HH:mm');
  const formattedEndDate = format(new Date(todo.endDate), 'd MMM yyyy, HH:mm');
  const formattedCreatedAt = format(new Date(todo.createdAt), 'd MMM yyyy, HH:mm');
  const formattedUpdatedAt = format(new Date(todo.updatedAt), 'd MMM yyyy, HH:mm');

  const handleClose = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md relative">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900"
        >
          <FaTimes size={20} />
        </button>

        <h1 className="text-3xl font-semibold text-gray-800 mb-4">{todo.title}</h1>

        {/* Metadata Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-base text-gray-800">Todo number #{todo.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Status</p>
            <p className="text-base text-gray-800">{todo.status}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Start Date</p>
            <p className="text-base text-gray-800">{formattedStartDate}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">End Date</p>
            <p className="text-base text-gray-800">{formattedEndDate}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Created At</p>
            <p className="text-base text-gray-800">{formattedCreatedAt}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Updated At</p>
            <p className="text-base text-gray-800">{formattedUpdatedAt}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Assignee</p>
            <p className="text-base text-gray-800">{todo.user?.name} ({todo.user?.email})</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Created By</p>
            <p className="text-base text-gray-800">{todo.createdBy?.name} ({todo.createdBy?.email})</p>
          </div>
        </div>

        <hr className="my-6 border-t border-gray-300" />

        {/* Description at Bottom */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-600">Description</p>
          <p className="text-base text-gray-800 whitespace-pre-wrap">{todo.description}</p>
        </div>

        <hr className="my-6 border-t border-gray-300" />

        {/* Update Button */}
        <div className="flex justify-center">
          <button
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => router.push(`/todo/${id}/update`)}
          >
            Update Todo
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoDetails;
