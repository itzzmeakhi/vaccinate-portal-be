import Student from './../models/Student.js';
import Drive from './../models/Drive.js';

const getMetrics = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();

    const vaccinatedStudents = await Student.countDocuments({ "vaccinations.0": { $exists: true } });
    const vaccinatedPercentage = totalStudents > 0 ? (vaccinatedStudents / totalStudents) * 100 : 0;

    const upcomingDrives = await Drive.find({
      date: { $gte: new Date(), $lte: new Date(new Date().setDate(new Date().getDate() + 30)) }
    }).select('name date').sort({ date: 1 });

    res.status(200);
    res.json({
      totalStudents,
      vaccinatedStudents,
      vaccinatedPercentage: vaccinatedPercentage.toFixed(2),
      upcomingDrives
    });
  } catch(err) {
    next(err);
  }
}; 

export { 
  getMetrics
};