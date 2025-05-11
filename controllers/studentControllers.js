import csv from 'csvtojson';
import fs from 'fs';

import Student from './../models/Student.js';

const createStudent = async (req, res, next) => {
  try {
    const {
      regNo,
      name,
      standard,
      dob,
      parentName,
      parentContactNum
    } = req.body;

    if (regNo && name && standard && dob && parentName && parentContactNum) {
      const student = new Student({
        regNo,
        name,
        standard,
        dob,
        parentName,
        parentContactNum
      });

      if(parentContactNum.length !== 10) {
        res.status(400);
        next(new Error('Invalid contact number'));
        return;
      }

      const created = await student.save();

      res.status(201);
      res.json({ studentId: created._id, success: true, error: null });
      return;
    } else {
      res.status(400);
      next(new Error('Some fields are empty'));
    }
  } catch (err) {
    next(err);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if(student) {
      student.regNo = req.body.regNo || student.regNo;
      student.name = req.body.name || student.name;
      student.standard = req.body.standard || student.standard;
      student.dob = req.body.dob || student.dob;
      student.parentName = req.body.parentName || student.parentName;
      student.parentContactNum = req.body.parentContactNum || student.parentContactNum;
      student.vaccinations = student.vaccinations;

      const updatedstudent = await student.save();

      res.status(200);
      res.json({
        _id: updatedstudent._id,
        regNo: updatedstudent.regNo,
        name: updatedstudent.name,
        standard: updatedstudent.standard,
        dob: updatedstudent.dob,
        parentName: updatedstudent.parentName,
        parentContactNum: updatedstudent.parentContactNum,
        vaccinations: updatedstudent.vaccinations
      });
    } else {
      res.status(404);
      throw new Error('Student not found');
    }
  } catch (err) {
    next(err);
  }
};

const bulkUpload = async (req, res, next) => {
  try {
    const path = req.file.path;
    const jsonArray = await csv().fromFile(path);
    await Student.insertMany(jsonArray);
    fs.unlinkSync(path);
    res.status(201);
    res.json({ message: 'Bulk upload successful' });
  } catch (err) {
    next(err);
  }
};

const getAllStudents = async (req, res, next) => {
  try {
    const { name, standard, regNo, vaccinated, vaccine } = req.query;

    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (standard) filter.standard = { $in: standard.split(',') };
    if (regNo) filter.regNo = regNo;
    // if (vaccinated === 'true') filter.vaccinations = { $exists: true, $ne: [] };
    // if (vaccinated === 'false') filter.vaccinations = { $eq: [] };

    if (vaccine) {
      if (vaccinated === 'true') {
        filter.vaccinations = {
          $elemMatch: { vaccineId: vaccine }
        };
      } else if (vaccinated === 'false'){
        filter.$or = [
          { vaccinations: { $not: { $elemMatch: { vaccineId: vaccine  } } } },
          { vaccinations: { $eq: [] } }
        ];
      } else {
        filter.vaccinations = {
          $elemMatch: { vaccineId: vaccine }
        };
      }
    } else {
      if (vaccinated === 'true') {
        filter.vaccinations = { $exists: true, $ne: [] };
      } else if (vaccinated === 'false') {
        filter.vaccinations = { $eq: [] };
      }
    }

    const students = await Student.find(filter);
    res.status(200);
    res.json({
      students: students,
      success: true
    });
  } catch(err) {
    next(err);
  }
};

export {
  createStudent,
  updateStudent,
  bulkUpload,
  getAllStudents
};