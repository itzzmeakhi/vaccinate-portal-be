import mongoose from 'mongoose';

const driveSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  vaccine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vaccine',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  numDoses: { 
    type: Number, 
    required: true 
  },
  usedDoses: {
    type: Number,
    default: 0
  },
  applicableClasses: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  createdAt: {
    type: Date, 
    default: Date.now
  }
}, {
  timestamps: true
});

const Drive = mongoose.model('Drive', driveSchema);

export default Drive;