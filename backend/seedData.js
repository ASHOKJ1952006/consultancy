const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Batch = require('./models/Batch');
const Schedule = require('./models/Schedule');
const Inventory = require('./models/Inventory');
const Machine = require('./models/Machine');
const Inspection = require('./models/Inspection');
const Alert = require('./models/Alert');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

// Sample data
const machines = [
    { machineId: 'SF-01', name: 'Softflow 1', status: 'running', party: 'LUX', color: 'Navy', lotNo: '2384/2385', quantity: '331 kg', stage: 'Soap Run', efficiency: 94, runtime: '5h 32m' },
    { machineId: 'SF-02', name: 'Softflow 2', status: 'running', party: 'JG', color: 'Petrol Blue', lotNo: '002', quantity: '504 kg', stage: 'TD Load', efficiency: 88, runtime: '3h 15m' },
    { machineId: 'SF-03', name: 'Softflow 3', status: 'running', party: 'Modenik', color: 'Olive', lotNo: '13141/13142/13143', quantity: '505 kg', stage: 'Soap Steam', efficiency: 91, runtime: '6h 20m' },
    { machineId: 'SF-04', name: 'Softflow 4', status: 'running', party: 'Modenik', color: 'Poseidon', lotNo: '13141/5', quantity: '141 kg', stage: 'Soap Run', efficiency: 85, runtime: '7h 48m' },
    { machineId: 'SF-05', name: 'Softflow 5', status: 'running', party: 'Modenik', color: 'Olive', lotNo: '13414/5', quantity: '514 kg', stage: 'Unload', efficiency: 92, runtime: '2h 10m' },
    { machineId: 'SF-06', name: 'Softflow 6', status: 'idle' },
    { machineId: 'SF-07', name: 'Softflow 7', status: 'running', party: 'Modenik', color: 'C. Brown', lotNo: '112', quantity: '507 kg', stage: 'Soap Run', efficiency: 89, runtime: '4h 25m' },
    { machineId: 'SF-08', name: 'Softflow 8', status: 'maintenance' }
];

