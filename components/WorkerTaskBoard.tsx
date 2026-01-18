
import React, { useState, useEffect } from 'react';
import { WorkerTask, TaskStatus } from '../types';
import { ApiGateway } from '../services/apiGateway';

interface WorkerTaskBoardProps {
  onClose: () => void;
}

const WorkerTaskBoard: React.FC<WorkerTaskBoardProps> = ({ onClose }) => {
  const [tasks, setTasks] = useState<WorkerTask[]>(
    Array.from({ length: 20 }, (_, i) => ({ id: i + 1, status: 'idle' }))
  );

  useEffect(() => {
    const unsub = ApiGateway.tasks.onResult((data) => {
      setTasks(prev => prev.map(task => 
        task.id === data.taskId 
          ? { ...task, status: 'completed', result: data.result } 
          : task
      ));
    });
    return () => unsub();
  }, []);

  const runAllTasks = () => {
    setTasks(prev => prev.map(t => ({ ...t, status: 'pending', result: undefined })));
    tasks.forEach(task => {
      ApiGateway.tasks.dispatch(task.id);
    });
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        <div className="px-8 py-6 bg-indigo-600 flex items-center justify-between text-white">
          <div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              Node.js WebSocket Board
            </h2>
            <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mt-1 opacity-80">
              Interactive Socket.io Interface
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-8 py-4 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
          <button 
            onClick={runAllTasks}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all"
          >
            Dispatch to Backend
          </button>
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            20 Parallel Streams Active
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className={`p-5 rounded-2xl border bg-white transition-all duration-300 ${
                  task.status === 'pending' ? 'ring-2 ring-yellow-400' : 
                  task.status === 'completed' ? 'border-green-200' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-indigo-400 tracking-widest">TASK #{task.id}</span>
                  <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getStatusColor(task.status)}`}>
                    {task.status}
                  </div>
                </div>
                <div className="min-h-[40px] flex items-center">
                  {task.status === 'completed' ? (
                    <p className="text-sm font-bold text-gray-800">{task.result}</p>
                  ) : task.status === 'pending' ? (
                    <div className="w-full h-1.5 bg-yellow-50 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 animate-pulse"></div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-300">Ready for Node dispatch</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerTaskBoard;
