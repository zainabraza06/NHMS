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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 9;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await userService.getStaffAssignedRequests(page, limit);
        if (response.success && response.data) {
          setTasks(Array.isArray(response.data) ? response.data : []);
          setTotalPages(response.pagination?.pages || 1);
          setTotalItems(response.pagination?.total || 0);
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
  }, [page]);

  const handleMarkComplete = async (requestId: string) => {
    if (!requestId) {
      setError('Unable to update: missing request ID');
      return;
    }
    setUpdatingStatus(true);
    try {
      const response = await requestService.updateCleaningRequestStatus(requestId, REQUEST_STATUS.COMPLETED);
      if (response.success) {
        setTasks((prev) =>
          prev.map((task) =>
            getRequestId(task) === requestId ? { ...task, status: REQUEST_STATUS.COMPLETED as any } : task
          )
        );
        setSelectedTask(null);
      } else {
        const errorMsg = (response as any).message || 'Failed to update task status';
        setError(errorMsg);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating task');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case REQUEST_STATUS.APPROVED:
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case REQUEST_STATUS.COMPLETED:
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case REQUEST_STATUS.REJECTED:
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case REQUEST_STATUS.PENDING:
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return 'bg-rose-100 text-rose-700';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-700';
      case 'LOW':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.CLEANING_STAFF]}>
      <div className="page-container">
        <h1 className="section-header">My Assigned Tasks</h1>

        {error && (
          <div className="alert-error mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="stat-card text-center py-12 animate-scale-in">
            <div className="text-6xl mb-4">✨</div>
            <p className="text-gray-500 text-lg">No tasks assigned</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for new cleaning requests</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task, index) => (
              <div
                key={getRequestId(task) || `${task.requestType}-${index}`}
                className={`stat-card animate-slide-up stagger-${Math.min(index + 1, 6)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🧹</span>
                    <div>
                      <h2 className="text-lg font-bold text-aqua-800">Cleaning Request</h2>
                      <p className="text-gray-500 text-xs">
                        {new Date(((task as any).preferredDate || task.createdAt)).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(task.status)}`}>
                    {task.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between bg-aqua-50/50 rounded-lg px-3 py-2">
                    <span className="text-gray-500 text-sm">Room</span>
                    <span className="font-semibold text-gray-800">{(task as any).roomNumber}</span>
                  </div>
                  <div className="flex items-center justify-between bg-aqua-50/50 rounded-lg px-3 py-2">
                    <span className="text-gray-500 text-sm">Type</span>
                    <span className="font-semibold text-gray-800">{(task as any).cleaningType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Priority</span>
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getPriorityStyles((task as any).priority)}`}>
                      {(task as any).priority}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTask(task)}
                  className="w-full btn-secondary text-sm py-2"
                >
                  View Details & Update
                </button>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages} · {totalItems} total
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="btn-secondary px-4 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="btn-secondary px-4 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Modal */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fade-in">
            <div className="glass-card p-8 max-w-md w-full animate-scale-in">
              <div className="flex items-center mb-6">
                <span className="text-3xl mr-3">🧹</span>
                <h2 className="text-2xl font-bold text-aqua-800">Cleaning Task</h2>
              </div>

              <div className="space-y-3 mb-6">
                <InfoRow label="Status" value={selectedTask.status} highlight />
                {(selectedTask as any).preferredDate && (
                  <InfoRow label="Preferred Date" value={new Date((selectedTask as any).preferredDate).toLocaleDateString()} />
                )}
                <InfoRow label="Room" value={(selectedTask as any).roomNumber} />
                <InfoRow label="Type" value={(selectedTask as any).cleaningType} />
                <InfoRow label="Priority" value={(selectedTask as any).priority} />
                {(selectedTask as any).notes && (
                  <InfoRow label="Notes" value={(selectedTask as any).notes} />
                )}
              </div>

              {selectedTask.status === REQUEST_STATUS.APPROVED && (
                <div className="mb-4">
                  {(() => {
                    const now = new Date();
                    const preferredDate = new Date((selectedTask as any).preferredDate);
                    now.setHours(0, 0, 0, 0);
                    preferredDate.setHours(0, 0, 0, 0);
                    const isTooEarly = now < preferredDate;

                    return (
                      <>
                        <button
                          onClick={() => handleMarkComplete(getRequestId(selectedTask))}
                          disabled={updatingStatus || isTooEarly || !getRequestId(selectedTask)}
                          className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3 font-semibold text-white shadow-md
                                     transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:grayscale disabled:transform-none"
                        >
                          {updatingStatus ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Updating...
                            </span>
                          ) : (
                            '✓ Mark as Completed'
                          )}
                        </button>
                        {isTooEarly && (
                          <p className="text-rose-500 text-xs text-center mt-2 font-medium">
                            Cannot complete before scheduled date
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              <button
                onClick={() => setSelectedTask(null)}
                className="w-full btn-secondary"
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

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-2 ${highlight ? '' : 'border-b border-gray-100'}`}>
      <span className="text-gray-500 font-medium">{label}:</span>
      <span className={`font-semibold ${highlight ? 'px-3 py-1 rounded-full bg-aqua-100 text-aqua-700' : 'text-gray-800'}`}>
        {value}
      </span>
    </div>
  );
}

function getRequestId(request: Request) {
  return (request as any)._id || request.id;
}
