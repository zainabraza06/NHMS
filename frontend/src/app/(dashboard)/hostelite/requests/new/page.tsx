'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { requestService } from '@/services/api';
import { USER_ROLES } from '@/utils/constants';
import { LeaveRequestForm, CleaningRequestForm, MessOffRequestForm } from '@/types';

export default function NewRequestPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [requestType, setRequestType] = useState('leave');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [leaveForm, setLeaveForm] = useState<LeaveRequestForm>({
    startDate: '',
    endDate: '',
    reason: '',
    parentContact: '',
  });

  const [cleaningForm, setCleaningForm] = useState<CleaningRequestForm>({
    preferredDate: '',
    roomNumber: '',
    floor: '',
    cleaningType: 'ROUTINE',
    priority: 'MEDIUM',
  });

  const [messOffForm, setMessOffForm] = useState<MessOffRequestForm>({
    startDate: '',
    endDate: '',
    reason: '',
  });

  const minAdvanceDate = getMinDate(1);
  const leaveValidation = validateLeaveDates(leaveForm.startDate, leaveForm.endDate);
  const cleaningValidation = validateCleaningDate(cleaningForm.preferredDate);

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const start = new Date(leaveForm.startDate);
    const end = new Date(leaveForm.endDate);
    if (!leaveValidation.isValid) {
      setIsLoading(false);
      setError(leaveValidation.message);
      return;
    }

    try {
      const response = await requestService.submitLeaveRequest(leaveForm);
      if (response.success) {
        setSuccess('Leave request submitted successfully');
        setTimeout(() => {
          router.push('/hostelite/requests');
        }, 1500);
      } else {
        setError(response.message || response.error || 'Failed to submit request');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError('Error submitting request');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleaningSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const preferred = new Date(cleaningForm.preferredDate);
    if (!cleaningValidation.isValid) {
      setIsLoading(false);
      setError(cleaningValidation.message);
      return;
    }

    try {
      const response = await requestService.submitCleaningRequest(cleaningForm);
      if (response.success) {
        setSuccess('Cleaning request submitted successfully');
        setTimeout(() => {
          router.push('/hostelite/requests');
        }, 1500);
      } else {
        setError(response.message || response.error || 'Failed to submit request');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError('Error submitting request');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessOffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await requestService.submitMessOffRequest(messOffForm);
      if (response.success) {
        setSuccess('Mess-off request submitted successfully');
        setTimeout(() => {
          router.push('/hostelite/requests');
        }, 1500);
      } else {
        setError(response.message || response.error || 'Failed to submit request');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError('Error submitting request');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  const requestTypes = [
    { value: 'leave', label: 'Leave Request', icon: '🏠', description: 'Request time off from hostel' },
    { value: 'cleaning', label: 'Cleaning Request', icon: '🧹', description: 'Request room cleaning service' },
    { value: 'messOff', label: 'Mess-Off Request', icon: '🍽️', description: 'Opt out of mess meals' },
  ];

  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.HOSTELITE]}>
      <div className="page-container max-w-2xl">
        <h1 className="section-header">Submit New Request</h1>

        {error && (
          <div className="alert-error mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="alert-success mb-6">
            {success}
          </div>
        )}

        <div className="stat-card animate-scale-in">
          {/* Request Type Selector */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-4 text-gray-700">Select Request Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {requestTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setRequestType(type.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-300 
                    ${requestType === type.value
                      ? 'border-aqua-500 bg-aqua-50 shadow-aqua'
                      : 'border-gray-200 hover:border-aqua-300 hover:bg-aqua-50/50'
                    }`}
                >
                  <span className="text-2xl block mb-2">{type.icon}</span>
                  <span className={`font-semibold block ${requestType === type.value ? 'text-aqua-700' : 'text-gray-700'}`}>
                    {type.label}
                  </span>
                  <span className="text-xs text-gray-500">{type.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Leave Request Form */}
          {requestType === 'leave' && (
            <form onSubmit={handleLeaveSubmit} className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-semibold mb-2 text-gray-700">
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    required
                    min={minAdvanceDate}
                    className="aqua-input"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-semibold mb-2 text-gray-700">
                    End Date
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    required
                    min={leaveForm.startDate || minAdvanceDate}
                    className="aqua-input"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Leave must be scheduled at least 1 day in advance. End date must be on or after the start date.
              </p>

              {!leaveValidation.isValid && (
                <p className="text-xs text-rose-600">
                  {leaveValidation.message}
                </p>
              )}

              <div>
                <label htmlFor="reason" className="block text-sm font-semibold mb-2 text-gray-700">
                  Reason
                </label>
                <textarea
                  id="reason"
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  required
                  rows={4}
                  className="aqua-input resize-none"
                  placeholder="Please provide a reason for your leave..."
                />
              </div>

              <div>
                <label htmlFor="parentContact" className="block text-sm font-semibold mb-2 text-gray-700">
                  Parent Contact Number
                </label>
                <input
                  id="parentContact"
                  type="tel"
                  value={leaveForm.parentContact}
                  onChange={(e) => setLeaveForm({ ...leaveForm, parentContact: e.target.value })}
                  required
                  className="aqua-input"
                  placeholder="+92 XXX XXXXXXX"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !leaveValidation.isValid}
                className="w-full btn-primary py-3 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? <LoadingSpinner text="Submitting..." /> : 'Submit Leave Request'}
              </button>
            </form>
          )}

          {/* Cleaning Request Form */}
          {requestType === 'cleaning' && (
            <form onSubmit={handleCleaningSubmit} className="space-y-5 animate-fade-in">
              <div>
                <label htmlFor="preferredDate" className="block text-sm font-semibold mb-2 text-gray-700">
                  Preferred Date
                </label>
                <input
                  id="preferredDate"
                  type="date"
                  value={cleaningForm.preferredDate}
                  onChange={(e) => setCleaningForm({ ...cleaningForm, preferredDate: e.target.value })}
                  required
                  min={minAdvanceDate}
                  className="aqua-input"
                />
              </div>

              <p className="text-xs text-gray-500">
                Cleaning must be scheduled at least 1 day in advance.
              </p>

              {!cleaningValidation.isValid && (
                <p className="text-xs text-rose-600">
                  {cleaningValidation.message}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="roomNumber" className="block text-sm font-semibold mb-2 text-gray-700">
                    Room Number
                  </label>
                  <input
                    id="roomNumber"
                    type="text"
                    value={cleaningForm.roomNumber}
                    onChange={(e) => setCleaningForm({ ...cleaningForm, roomNumber: e.target.value })}
                    required
                    className="aqua-input"
                    placeholder="e.g., A-101"
                  />
                </div>
                <div>
                  <label htmlFor="floor" className="block text-sm font-semibold mb-2 text-gray-700">
                    Floor Number
                  </label>
                  <input
                    id="floor"
                    type="text"
                    value={cleaningForm.floor}
                    onChange={(e) => setCleaningForm({ ...cleaningForm, floor: e.target.value })}
                    required
                    className="aqua-input"
                    placeholder="e.g., 1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cleaningType" className="block text-sm font-semibold mb-2 text-gray-700">
                    Cleaning Type
                  </label>
                  <select
                    id="cleaningType"
                    value={cleaningForm.cleaningType}
                    onChange={(e) => setCleaningForm({ ...cleaningForm, cleaningType: e.target.value as any })}
                    className="aqua-input"
                  >
                    <option value="ROUTINE">Routine</option>
                    <option value="DEEP_CLEANING">Deep Cleaning</option>
                    <option value="EMERGENCY">Emergency</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="priority" className="block text-sm font-semibold mb-2 text-gray-700">
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={cleaningForm.priority}
                    onChange={(e) => setCleaningForm({ ...cleaningForm, priority: e.target.value as any })}
                    className="aqua-input"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !cleaningValidation.isValid}
                className="w-full btn-primary py-3 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? <LoadingSpinner text="Submitting..." /> : 'Submit Cleaning Request'}
              </button>
            </form>
          )}

          {/* Mess-Off Request Form */}
          {requestType === 'messOff' && (
            <form onSubmit={handleMessOffSubmit} className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-semibold mb-2 text-gray-700">
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={messOffForm.startDate}
                    onChange={(e) => setMessOffForm({ ...messOffForm, startDate: e.target.value })}
                    required
                    className="aqua-input"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-semibold mb-2 text-gray-700">
                    End Date
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    value={messOffForm.endDate}
                    onChange={(e) => setMessOffForm({ ...messOffForm, endDate: e.target.value })}
                    required
                    className="aqua-input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-semibold mb-2 text-gray-700">
                  Reason
                </label>
                <textarea
                  id="reason"
                  value={messOffForm.reason}
                  onChange={(e) => setMessOffForm({ ...messOffForm, reason: e.target.value })}
                  required
                  rows={4}
                  className="aqua-input resize-none"
                  placeholder="Please provide a reason for mess-off..."
                />
              </div>

              <button type="submit" disabled={isLoading} className="w-full btn-primary py-3 text-lg">
                {isLoading ? <LoadingSpinner text="Submitting..." /> : 'Submit Mess-Off Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

function LoadingSpinner({ text }: { text: string }) {
  return (
    <span className="flex items-center justify-center">
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {text}
    </span>
  );
}

function getMinDate(daysAhead: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().split('T')[0];
}

function validateLeaveDates(startDate: string, endDate: string) {
  if (!startDate || !endDate) {
    return { isValid: false, message: 'Please provide start and end dates' };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { isValid: false, message: 'Please provide valid start and end dates' };
  }

  const oneDayFromNow = new Date();
  oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);
  oneDayFromNow.setHours(0, 0, 0, 0);

  if (start < oneDayFromNow) {
    return { isValid: false, message: 'Leave requests must be applied at least 1 day in advance' };
  }

  if (end < start) {
    return { isValid: false, message: 'End date must be on or after the start date' };
  }

  return { isValid: true, message: '' };
}

function validateCleaningDate(preferredDate: string) {
  if (!preferredDate) {
    return { isValid: false, message: 'Please select a preferred date' };
  }

  const preferred = new Date(preferredDate);
  if (Number.isNaN(preferred.getTime())) {
    return { isValid: false, message: 'Please select a valid preferred date' };
  }

  const oneDayFromNow = new Date();
  oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);
  oneDayFromNow.setHours(0, 0, 0, 0);

  if (preferred < oneDayFromNow) {
    return { isValid: false, message: 'Cleaning requests must be scheduled at least 1 day in advance' };
  }

  return { isValid: true, message: '' };
}
