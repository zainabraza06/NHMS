'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { requestService } from '@/services/api';
import { USER_ROLES, REQUEST_STATUS } from '@/utils/constants';
import { Request, LeaveRequest, CleaningRequest, MessOffRequest } from '@/types';

export default function HosteliteRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const response = await requestService.getMyRequests(page, limit);
        if (response.success && response.data) {
          setRequests(Array.isArray(response.data) ? response.data : []);
          setTotalPages(response.pagination?.pages || 1);
          setTotalItems(response.pagination?.total || 0);
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
  }, [page]);

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

  const getRequestTypeLabel = (requestType: string) => {
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
    <ProtectedRoute allowedRoles={[USER_ROLES.HOSTELITE]}>
      <div className="page-container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="section-header mb-0">My Requests</h1>
          <Link
            href="/hostelite/requests/new"
            className="btn-primary inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Request
          </Link>
        </div>

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
            <p className="text-gray-500 mb-6 text-lg">No requests yet</p>
            <Link
              href="/hostelite/requests/new"
              className="btn-primary inline-block"
            >
              Submit Your First Request
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request, index) => {
              const typeInfo = getRequestTypeLabel(request.requestType);
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
                    View Details
                    <svg className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              );
            })}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
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
          </div>
        )}
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-card p-8 max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center mb-6">
              <span className="text-3xl mr-3">{getRequestTypeLabel(selectedRequest.requestType).icon}</span>
              <h2 className="text-2xl font-bold text-aqua-800">
                {getRequestTypeLabel(selectedRequest.requestType).label}
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

            <button
              onClick={() => setSelectedRequest(null)}
              className="w-full btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      )}
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
