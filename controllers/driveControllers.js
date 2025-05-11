import Drive from './../models/Drive.js';
import Vaccine from './../models/Vaccine.js';
import Student from '../models/Student.js';

const createDrive = async (req, res, next) => {
  try {
    const { name, vaccine, date, numDoses, applicableClasses } = req.body;
    const today = new Date();
    const minDate = new Date(today.setDate(today.getDate() + 15));
    const driveDate = new Date(date);

    if (driveDate < minDate) {
      res.status(400);
      next(new Error('Drives must be scheduled at least 15 days in advance'));
      return;
    }

    const classList = applicableClasses.split(',').map(cls => cls.trim());
    const conflictDriveForAnyClass = await Drive.find({
      date: driveDate,
      applicableClasses: { 
        $regex: classList.map(cls => `\\b${cls}\\b`).join('|'), 
        $options: 'i' 
      }
    });

    if (conflictDriveForAnyClass.length > 0) {
      const conflictingClasses = new Set();
      conflictDriveForAnyClass.forEach(drive => {
        drive.applicableClasses.split(',').forEach(cls => {
          if (classList.includes(cls.trim())) {
            conflictingClasses.add(cls.trim());
          }
        });
      });

      const conflictMessage = `Drive conflict detected for following classes: ${Array.from(conflictingClasses).join(', ')}`;
      res.status(409);
      next(new Error(conflictMessage));
      return;
    }

    const vaccineExists = await Vaccine.findById(vaccine);
    if (!vaccineExists) {
      res.status(404);
      next(new Error('Vaccine not found'));
      return;
    }

    const drive = await Drive.create({
      name,
      vaccine,
      date: driveDate,
      numDoses,
      applicableClasses,
      createdBy: req.user._id,
    });

    res.status(201);
    res.json({ id: drive._id, success: true, error: null });
  } catch (err) {
    next(err);
  }
};

const getDriveStatusAggregate = async (req, res, next) => {
  try {
    const drives = await Drive.aggregate([
      { 
        $lookup: {
          from: 'vaccines',
          localField: 'vaccine',
          foreignField: '_id',
          as: 'vaccineDetails'
        }
      },
      { $unwind: '$vaccineDetails' },
      {
        $addFields: {
          applicableClassesArr: { $split: ['$applicableClasses', ','] }
        }
      },
      {
        $lookup: {
          from: 'students',
          let: { classes: '$applicableClassesArr' },
          pipeline: [
            { $match: { $expr: { $in: ['$standard', '$$classes'] } } }
          ],
          as: 'eligibleStudents'
        }
      }
    ]);

    const eligibleDrives = drives.filter(drive => {
      const isValid = new Date(drive.date) >= new Date() && drive.usedDoses < drive.numDoses;
      return isValid;
    }).map(drive => ({
      ...drive,
      eligibleStudents: drive.eligibleStudents.filter(student =>
        !student.vaccinations.some(v => v.vaccine === drive.vaccine)
      )
    }));
    const inEligibleDrives = drives.filter(drive =>
      new Date(drive.date) < new Date() || drive.usedDoses >= drive.numDoses
    );

    res.status(200);
    res.json({ success: true, eligibleDrives, inEligibleDrives });
  } catch (err) {
    next(err);
  }
};

const fetchDrives = async(req, res, next) => {
    try {
      const drives = await Drive.find({});
      res.status(200);
      res.json({
        drives: drives,
        success: true
      });
    } catch(err) {
      next(err);
    }
};

const vaccinate = async(req, res, next) => {
  try {
    const { driveId, studentId } = req.body;
    const drive = await Drive.findById(driveId).populate('vaccine');
    const student = await Student.findById(studentId);

    if (!student) {
      res.status(404);
      next(new Error('Student not found'));
      return;
    }

    if (!drive) {
      res.status(404);
      next(new Error('Vaccine not found'));
      return;
    }

    if (new Date(drive.date) < new Date() || drive.usedDoses >= drive.numDoses) {
      res.status(400);
      next(new Error('Drive is invalid'));
      return;
    }

    if (student.vaccinations.some(v => v.vaccine === drive.vaccine)) {
      res.status(400);
      next(new Error('Student already vaccinated'));
      return;
    }

    student.vaccinations.push({
      vaccineId: drive.vaccine._id,
      vaccineName: drive.vaccine.name,
      driveId: drive._id,
      driveName: drive.name,
      date: new Date()
    });

    await student.save();

    drive.usedDoses += 1;
    await drive.save();

    await getDriveStatusAggregate(req, res, next);
  } catch (err) {
    next(err);
  }
};

const fetchDriveById = async(req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.id);

    if (drive) {
      res.status(200);
      res.json({ drive });
    } else {
      res.status(404);
      next(new Error('Drive not found'));
    }
  } catch(err) {
    next(err);
  }
};

const updateDriveById = async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.id);

    if(drive) {
      drive.name = req.body.name || drive.title;
      drive.vaccine = req.body.vaccine || drive.vaccine;
      drive.date = req.body.date || drive.date;
      drive.numDoses = req.body.numDoses || drive.numDoses;
      drive.applicableClasses = req.body.applicableClasses || drive.applicableClasses;

      const updatedDrive = await drive.save();

      await getDriveStatusAggregate(req, res, next);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch(err) {
    next(err);
  }
};

export { 
  createDrive,
  getDriveStatusAggregate,
  fetchDrives,
  vaccinate,
  fetchDriveById,
  updateDriveById
};