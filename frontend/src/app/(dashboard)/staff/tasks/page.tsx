'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { userService } from '@/services/userService';
import { USER_ROLES, REQUEST_STATUS } from '@/utils/constants';
import { Request } from '@/types';
import { requestService } from '@/services/api';

export default function StaffTasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState<Request | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await userService.getStaffAssignedRequests();
        if (response.success && response.data) {
          setTasks(Array.isArray(response.data) ? response.data : []);
        } else {
          setError('Failed to load tasks');
        }
      } catch (err) {
        setError('Error loading tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleMarkComplete = async (requestId: string) => {
    setUpdatingStatus(true);
    try {
      const response = await requestService.updateCleaningRequestStatus(requestId, REQUEST_STATUS.APPROVED);
      if (response.success) {
        setTasks((prev) =>
          prev.map((task) =>
            task._id === requestId ? { ...task, status: REQUEST_STATUS.APPROVED } : task
          )
        );
        setSelectedTask(null);
      } else {
        setError('Failed to update task status');
      }
    } catch (err) {
      setError('Error updating task');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case REQUEST_STATUS.APPROVED:
        return 'bg-green-100 text-green-800';
      case REQUEST_STATUS.REJECTED:
        return 'bg-red-100 text-red-800';
      case REQUEST_STATUS.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.CLEANING_STAFF]}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Assigned Tasks</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">No tasks assigned</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task._id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">Cleaning Request</h2>
                    <p className="text-gray-600 text-sm">
                      Assigned on {new Date(task.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p>
                    <span className="font-semibold">Room:</span> {(task as any).roomNumber}
                  </p>
                  <p>
                    <span className="font-semibold">Type:</span> {(task as any).cleaningType}
                  </p>
                  <p>
                    <span className="font-semibold">Priority:</span>{' '}
                    <span className="capitalize">{(task as any).priority}</span>
                  </p>
                </div>

                <button
                  onClick={() => setSelectedTask(task)}
                  className="text-blue-600 hover:underline"
                >
                  View Details & Update Status
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Cleaning Task Details</h2>

              <div className="space-y-3 mb-6">
                <p>
                  <span className="font-semibold">Status:</span> {selectedTask.status}
                </p>
                <p>
                  <span className="font-semibold">Room:</span> {(selectedTask as any).roomNumber}
                </p>
                <p>
                  <span className="font-semibold">Type:</span> {(selectedTask as any).cleaningType}
                </p>
                <p>
                  <span className="font-semibold">Priority:</span>{' '}
                  <span className="capitalize">{(selectedTask as any).priority}</span>
                </p>
              </div>

              {selectedTask.status === REQUEST_STATUS.PENDING && (
                <button
                  onClick={() => handleMarkComplete(selectedTask._id)}
                  disabled={updatingStatus}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 mb-4"
                >
                  {updatingStatus ? 'Updating...' : 'Mark as Completed'}
                </button>
              )}

              <button
                onClick={() => setSelectedTask(null)}
                className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
