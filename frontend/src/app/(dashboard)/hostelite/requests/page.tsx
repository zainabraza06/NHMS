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

                  {isLeaveRequest(request) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                      <InfoPill label="From" value={new Date(request.startDate).toLocaleDateString()} />
                      <InfoPill label="To" value={new Date(request.endDate).toLocaleDateString()} />
                      <InfoPill label="Duration" value={`${request.duration} days`} />
                      <InfoPill label="Reason" value={request.reason} />
                      {request.parentContact && (
                        <InfoPill label="Parent Contact" value={request.parentContact} />
                      )}
                    </div>
                  )}

                  {isCleaningRequest(request) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                      {request.preferredDate && (
                        <InfoPill label="Preferred Date" value={new Date(request.preferredDate).toLocaleDateString()} />
                      )}
                      <InfoPill label="Room" value={request.roomNumber} />
                      <InfoPill label="Floor" value={request.floor} />
                      <InfoPill label="Type" value={request.cleaningType} />
                      <InfoPill label="Priority" value={request.priority} />
                      {request.notes && <InfoPill label="Notes" value={request.notes} />}
                    </div>
                  )}

                  {isMessOffRequest(request) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                      <InfoPill label="From" value={new Date(request.startDate).toLocaleDateString()} />
                      <InfoPill label="To" value={new Date(request.endDate).toLocaleDateString()} />
                      {request.reason && <InfoPill label="Reason" value={request.reason} />}
                      {request.mealCount && <InfoPill label="Meal Count" value={String(request.mealCount)} />}
                      {request.refundAmount && <InfoPill label="Refund" value={`Rs. ${request.refundAmount}`} />}
                    </div>
                  )}

                  <button className="aqua-link inline-flex items-center group">
                    View Details
                    <svg className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-aqua-50/50 rounded-lg px-3 py-2">
      <span className="text-gray-500 text-xs font-medium">{label}:</span>
      <span className="ml-1 text-gray-800 font-medium">{value}</span>
    </div>
  );
}
