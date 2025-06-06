'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../config';
import { AiOutlineClose } from 'react-icons/ai';
import { ITodo } from '../Hero/components/type';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams?.get('query') || '';
  const location = searchParams?.get('location') || '';
  const status = searchParams?.get('status') || '';
  const page = Number(searchParams?.get('page') || 1);
  const limit = 10;

  const [todos, setTodos] = useState<ITodo[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    const formattedDate = new Date(date).toLocaleDateString('en-GB', options);
    return formattedDate;
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    const fetchtodos = async () => {
      try {
        setLoading(true); // Show loading while fetching todo

        const res = await axios.get(`${apiUrl}/todo`, {
          params: {
            title: query,
            page,
            limit,
          },
        });

        setTodos(res.data.data.data);
        setTotalCount(res.data.totalCount);
      } catch (error) {
        console.error('Failed to fetch todos:', error);
        setTodos([]); // Set empty array in case of failure
      } finally {
        setLoading(false); // Set loading to false once fetch is done
      }
    };

    fetchtodos();
  }, [query, location, status, page]);

  const updateQueryParams = (newParams: { [key: string]: string | number }) => {
    const updatedParams = new URLSearchParams(window.location.search);

    Object.keys(newParams).forEach((key) => {
      if (newParams[key]) {
        updatedParams.set(key, String(newParams[key]));
      } else {
        updatedParams.delete(key);
      }
    });

    router.push(`/search?${updatedParams.toString()}`);
  };

  const totalPages = totalCount ? Math.ceil(totalCount / limit) : 1;

  const handleViewDetails = (id: number) => {
    router.push(`/todo/${id}`);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto relative">
      {/* Close Button */}
      <button
        type="button"
        className="absolute top-4 right-4 text-xl text-slate-400 hover:text-blue-500 transition"
        onClick={() => router.push('/')}
      >
        <AiOutlineClose />
      </button>

      <h1 className="text-2xl font-bold mb-4 text-center">Search Results</h1>

      {/* Todos Listings */}
      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : todos.length === 0 ? (
        <p className="text-center text-lg">No todos found.</p>
      ) : (
        <div className="space-y-4">
          {todos.map((todo) => (
            <div key={todo.id} className="p-4 bg-white rounded-lg shadow-md">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">{todo.title}</h2>
                  <p className="text-gray-600">
                    <strong>Status:</strong> {capitalizeFirstLetter(todo.status)}
                  </p>
                  <p className="text-gray-600">
                    <strong>Date:</strong> {formatDate(todo.startDate)} - {formatDate(todo.endDate)}
                  </p>
                  <p className="text-gray-600">
                    <strong>Assigne:</strong> {capitalizeFirstLetter(todo.user.name)}
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={() => handleViewDetails(todo.id)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded transition"
                      aria-label={`View details of ${todo.title}`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-4 flex-wrap">
        {totalPages > 1 && (
          <>
            <button
              onClick={() => page > 1 && updateQueryParams({ page: page - 1 })}
              disabled={page <= 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 mb-2 sm:mb-0"
            >
              Prev
            </button>
            <button
              onClick={() => page < totalPages && updateQueryParams({ page: page + 1 })}
              disabled={page >= totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 mb-2 sm:mb-0"
            >
              Next
            </button>
          </>
        )}
        <span className="text-lg">
          Page {page} of {totalPages}
        </span>
      </div>
    </div>
  );
}
