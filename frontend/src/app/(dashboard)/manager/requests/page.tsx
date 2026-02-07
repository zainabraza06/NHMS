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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case REQUEST_STATUS.APPROVED:
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case REQUEST_STATUS.REJECTED:
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case REQUEST_STATUS.PENDING:
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case REQUEST_STATUS.CANCELLED:
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getRequestTypeInfo = (requestType: string) => {
    switch (requestType) {
      case 'LEAVE_REQUEST':
        return { label: 'Leave Request', icon: '🏠' };
      case 'CLEANING_REQUEST':
        return { label: 'Cleaning Request', icon: '🧹' };
      case 'MESS_OFF_REQUEST':
        return { label: 'Mess-Off Request', icon: '🍽️' };
      default:
        return { label: requestType, icon: '📋' };
    }
  };

  const isLeaveRequest = (req: Request): req is LeaveRequest => req.requestType === 'LEAVE_REQUEST';
  const isCleaningRequest = (req: Request): req is CleaningRequest => req.requestType === 'CLEANING_REQUEST';
  const isMessOffRequest = (req: Request): req is MessOffRequest => req.requestType === 'MESS_OFF_REQUEST';

  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.HOSTEL_MANAGER]}>
      <div className="page-container">
        <h1 className="section-header">All Requests</h1>

        {error && (
          <div className="alert-error mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="stat-card text-center py-12 animate-scale-in">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-lg">No requests found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request, index) => {
              const typeInfo = getRequestTypeInfo(request.requestType);
              return (
                <div
                  key={request.id}
                  className={`stat-card animate-slide-up stagger-${Math.min(index + 1, 6)}`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{typeInfo.icon}</span>
                      <div>
                        <h2 className="text-xl font-bold text-aqua-800">{typeInfo.label}</h2>
                        <p className="text-gray-500 text-sm">
                          Submitted on {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusStyles(request.status)}`}>
                      {request.status}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="aqua-link inline-flex items-center group"
                  >
                    View Details & Take Action
                    <svg className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="glass-card p-8 max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
              <div className="flex items-center mb-6">
                <span className="text-3xl mr-3">{getRequestTypeInfo(selectedRequest.requestType).icon}</span>
                <h2 className="text-2xl font-bold text-aqua-800">
                  {getRequestTypeInfo(selectedRequest.requestType).label}
                </h2>
              </div>

              <div className="space-y-3 mb-6">
                <InfoRow label="Status" value={selectedRequest.status} highlight />
                <InfoRow label="Submitted" value={new Date(selectedRequest.createdAt).toLocaleDateString()} />

                {isLeaveRequest(selectedRequest) && (
                  <>
                    <InfoRow label="From" value={new Date(selectedRequest.startDate).toLocaleDateString()} />
                    <InfoRow label="To" value={new Date(selectedRequest.endDate).toLocaleDateString()} />
                    <InfoRow label="Duration" value={`${selectedRequest.duration} days`} />
                    <InfoRow label="Reason" value={selectedRequest.reason} />
                    {selectedRequest.parentContact && (
                      <InfoRow label="Parent Contact" value={selectedRequest.parentContact} />
                    )}
                  </>
                )}

                {isCleaningRequest(selectedRequest) && (
                  <>
                    {selectedRequest.preferredDate && (
                      <InfoRow label="Preferred Date" value={new Date(selectedRequest.preferredDate).toLocaleDateString()} />
                    )}
                    <InfoRow label="Room" value={selectedRequest.roomNumber} />
                    <InfoRow label="Floor" value={selectedRequest.floor} />
                    <InfoRow label="Type" value={selectedRequest.cleaningType} />
                    <InfoRow label="Priority" value={selectedRequest.priority} />
                    {selectedRequest.notes && <InfoRow label="Notes" value={selectedRequest.notes} />}
                  </>
                )}

                {isMessOffRequest(selectedRequest) && (
                  <>
                    <InfoRow label="From" value={new Date(selectedRequest.startDate).toLocaleDateString()} />
                    <InfoRow label="To" value={new Date(selectedRequest.endDate).toLocaleDateString()} />
                    {selectedRequest.reason && <InfoRow label="Reason" value={selectedRequest.reason} />}
                    {selectedRequest.mealCount && <InfoRow label="Meal Count" value={String(selectedRequest.mealCount)} />}
                    {selectedRequest.refundAmount && <InfoRow label="Refund" value={`Rs. ${selectedRequest.refundAmount}`} />}
                  </>
                )}
              </div>

              {selectedRequest.status === REQUEST_STATUS.PENDING && (
                <div className="flex space-x-4 mb-4">
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    disabled={actionLoading}
                    className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3 font-semibold text-white shadow-md
                               transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedRequest.id)}
                    disabled={actionLoading}
                    className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 py-3 font-semibold text-white shadow-md
                               transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  >
                    ✗ Reject
                  </button>
                </div>
              )}

              <button
                onClick={() => setSelectedRequest(null)}
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
