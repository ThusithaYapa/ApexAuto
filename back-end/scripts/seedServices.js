require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('../models/Service');

const services = [
  { name: 'Engine Tuning', description: 'Performance ECU remap and tuning', price: 450 },
  { name: 'Exhaust System', description: 'Sport exhaust installation', price: 1200 },
  { name: 'Body Kit', description: 'Full body kit installation', price: 2800 },
  { name: 'Wheel Upgrade', description: 'Premium alloy wheels and tires', price: 1500 },
  { name: 'Spoiler', description: 'Rear spoiler installation', price: 650 },
  { name: 'Suspension', description: 'Lowering springs / coilovers', price: 900 },
  { name: 'Brake Upgrade', description: 'Performance brake kit', price: 1800 },
  { name: 'Interior Trim', description: 'Custom interior trim', price: 750 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Service.deleteMany({});
    await Service.insertMany(services);
    console.log('Services seeded:', services.length);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
