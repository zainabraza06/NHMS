/**
 * Standalone test for Mess-Off Logic
 * Rules: 
 * 1. Min 2 inclusive days required.
 * 2. 1st day of request range is skipped (not counted).
 * 3. Days split across calendar months.
 */

const calculateMessOffSplit = (startDateStr, endDateStr) => {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    // Inclusive duration check
    const diffTime = Math.abs(end - start);
    const inclusiveDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (inclusiveDays < 2) {
        return { error: 'Duration must be at least 2 days' };
    }

    const daysByMonth = {};
    let temp = new Date(start);
    temp.setDate(temp.getDate() + 1); // Skip 1st day

    while (temp <= end) {
        const key = `${(temp.getMonth() + 1).toString().padStart(2, '0')}-${temp.getFullYear()}`;
        daysByMonth[key] = (daysByMonth[key] || 0) + 1;
        temp.setDate(temp.getDate() + 1);
    }

    return { daysByMonth, totalCounted: Object.values(daysByMonth).reduce((a, b) => a + b, 0) };
};

const runTests = () => {
    console.log('--- Mess-Off Logic Tests ---');

    // Test 1: 1-day request (should fail)
    const t1 = calculateMessOffSplit('2026-03-01', '2026-03-01');
    console.log('Test 1 (1-day):', t1.error ? 'PASSED (Rejected)' : 'FAILED');

    // Test 2: 2-day request (Feb 28 - March 1)
    const t2 = calculateMessOffSplit('2026-02-28', '2026-03-01');
    console.log('Test 2 (Feb 28 - Mar 1):');
    console.log(`  Split:`, t2.daysByMonth);
    console.log(`  Total Counted: ${t2.totalCounted}`);
    if (!t2.daysByMonth['02-2026'] && t2.daysByMonth['03-2026'] === 1) {
        console.log('  PASSED: Feb skipped, March got 1 day.');
    } else {
        console.log('  FAILED');
    }

    // Test 3: 3-day request (Feb 28 - March 2)
    const t3 = calculateMessOffSplit('2026-02-28', '2026-03-02');
    console.log('Test 3 (Feb 28 - Mar 2):');
    console.log(`  Split:`, t3.daysByMonth);
    if (!t3.daysByMonth['02-2026'] && t3.daysByMonth['03-2026'] === 2) {
        console.log('  PASSED: Feb skipped, March got 2 days.');
    } else {
        console.log('  FAILED');
    }

    // Test 4: Long request across 3 months (Jan 31 - March 2)
    const t4 = calculateMessOffSplit('2026-01-31', '2026-03-02');
    console.log('Test 4 (Jan 31 - Mar 2):');
    console.log(`  Split:`, t4.daysByMonth);
    // Jan 31 skipped. Feb: 28 days. March: 1, 2 (2 days).
    if (!t4.daysByMonth['01-2026'] && t4.daysByMonth['02-2026'] === 28 && t4.daysByMonth['03-2026'] === 2) {
        console.log('  PASSED: Complex split correct.');
    } else {
        console.log('  FAILED');
    }
};

runTests();
