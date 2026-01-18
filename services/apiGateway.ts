
import { User, FilterParams, ApiResponse, WorkerTask } from '../types';
import { fetchUsers as mockFetchUsers, streamLoremText as mockStream } from './mockApi';
import { socket as mockSocket, queueTask as mockQueue } from './workerService';

/**
 * ApiGateway serves as the unified bridge between the React frontend and the backend logic.
 * It abstracts data fetching, streaming, and background task processing.
 */

export const ApiGateway = {
  // REST API: Get Paginated Users
  getUsers: async (params: FilterParams): Promise<ApiResponse<User>> => {
    console.log('[ApiGateway] GET /api/users', params);
    return await mockFetchUsers(params);
  },

  // REST API: Stream Character-by-Character Content
  getStream: (): Response => {
    console.log('[ApiGateway] GET /api/stream');
    return mockStream();
  },

  // WebSocket: Dispatch and Listen for Real-time Task Results
  tasks: {
    dispatch: (taskId: number) => {
      console.log('[ApiGateway] WS dispatch_task', taskId);
      return mockQueue(taskId);
    },
    onResult: (callback: (data: any) => void) => {
      const wrapper = (event: any) => {
        const data = JSON.parse(event.data);
        if (data.type === 'TASK_COMPLETED') {
          callback(data);
        }
      };
      mockSocket.addEventListener('message', wrapper);
      return () => mockSocket.removeEventListener('message', wrapper);
    }
  }
};
