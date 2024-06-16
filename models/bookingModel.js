const mongoose = require('mongoose');

const bookingsSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Bookings must belong to a Tour'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Bookings must belong to a user'],
  },
  price: {
    type: Number,
    required: [true, 'Bookings must have a price'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingsSchema.pre(/^find/, function (next) {
  this.populate('User').populate({
    path: 'tour',
    select: 'name',
  });
  next();
});

const Booking = mongoose.model('Booking', bookingsSchema);

module.exports = Booking;
