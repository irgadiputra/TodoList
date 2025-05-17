'use client';

import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { fetchEvents, updateTodoStatus } from './components/event';
import { IGetTodoListParam, ITodo, ITodoList, TodoStatus } from './components/type';
import { apiUrl } from '../config';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const statusOptions: TodoStatus[] = [
  TodoStatus.OPEN,
  TodoStatus.PENDING,
  TodoStatus.IN_PROGRESS,
  TodoStatus.COMPLETED,
  TodoStatus.CANCELLED
];

const EventCard = React.memo(
  ({
    event,
    onViewDetails,
    onStatusChange,
    selected,
    onSelect,
  }: {
    event: ITodo;
    onViewDetails: (id: number) => void;
    onStatusChange: (id: number, status: TodoStatus) => void;
    selected: boolean;
    onSelect: (id: number) => void;
  }) => {
    return (
      <div className="flex flex-col rounded-xl shadow-md overflow-hidden bg-white transition-transform transform hover:-translate-y-1 hover:shadow-lg">
        <div className="p-4 flex flex-col justify-between flex-grow">
          <div className="flex justify-between items-start mb-2">
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onSelect(event.id)}
              className="mr-2"
              title="Select this todo"
            />
            <select
              value={event.status}
              onChange={(e) => onStatusChange(event.id, e.target.value as TodoStatus)}
              className="text-sm border rounded px-2 py-1"
              title="Change status"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>

          {event.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>
          )}

          <div className="mt-2 text-sm text-gray-700">
            👤 <strong>Assigned to:</strong> {event.user?.name || event.userId}
          </div>

          <div className="mt-4">
            <button
              onClick={() => onViewDetails(event.id)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded transition"
              aria-label={`View details of ${event.title}`}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  }
);

const Hero = () => {
  const auth = useAppSelector((state) => state.auth);
  const [events, setEvents] = useState<ITodoList>();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);

  const router = useRouter();

  const initialValue: IGetTodoListParam = {
    limit: 100,
    page: 1,
  };

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvents(initialValue);
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleViewDetails = (id: number) => {
    router.push(`/todo/${id}`);
  };

  const handleStatusChange = async (id: number, status: TodoStatus) => {
    await updateTodoStatus(id, status);
    loadEvents();
  };

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBatchStatusChange = async (status: TodoStatus) => {
    if (!status) return;
    setIsBatchUpdating(true);
    try {
      await Promise.all(selectedIds.map((id) => updateTodoStatus(id, status)));
      loadEvents();
      setSelectedIds([]);
    } catch (error) {
      console.error('Batch update failed:', error);
      alert('Failed to update todos.');
    } finally {
      setIsBatchUpdating(false);
    }
  };

  const groupedEvents = statusOptions.reduce((acc, status) => {
    acc[status] = events?.data.filter((e) => e.status === status) || [];
    return acc;
  }, {} as Record<TodoStatus, ITodo[]>);

  return (
    <div className="p-6 text-black bg-gray-50 min-h-screen">
      {auth.isLogin ? (
        <h1 className="text-2xl font-bold mb-4">Welcome, {auth.user?.name}!</h1>
      ) : (
        <h1 className="text-xl font-semibold">Please log in</h1>
      )}

      {selectedIds.length > 0 && (
        <div className="flex items-center mb-4 space-x-2">
          <label htmlFor="batchStatus">Batch Status:</label>
          <select
            id="batchStatus"
            onChange={(e) => handleBatchStatusChange(e.target.value as TodoStatus)}
            disabled={selectedIds.length === 0 || isBatchUpdating}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="">-- Select --</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {isBatchUpdating && <span className="text-sm text-blue-500">Updating...</span>}
        </div>
      )}

      {loading ? (
        <p>Loading events...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="space-y-6">
          {statusOptions.map((status) => (
            <div key={status}>
              <h2 className="text-xl font-semibold mb-2">{status}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedEvents[status].map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onViewDetails={handleViewDetails}
                    onStatusChange={handleStatusChange}
                    selected={selectedIds.includes(event.id)}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hero;
