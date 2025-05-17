'use client'

import axios from 'axios';
import { ITodo, IGetTodoListParam, ITodoList } from './type';
import { apiUrl } from '@/pages/config';

export async function fetchEvents(values: IGetTodoListParam): Promise<ITodoList> {
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
    throw new Error('Error fetching events');
  }
}

