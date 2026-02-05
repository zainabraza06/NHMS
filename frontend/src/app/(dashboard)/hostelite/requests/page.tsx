'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { requestService } from '@/services/api';
import { USER_ROLES, REQUEST_STATUS } from '@/utils/constants';
import { Request, LeaveRequest, CleaningRequest, MessOffRequest } from '@/types';

export default function HosteliteRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await requestService.getMyRequests();
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
    <ProtectedRoute allowedRoles={[USER_ROLES.HOSTELITE]}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Requests</h1>
          <Link
            href="/hostelite/requests/new"
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
          >
            New Request
          </Link>
        </div>

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
            <p className="text-gray-600 mb-4">No requests yet</p>
            <Link
              href="/hostelite/requests/new"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
            >
              Submit Your First Request
            </Link>
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

                {isLeaveRequest(request) && (
                  <div className="space-y-2 mb-4">
                    <p>
                      <span className="font-semibold">From:</span>{' '}
                      {new Date(request.startDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">To:</span>{' '}
                      {new Date(request.endDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Duration:</span> {request.duration} days
                    </p>
                    <p>
                      <span className="font-semibold">Reason:</span> {request.reason}
                    </p>
                    {request.parentContact && (
                      <p>
                        <span className="font-semibold">Parent Contact:</span> {request.parentContact}
                      </p>
                    )}
                  </div>
                )}

                {isCleaningRequest(request) && (
                  <div className="space-y-2 mb-4">
                    <p>
                      <span className="font-semibold">Room:</span> {request.roomNumber}
                    </p>
                    <p>
                      <span className="font-semibold">Floor:</span> {request.floor}
                    </p>
                    <p>
                      <span className="font-semibold">Type:</span> {request.cleaningType}
                    </p>
                    <p>
                      <span className="font-semibold">Priority:</span> {request.priority}
                    </p>
                    {request.notes && (
                      <p>
                        <span className="font-semibold">Notes:</span> {request.notes}
                      </p>
                    )}
                  </div>
                )}

                {isMessOffRequest(request) && (
                  <div className="space-y-2 mb-4">
                    <p>
                      <span className="font-semibold">From:</span>{' '}
                      {new Date(request.startDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">To:</span>{' '}
                      {new Date(request.endDate).toLocaleDateString()}
                    </p>
                    {request.reason && (
                      <p>
                        <span className="font-semibold">Reason:</span> {request.reason}
                      </p>
                    )}
                    {request.mealCount && (
                      <p>
                        <span className="font-semibold">Meal Count:</span> {request.mealCount}
                      </p>
                    )}
                    {request.refundAmount && (
                      <p>
                        <span className="font-semibold">Refund Amount:</span> Rs. {request.refundAmount}
                      </p>
                    )}
                  </div>
                )}

                <button className="text-blue-600 hover:underline">View Details</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
