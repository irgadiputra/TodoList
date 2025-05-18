'use client'

import axios from 'axios';
import { ITodo, IGetTodoListParam, ITodoList, TodoStatus } from './type';
import { apiUrl } from '@/pages/config';

export async function fetchTodos(values: IGetTodoListParam): Promise<ITodoList> {
  try {
    const response = await axios.get<{ message: string; data: ITodoList }>(
      `${apiUrl}/todo`,
      {
        params: values,
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (err) {
    throw new Error('Error fetching todos');
  }
}

export async function updateTodoStatus(id: number, values: TodoStatus): Promise<ITodoList> {
  try {
    const response = await axios.patch<{ message: string; data: ITodoList }>(
      `${apiUrl}/todo`, { id: id, status: values },
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (err) {
    throw new Error('Error update todo');
  }
}

