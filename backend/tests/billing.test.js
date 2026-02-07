/**
 * Standalone test for Billing Logic
 * Rules:
 * 1. Base fee = 580 * days in month.
 * 2. Discount only if approved days for THAT month > 1.
 * 3. Discount capped at 12 days.
 */

const MESS_OFF_DAILY_RATE = 580;

const calculateBilling = (monthStr, totalMessOffDays) => {
    // 1. Base fee
    const [mm, yyyy] = monthStr.split('-').map(Number);
    const daysInMonth = new Date(yyyy, mm, 0).getDate();
    const baseMessFee = daysInMonth * MESS_OFF_DAILY_RATE;

    // 2. Discount
    let cappedMessOffDays = Math.min(totalMessOffDays, 12);
    const messOffDiscount = cappedMessOffDays > 1 ? cappedMessOffDays * MESS_OFF_DAILY_RATE : 0;

    return { baseMessFee, messOffDiscount, totalAmount: baseMessFee - messOffDiscount };
};

const runTests = () => {
    console.log('--- Billing Logic Tests ---');

    // Test 1: March (31 days), 2 mess-off days
    const t1 = calculateBilling('03-2026', 2);
    console.log('Test 1 (March, 2 days):');
    console.log(`  Base: ${t1.baseMessFee} (Exp: 17980)`);
    console.log(`  Discount: ${t1.messOffDiscount} (Exp: 1160)`);
    if (t1.baseMessFee === 17980 && t1.messOffDiscount === 1160) {
        console.log('  PASSED');
    } else {
        console.log('  FAILED');
    }

    // Test 2: February (28 days), 1 mess-off day
    const t2 = calculateBilling('02-2026', 1);
    console.log('Test 2 (February, 1 day):');
    console.log(`  Base: ${t2.baseMessFee} (Exp: 16240)`);
    console.log(`  Discount: ${t2.messOffDiscount} (Exp: 0 - Threshold Rule)`);
    if (t2.baseMessFee === 16240 && t2.messOffDiscount === 0) {
        console.log('  PASSED');
    } else {
        console.log('  FAILED');
    }

    // Test 3: Capping (15 days mess-off)
    const t3 = calculateBilling('01-2026', 15);
    console.log('Test 3 (Capping at 12 days):');
    console.log(`  Discount: ${t3.messOffDiscount} (Exp: 6960 - 12 days)`);
    if (t3.messOffDiscount === 12 * 580) {
        console.log('  PASSED');
    } else {
        console.log('  FAILED');
    }
};

runTests();