const batches = [
    {
        batchId: 'BTH-2501',
        date: '2025-12-10',
        machine: 'SF-01',
        party: 'LUX',
        color: 'Navy Blue',
        lotNo: '2384/2385',
        quantity: '331 kg',
        duration: '6h 45m',
        status: 'completed',
        efficiency: 94,
        deltaE: 0.8,
        operator: 'Amir Khan',
        recipe: {
            dyes: [
                { name: 'BLACK B (SF) Divine', qty: '3.2%' },
                { name: 'BLUE RR (Divine)', qty: '1.5%' }
            ],
            chemicals: [
                { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
                { name: 'Soaping Oil - OL 40', qty: '1.5g/l' }
            ]
        },
        stages: [
            { name: 'TD Load', duration: '30 min', temp: '25°C' },
            { name: 'Dyeing', duration: '120 min', temp: '90°C' },
            { name: 'Soap Run', duration: '45 min', temp: '80°C' },
            { name: 'Soap Steam', duration: '60 min', temp: '98°C' },
            { name: 'Unload', duration: '20 min', temp: '30°C' }
        ]
    },
    {
        batchId: 'BTH-2502',
        date: '2025-12-10',
        machine: 'SF-03',
        party: 'Modenik',
        color: 'Olive',
        lotNo: '13141/13142',
        quantity: '505 kg',
        duration: '7h 20m',
        status: 'completed',
        efficiency: 91,
        deltaE: 0.6,
        operator: 'Hassan Ali',
        recipe: {
            dyes: [
                { name: 'YELLOW ME49L (Divine)', qty: '2.8%' },
                { name: 'BLACK B (SF) Divine', qty: '1.2%' }
            ],
            chemicals: [
                { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
                { name: 'Soaping Oil - OL 40', qty: '1.5g/l' },
                { name: 'Softner Cakes (1:15)', qty: '3%' }
            ]
        },
        stages: [
            { name: 'TD Load', duration: '35 min', temp: '25°C' },
            { name: 'Dyeing', duration: '135 min', temp: '90°C' },
            { name: 'Soap Run', duration: '50 min', temp: '80°C' },
            { name: 'Soap Steam', duration: '65 min', temp: '98°C' },
            { name: 'Unload', duration: '25 min', temp: '30°C' }
        ]
    }
];

const schedules = [
    { date: '2025-12-15', time: '08:00', machine: 'SF-01', party: 'LUX', color: 'Navy Blue', lotNo: '2401', quantity: '450 kg', duration: '6 hours', priority: 'high', status: 'scheduled' },
    { date: '2025-12-15', time: '09:00', machine: 'SF-02', party: 'Modenik', color: 'Olive', lotNo: '13201', quantity: '520 kg', duration: '7 hours', priority: 'medium', status: 'scheduled' },
    { date: '2025-12-16', time: '08:00', machine: 'SF-01', party: 'LUX', color: 'Sky Blue', lotNo: '2402', quantity: '400 kg', duration: '6 hours', priority: 'high', status: 'scheduled' }
];

const inventory = [
    { name: 'BLACK B (SF) Divine', category: 'Dye', stock: 617, maxCapacity: 1000, minThreshold: 200, weeklyUsage: { sun: 3930, mon: 3165, tue: 3640, wed: 3415, thu: 3389, fri: 3815 } },
    { name: 'DEEP BLACK', category: 'Dye', stock: 50, maxCapacity: 200, minThreshold: 100, weeklyUsage: { sun: 384, mon: 3184, tue: 3184, wed: 3134, thu: 8134, fri: 3134 } },
    { name: 'RED W3R (Divine)', category: 'Dye', stock: 148, maxCapacity: 500, minThreshold: 150, weeklyUsage: { sun: 1205, mon: 1158, tue: 1127, wed: 1101, thu: 1098, fri: 1081 } },
    { name: 'YELLOW ME49L (Divine)', category: 'Dye', stock: 5, maxCapacity: 50, minThreshold: 20, weeklyUsage: { sun: 114, mon: 14, tue: 147, wed: 108, thu: 108, fri: 108 } },
    { name: 'BLUE RR (Divine)', category: 'Dye', stock: 19, maxCapacity: 100, minThreshold: 50, weeklyUsage: { sun: 370, mon: 370, tue: 370, wed: 370, thu: 356, fri: 356 } },
    { name: 'Wetting Oil - BMW/CFLD', category: 'Chemical', stock: 288, maxCapacity: 400, minThreshold: 100, weeklyUsage: { sun: 1613, mon: 1500, tue: 1448, wed: 1389, thu: 1347, fri: 1386 } },
    { name: 'Soaping Oil - OL 40', category: 'Chemical', stock: 321, maxCapacity: 400, minThreshold: 100, weeklyUsage: { sun: 1521, mon: 1428, tue: 1341, wed: 1293, thu: 1259, fri: 1224 } },
    { name: 'Softner Cakes (1:15)', category: 'Chemical', stock: 75, maxCapacity: 100, minThreshold: 80, weeklyUsage: { sun: 125, mon: 100, tue: 100, wed: 100, thu: 75, fri: 75 } }
];

const inspections = [
    { date: '28/11/25', color: 'Navy', client: 'Modenik', lotNo: '12814/1/D', deltaE: 0.8, status: 'approved' },
    { date: '28/11/25', color: 'Olive', client: 'Modenik', lotNo: '111', deltaE: 0.6, status: 'approved' },
    { date: '28/11/25', color: 'Poseidon', client: 'Modenik', lotNo: '109', deltaE: 2.1, status: 'rejected' },
    { date: '29/11/25', color: 'Air Force', client: 'JG', lotNo: '371', deltaE: 0.5, status: 'approved' },
    { date: '29/11/25', color: 'Dk. Brown', client: 'JG', lotNo: '375', status: 'pending' },
    { date: '1/12/25', color: 'Olive', client: 'LUX', lotNo: '2003', status: 'pending' }
];

const alerts = [
    { type: 'critical', category: 'inventory', title: 'Critical Stock Level', message: 'YELLOW ME49L (Divine) is at 10% stock level (5 kg remaining)', actionable: true },
    { type: 'critical', category: 'inventory', title: 'Low Stock Alert', message: 'BLUE RR (Divine) is running low - only 19% remaining', actionable: true },
    { type: 'warning', category: 'machine', title: 'Machine Efficiency Drop', message: 'Softflow 4 efficiency dropped to 85% - below threshold', actionable: true },
    { type: 'info', category: 'production', title: 'Production Target Achieved', message: 'Weekly production exceeded target by 12%', actionable: false }
];

// Seed function
async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        await Promise.all([
            Machine.deleteMany({}),
            Batch.deleteMany({}),
            Schedule.deleteMany({}),
            Inventory.deleteMany({}),
            Inspection.deleteMany({}),
            Alert.deleteMany({})
        ]);
        console.log('✅ Cleared existing data');

        // Insert new data
        await Machine.insertMany(machines);
        console.log('✅ Seeded machines');

        await Batch.insertMany(batches);
        console.log('✅ Seeded batches');

        await Schedule.insertMany(schedules);
        console.log('✅ Seeded schedules');

        await Inventory.insertMany(inventory);
        console.log('✅ Seeded inventory');

        await Inspection.insertMany(inspections);
        console.log('✅ Seeded inspections');

        await Alert.insertMany(alerts);
        console.log('✅ Seeded alerts');

        console.log('🎉 Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run seeding
seedDatabase();
