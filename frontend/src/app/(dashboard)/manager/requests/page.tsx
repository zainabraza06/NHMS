'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { requestService } from '@/services/api';
import { USER_ROLES, REQUEST_STATUS } from '@/utils/constants';
import { Request, LeaveRequest, CleaningRequest, MessOffRequest } from '@/types';

export default function ManagerRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await requestService.getManagerRequests();
        if (response.success && response.data) {
          setRequests(Array.isArray(response.data) ? response.data : []);
        } else {
          setError('Failed to load requests');
        }
      } catch (err) {
        setError('Error loading requests');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (requestId: string) => {
    setActionLoading(true);
    try {
      const response = await requestService.approveRequest(requestId);
      if (response.success && response.data) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status: REQUEST_STATUS.APPROVED as any } : req
          )
        );
        setSelectedRequest(null);
      } else {
        setError('Failed to approve request');
      }
    } catch (err) {
      setError('Error approving request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (requestId: string) => {
    setActionLoading(true);
    try {
      const response = await requestService.rejectRequest(requestId);
      if (response.success && response.data) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status: REQUEST_STATUS.REJECTED as any } : req
          )
        );
        setSelectedRequest(null);
      } else {
        setError('Failed to reject request');
      }
    } catch (err) {
      setError('Error rejecting request');
    } finally {
      setActionLoading(false);
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
      case REQUEST_STATUS.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestTypeLabel = (requestType: string) => {
    switch (requestType) {
      case 'LEAVE_REQUEST':
        return 'Leave Request';
      case 'CLEANING_REQUEST':
        return 'Cleaning Request';
      case 'MESS_OFF_REQUEST':
        return 'Mess-Off Request';
      default:
        return requestType;
    }
  };

  const isLeaveRequest = (req: Request): req is LeaveRequest => req.requestType === 'LEAVE_REQUEST';
  const isCleaningRequest = (req: Request): req is CleaningRequest => req.requestType === 'CLEANING_REQUEST';
  const isMessOffRequest = (req: Request): req is MessOffRequest => req.requestType === 'MESS_OFF_REQUEST';

  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.HOSTEL_MANAGER]}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">All Requests</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">No requests found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{getRequestTypeLabel(request.requestType)}</h2>
                    <p className="text-gray-600 text-sm">
                      Submitted on {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedRequest(request)}
                  className="text-blue-600 hover:underline"
                >
                  View Details & Take Action
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">{getRequestTypeLabel(selectedRequest.requestType)} Request</h2>

              <div className="space-y-3 mb-6">
                <p>
                  <span className="font-semibold">Status:</span> {selectedRequest.status}
                </p>
                <p>
                  <span className="font-semibold">Submitted:</span>{' '}
                  {new Date(selectedRequest.createdAt).toLocaleDateString()}
                </p>

                {isLeaveRequest(selectedRequest) && (
                  <>
                    <p>
                      <span className="font-semibold">From:</span>{' '}
                      {new Date(selectedRequest.startDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">To:</span>{' '}
                      {new Date(selectedRequest.endDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Duration:</span> {selectedRequest.duration} days
                    </p>
                    <p>
                      <span className="font-semibold">Reason:</span> {selectedRequest.reason}
                    </p>
                    {selectedRequest.parentContact && (
                      <p>
                        <span className="font-semibold">Parent Contact:</span> {selectedRequest.parentContact}
                      </p>
                    )}
                  </>
                )}

                {isCleaningRequest(selectedRequest) && (
                  <>
                    <p>
                      <span className="font-semibold">Room:</span> {selectedRequest.roomNumber}
                    </p>
                    <p>
                      <span className="font-semibold">Floor:</span> {selectedRequest.floor}
                    </p>
                    <p>
                      <span className="font-semibold">Type:</span> {selectedRequest.cleaningType}
                    </p>
                    <p>
                      <span className="font-semibold">Priority:</span> {selectedRequest.priority}
                    </p>
                    {selectedRequest.notes && (
                      <p>
                        <span className="font-semibold">Notes:</span> {selectedRequest.notes}
                      </p>
                    )}
                  </>
                )}

                {isMessOffRequest(selectedRequest) && (
                  <>
                    <p>
                      <span className="font-semibold">From:</span>{' '}
                      {new Date(selectedRequest.startDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">To:</span>{' '}
                      {new Date(selectedRequest.endDate).toLocaleDateString()}
                    </p>
                    {selectedRequest.reason && (
                      <p>
                        <span className="font-semibold">Reason:</span> {selectedRequest.reason}
                      </p>
                    )}
                    {selectedRequest.mealCount && (
                      <p>
                        <span className="font-semibold">Meal Count:</span> {selectedRequest.mealCount}
                      </p>
                    )}
                    {selectedRequest.refundAmount && (
                      <p>
                        <span className="font-semibold">Refund Amount:</span> Rs. {selectedRequest.refundAmount}
                      </p>
                    )}
                  </>
                )}
              </div>

              {selectedRequest.status === REQUEST_STATUS.PENDING && (
                <div className="flex space-x-4 mb-4">
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedRequest.id)}
                    disabled={actionLoading}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                  >
                    Reject
                  </button>
                </div>
              )}

              <button
                onClick={() => setSelectedRequest(null)}
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
