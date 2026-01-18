
import { WorkerTask } from '../types';

/**
 * MOCK WEBSOCKET IMPLEMENTATION
 * Mimics a real WebSocket for the application context.
 */
class MockWebSocket extends EventTarget {
  send(data: string) {
    console.log('[MockSocket] Data received from client:', data);
  }
  
  // Method to simulate a message arriving from the "server"
  emitMessage(data: any) {
    const event = new MessageEvent('message', { data: JSON.stringify(data) });
    this.dispatchEvent(event);
  }
}

export const socket = new MockWebSocket();

/**
 * WEB WORKER SCRIPT
 * This runs in a separate thread.
 */
const workerScript = `
  self.onmessage = function(e) {
    const { taskId } = e.data;
    // Simulate complex processing time
    setTimeout(() => {
      const results = [
        "Analysis Complete", "Optimization Done", "Data Synchronized", 
        "Pattern Recognized", "Validation Successful", "Metric Computed"
      ];
      const result = results[Math.floor(Math.random() * results.length)];
      
      // Post back to main thread
      self.postMessage({ taskId, result });
    }, 2000);
  };
`;

const blob = new Blob([workerScript], { type: 'application/javascript' });
const workerUrl = URL.createObjectURL(blob);
const worker = new Worker(workerUrl);

// Bridge WebWorker back to MockWebSocket
worker.onmessage = (e) => {
  const { taskId, result } = e.data;
  socket.emitMessage({ type: 'TASK_COMPLETED', taskId, result });
};

/**
 * API ENDPOINT MOCK
 * Caches request into a queue and responds with "pending"
 */
export const queueTask = (taskId: number): { status: string } => {
  // 1. Initial response: "pending"
  console.log(`[API] Task ${taskId} queued. Status: pending`);
  
  // 2. Process in WebWorker
  worker.postMessage({ taskId });
  
  return { status: 'pending' };
};
