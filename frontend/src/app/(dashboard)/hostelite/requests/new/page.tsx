'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { requestService } from '@/services/api';
import { USER_ROLES } from '@/utils/constants';

export default function NewRequestPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [requestType, setRequestType] = useState('leave');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [leaveForm, setLeaveForm] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    parentContact: '',
  });

  const [cleaningForm, setCleaningForm] = useState({
    roomNumber: '',
    cleaningType: 'general',
    priority: 'medium',
  });

  const [messOffForm, setMessOffForm] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await requestService.submitLeaveRequest(leaveForm);
      if (response.success) {
        setSuccess('Leave request submitted successfully');
        setTimeout(() => {
          router.push('/hostelite/requests');
        }, 1500);
      } else {
        setError(response.error || 'Failed to submit request');
      }
    } catch (err) {
      setError('Error submitting request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleaningSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await requestService.submitCleaningRequest(cleaningForm);
      if (response.success) {
        setSuccess('Cleaning request submitted successfully');
        setTimeout(() => {
          router.push('/hostelite/requests');
        }, 1500);
      } else {
        setError(response.error || 'Failed to submit request');
      }
    } catch (err) {
      setError('Error submitting request');
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
        setError(response.error || 'Failed to submit request');
      }
    } catch (err) {
      setError('Error submitting request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.HOSTELITE]}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Submit New Request</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">Request Type</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="leave"
                  checked={requestType === 'leave'}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="mr-2"
                />
                Leave Request
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="cleaning"
                  checked={requestType === 'cleaning'}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="mr-2"
                />
                Cleaning Request
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="messOff"
                  checked={requestType === 'messOff'}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="mr-2"
                />
                Mess-Off Request
              </label>
            </div>
          </div>

          {requestType === 'leave' && (
            <form onSubmit={handleLeaveSubmit} className="space-y-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium mb-1">
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={leaveForm.startDate}
                  onChange={(e) =>
                    setLeaveForm({ ...leaveForm, startDate: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={leaveForm.endDate}
                  onChange={(e) =>
                    setLeaveForm({ ...leaveForm, endDate: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium mb-1">
                  Reason
                </label>
                <textarea
                  id="reason"
                  value={leaveForm.reason}
                  onChange={(e) =>
                    setLeaveForm({ ...leaveForm, reason: e.target.value })
                  }
                  required
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="parentContact" className="block text-sm font-medium mb-1">
                  Parent Contact Number
                </label>
                <input
                  id="parentContact"
                  type="tel"
                  value={leaveForm.parentContact}
                  onChange={(e) =>
                    setLeaveForm({ ...leaveForm, parentContact: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-primary-dark disabled:bg-gray-400"
              >
                {isLoading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          )}

          {requestType === 'cleaning' && (
            <form onSubmit={handleCleaningSubmit} className="space-y-4">
              <div>
                <label htmlFor="roomNumber" className="block text-sm font-medium mb-1">
                  Room Number
                </label>
                <input
                  id="roomNumber"
                  type="text"
                  value={cleaningForm.roomNumber}
                  onChange={(e) =>
                    setCleaningForm({ ...cleaningForm, roomNumber: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="cleaningType" className="block text-sm font-medium mb-1">
                  Cleaning Type
                </label>
                <select
                  id="cleaningType"
                  value={cleaningForm.cleaningType}
                  onChange={(e) =>
                    setCleaningForm({ ...cleaningForm, cleaningType: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="general">General</option>
                  <option value="deep">Deep Cleaning</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  value={cleaningForm.priority}
                  onChange={(e) =>
                    setCleaningForm({ ...cleaningForm, priority: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-primary-dark disabled:bg-gray-400"
              >
                {isLoading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          )}

          {requestType === 'messOff' && (
            <form onSubmit={handleMessOffSubmit} className="space-y-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium mb-1">
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={messOffForm.startDate}
                  onChange={(e) =>
                    setMessOffForm({ ...messOffForm, startDate: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={messOffForm.endDate}
                  onChange={(e) =>
                    setMessOffForm({ ...messOffForm, endDate: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium mb-1">
                  Reason
                </label>
                <textarea
                  id="reason"
                  value={messOffForm.reason}
                  onChange={(e) =>
                    setMessOffForm({ ...messOffForm, reason: e.target.value })
                  }
                  required
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-primary-dark disabled:bg-gray-400"
              >
                {isLoading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
