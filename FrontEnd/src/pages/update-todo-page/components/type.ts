import { TodoStatus } from "@/pages/Hero/components/type";

export interface TodoUpdateFormValues {
  id: number;
  title?: string,
  description?: string,
  status: TodoStatus,
  userId: number,
  startDate: string,
  endDate: string,
}

