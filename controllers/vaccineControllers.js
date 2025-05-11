import Vaccine from './../models/Vaccine.js';

const addVaccine = async (req, res, next) => {
  try {
    const { name, manfacturer } = req.body;
    const vaccineFound = await Vaccine.findOne({ name });

    if(vaccineFound && vaccineFound.manfacturer === manfacturer) {
      res.status(400);
      next(new Error('Vaccine already present in data'));
    } else {
      const vaccine = new Vaccine({
        name,
        manfacturer
      });
  
      const created = await vaccine.save();
      const vaccines = await Vaccine.find({});
  
      res.status(201);
      res.json({ id: created._id, success: true, error: null, vaccines: vaccines });
    }
  } catch(err) {
    next(err);
  }
}; 

const getAllVaccines = async (req, res, next) => {
  try {
    const vaccines = await Vaccine.find({});
    res.status(200);
    res.json({
      vaccines: vaccines,
      success: true
    });
  } catch(err) {
    next(err);
  }
};

export { 
  addVaccine,
  getAllVaccines
};