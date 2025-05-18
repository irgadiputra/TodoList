import { TodoStatus } from "@/pages/Hero/components/type";

export interface ITodoCreateFormValues {
  title?: string,
  description?: string,
  userId: number,
  startDate: string,
  endDate: string,
}