import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';
import Hostelite from '../models/Hostelite.js';
import HostelManager from '../models/HostelManager.js';
import Challan from '../models/Challan.js';

dotenv.config();

const diagnose = async () => {
    try {
        await connectDB();

        const m1 = await HostelManager.findOne({ email: 'manager1@nhms.edu.pk' });
        const h1 = await Hostelite.findOne({ email: 'hostelite1@nhms.edu.pk' });

        if (!m1 || !h1) {
            console.log('Manager 1 or Hostelite 1 not found');
            process.exit(1);
        }

        console.log(`Manager 1 Hostel: ${m1.hostel} (Type: ${typeof m1.hostel})`);
        console.log(`Hostelite 1 Hostel: ${h1.hostel} (Type: ${typeof h1.hostel})`);
        console.log(`Equal? ${String(m1.hostel) === String(h1.hostel)}`);

        const hostelites = await Hostelite.find({ hostel: m1.hostel });
        console.log(`Hostelites found with manager.hostel: ${hostelites.length}`);

        const h1InList = hostelites.find(h => String(h._id) === String(h1._id));
        console.log(`Hostelite 1 in list? ${Boolean(h1InList)}`);

        const challans = await Challan.find({ hostelite: { $in: hostelites.map(h => h._id) } });
        console.log(`Challans found with $in: ${challans.length}`);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
};

diagnose();
