import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';
import Hostel from '../models/Hostel.js';
import Hostelite from '../models/Hostelite.js';
import CleaningStaff from '../models/CleaningStaff.js';
import HostelManager from '../models/HostelManager.js';

dotenv.config();

const DEFAULT_PASSWORD = 'ChangeMe123!';

const hostels = [
  {
    name: 'Quaid Hostel',
    hostelCode: 'QH-01',
    location: 'Campus Block A',
    totalRooms: 120,
    totalFloors: 4,
    facilities: ['WiFi', 'Gym', 'Mess']
  },
  {
    name: 'Iqbal Hostel',
    hostelCode: 'IH-02',
    location: 'Campus Block B',
    totalRooms: 140,
    totalFloors: 5,
    facilities: ['WiFi', 'Laundry', 'Mess']
  },
  {
    name: 'Khayyam Hostel',
    hostelCode: 'KH-03',
    location: 'Campus Block C',
    totalRooms: 100,
    totalFloors: 3,
    facilities: ['WiFi', 'Study Room', 'Mess']
  }
];

const managerSeed = [
  {
    email: 'manager1@nhms.edu.pk',
    firstName: 'Ayesha',
    lastName: 'Khan',
    phoneNumber: '0300-1111111',
    managerId: 'MGR-1001',
    hostelCode: 'QH-01'
  },
  {
    email: 'manager2@nhms.edu.pk',
    firstName: 'Bilal',
    lastName: 'Ahmed',
    phoneNumber: '0300-2222222',
    managerId: 'MGR-1002',
    hostelCode: 'IH-02'
  }
];

const staffSeed = [
  {
    email: 'staff1@nhms.edu.pk',
    firstName: 'Sana',
    lastName: 'Iqbal',
    phoneNumber: '0300-3000001',
    staffId: 'STF-2001',
    hostelCode: 'QH-01',
    assignedFloors: ['1', '2']
  },
  {
    email: 'staff2@nhms.edu.pk',
    firstName: 'Usman',
    lastName: 'Ali',
    phoneNumber: '0300-3000002',
    staffId: 'STF-2002',
    hostelCode: 'QH-01',
    assignedFloors: ['3', '4']
  },
  {
    email: 'staff3@nhms.edu.pk',
    firstName: 'Hira',
    lastName: 'Nadeem',
    phoneNumber: '0300-3000003',
    staffId: 'STF-2003',
    hostelCode: 'IH-02',
    assignedFloors: ['1', '2', '3']
  },
  {
    email: 'staff4@nhms.edu.pk',
    firstName: 'Zain',
    lastName: 'Raza',
    phoneNumber: '0300-3000004',
    staffId: 'STF-2004',
    hostelCode: 'KH-03',
    assignedFloors: ['1', '2']
  }
];

const hosteliteSeed = Array.from({ length: 14 }, (_, index) => {
  const num = index + 1;
  const hostelCode = num <= 6 ? 'QH-01' : num <= 10 ? 'IH-02' : 'KH-03';
  return {
    email: `hostelite${num}@nhms.edu.pk`,
    firstName: `Student${num}`,
    lastName: 'NHMS',
    phoneNumber: `0300-40000${num.toString().padStart(2, '0')}`,
    universityId: `NUST-${2024 + (num % 2)}-${1000 + num}`,
    department: num % 2 === 0 ? 'Computer Science' : 'Electrical Engineering',
    academicYear: (num % 4) + 1,
    roomNumber: `${Math.ceil(num / 2)}0${(num % 10) + 1}`,
    hostelCode
  };
});

const seed = async () => {
  try {
    await connectDB();

    const hostelMap = new Map();
    for (const hostelData of hostels) {
      const existing = await Hostel.findOne({ hostelCode: hostelData.hostelCode });
      const hostel = existing || (await Hostel.create(hostelData));
      hostelMap.set(hostelData.hostelCode, hostel);
    }

    const managers = [];
    for (const manager of managerSeed) {
      const existing = await HostelManager.findOne({ email: manager.email });
      if (existing) {
        managers.push(existing);
        continue;
      }

      const hostel = hostelMap.get(manager.hostelCode);
      const created = await HostelManager.create({
        email: manager.email,
        password: DEFAULT_PASSWORD,
        firstName: manager.firstName,
        lastName: manager.lastName,
        phoneNumber: manager.phoneNumber,
        role: 'HOSTEL_MANAGER',
        managerId: manager.managerId,
        hostel: hostel._id,
        joinDate: new Date(),
        isEmailVerified: true,
        active: true
      });
      managers.push(created);
    }

    const staffMembers = [];
    for (const staff of staffSeed) {
      const existing = await CleaningStaff.findOne({ email: staff.email });
      if (existing) {
        staffMembers.push(existing);
        continue;
      }

      const hostel = hostelMap.get(staff.hostelCode);
      const created = await CleaningStaff.create({
        email: staff.email,
        password: DEFAULT_PASSWORD,
        firstName: staff.firstName,
        lastName: staff.lastName,
        phoneNumber: staff.phoneNumber,
        role: 'CLEANING_STAFF',
        staffId: staff.staffId,
        assignedHostels: [hostel._id],
        assignedFloors: staff.assignedFloors,
        joinDate: new Date(),
        shiftTiming: 'MORNING',
        isEmailVerified: true,
        active: true
      });
      staffMembers.push(created);
    }

    const hostelites = [];
    for (const hostelite of hosteliteSeed) {
      const existing = await Hostelite.findOne({ email: hostelite.email });
      if (existing) {
        hostelites.push(existing);
        continue;
      }

      const hostel = hostelMap.get(hostelite.hostelCode);
      const created = await Hostelite.create({
        email: hostelite.email,
        password: DEFAULT_PASSWORD,
        firstName: hostelite.firstName,
        lastName: hostelite.lastName,
        phoneNumber: hostelite.phoneNumber,
        role: 'HOSTELITE',
        universityId: hostelite.universityId,
        department: hostelite.department,
        academicYear: hostelite.academicYear,
        roomNumber: hostelite.roomNumber,
        hostel: hostel._id,
        admissionDate: new Date(),
        validUpto: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isEmailVerified: true,
        active: true
      });
      hostelites.push(created);
    }

    for (const hostel of hostelMap.values()) {
      const manager = managers.find((m) => m.hostel.toString() === hostel._id.toString());
      if (manager) {
        hostel.manager = manager._id;
      }

      hostel.hostelites = hostelites
        .filter((h) => h.hostel.toString() === hostel._id.toString())
        .map((h) => h._id);

      hostel.cleaningStaff = staffMembers
        .filter((s) => s.assignedHostels.some((id) => id.toString() === hostel._id.toString()))
        .map((s) => s._id);

      await hostel.save();
    }

    console.log('Seed complete: created at least 20 users.');
    console.log(`Default password for all users: ${DEFAULT_PASSWORD}`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
