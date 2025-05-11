import mongoose from 'mongoose';

const studentSchema = mongoose.Schema({
  regNo: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  standard: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  parentName: {
    type: String,
    required: true
  },
  parentContactNum: {
    type: String,
    required: true
  },
  vaccinations: {
    type: [
      {
        vaccineId: { type: String, required: true },
        vaccineName: { type: String, required: true },
        driveId: { type: String, required: true },
        driveName: { type: String, required: true },
        date: { type: Date, required: true }
      }
    ],
    default: []
  }
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

export default Student;