
export interface User {
  id: string;
  avatar: string;
  first_name: string;
  last_name: string;
  age: number;
  nationality: string;
  hobbies: string[];
}

export interface FilterParams {
  search: string;
  nationality: string;
  hobby: string;
  minAge: number;
  maxAge: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type TaskStatus = 'idle' | 'pending' | 'completed';

export interface WorkerTask {
  id: number;
  status: TaskStatus;
  result?: string;
}
