const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://lucifurstore_db_user:KVdYNHmB6yxNL7VE@cluster0.bte8opn.mongodb.net/lucifur?retryWrites=true&w=majority&appName=Cluster0';

async function run() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for order linking...');

    const usersCol = mongoose.connection.db.collection('users');
    const ordersCol = mongoose.connection.db.collection('orders');

    const users = await usersCol.find({}).toArray();
    const emailToUserMap = {};
    users.forEach(u => {
      if (u.email) {
        emailToUserMap[u.email.toLowerCase().trim()] = u._id;
      }
    });

    const unlinkedOrders = await ordersCol.find({ user: null }).toArray();
    console.log(`Found ${unlinkedOrders.length} unlinked orders.`);

    let updatedCount = 0;
    for (const order of unlinkedOrders) {
      if (order.guestEmail) {
        const emailKey = order.guestEmail.toLowerCase().trim();
        const userId = emailToUserMap[emailKey];
        if (userId) {
          await ordersCol.updateOne(
            { _id: order._id },
            { $set: { user: userId } }
          );
          console.log(`Linked Order ${order._id} to User ID ${userId} (${emailKey})`);
          updatedCount++;
        }
      }
    }

    console.log(`Successfully linked ${updatedCount} orders to registered users.`);
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

run();
