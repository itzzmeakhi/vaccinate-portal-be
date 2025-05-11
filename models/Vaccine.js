import mongoose from 'mongoose';

const vaccineSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  manfacturer: {
    type: String,
    require: true
  }
}, {
  timestamps: true
});

const Vaccine = mongoose.model('Vaccine', vaccineSchema);

export default Vaccine;