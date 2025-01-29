const express = require("express");
const bodyParser = require("body-parser");
const db = require("./config/db");

const app = express();
const port = 3000;

app.use(bodyParser.json());

/**
 * Adds a new student to the database.
 * @route POST /students
 * @param {string} req.body.name - The name of the student.
 * @param {number} req.body.age - The age of the student.
 * @param {string} req.body.grade - The grade of the student.
 * @returns {Object} 201 - Success message and student ID.
 * @returns {Object} 400 - Error message if required fields are missing.
 * @returns {Object} 500 - Error message if insertion fails.
 */
app.post("/students", (req, res) => {
  const { name, age, grade } = req.body;

  if (!name || !age || !grade) {
    return res
      .status(400)
      .json({ message: "Please provide all fields: name, age, grade" });
  }

  const query = "INSERT INTO students (name, age, grade) VALUES (?, ?, ?)";
  db.query(query, [name, age, grade], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error adding student", error: err });
    }
    res
      .status(201)
      .json({
        message: "Student added successfully",
        studentId: result.insertId,
      });
  });
});

/**
 * Retrieves a list of all students from the database.
 * @route GET /students
 * @returns {Object} 200 - List of students.
 * @returns {Object} 500 - Error message if retrieval fails.
 */
app.get("/students", (req, res) => {
  const query = "SELECT * FROM students";
  db.query(query, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error retrieving students list", error: err });
    }
    res
      .status(200)
      .json({ message: "Students retrieved successfully", students: result });
  });
});

/**
 * Retrieves a specific student by ID.
 * @route GET /students/:id
 * @param {number} req.params.id - The ID of the student.
 * @returns {Object} 200 - The student data.
 * @returns {Object} 404 - Error message if student is not found.
 * @returns {Object} 500 - Error message if retrieval fails.
 */
app.get("/students/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM students WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error retrieving student data", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    res
      .status(200)
      .json({ message: "Student retrieved successfully", student: result });
  });
});

/**
 * Updates a specific student's information.
 * @route PUT /students/:id
 * @param {number} req.params.id - The ID of the student.
 * @param {Object} req.body - Fields to update.
 * @returns {Object} 200 - Success message and updated student data.
 * @returns {Object} 400 - Error message if no fields are provided.
 * @returns {Object} 404 - Error message if student is not found.
 * @returns {Object} 500 - Error message if update fails.
 */
app.put("/students/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ message: "Student ID must be a number" });
  }

  const fieldsToUpdate = [];
  const values = [];

  if (updates.hasOwnProperty("name")) {
    fieldsToUpdate.push("name = ?");
    values.push(updates.name);
  }
  if (updates.hasOwnProperty("age")) {
    fieldsToUpdate.push("age = ?");
    values.push(updates.age);
  }
  if (updates.hasOwnProperty("grade")) {
    fieldsToUpdate.push("grade = ?");
    values.push(updates.grade);
  }

  if (fieldsToUpdate.length === 0) {
    return res
      .status(400)
      .json({ message: "At least one field must be provided for update" });
  }

  const query = `UPDATE students SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;
  values.push(id);

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    db.query(
      "SELECT * FROM students WHERE id = ?",
      [id],
      (err, selectResult) => {
        if (err) {
          return res.status(500).json({ message: "Server error" });
        }
        res.status(200).json({
          message: "Student updated successfully",
          updatedStudent: selectResult[0],
        });
      }
    );
  });
});

/**
 * Deletes a specific student from the database.
 * @route DELETE /students/:id
 * @param {number} req.params.id - The ID of the student.
 * @returns {Object} 204 - Success message.
 * @returns {Object} 400 - Error message if ID is invalid.
 * @returns {Object} 500 - Error message if deletion fails.
 */
app.delete("/students/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM students WHERE id = ?";

  if (isNaN(id)) {
    return res.status(400).json({ message: "Student ID must be a number" });
  }

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }
    res
      .status(204)
      .json({
        message: "Student deleted successfully",
        studentDeleted: result,
      });
  });
});

/**
 * Starts the server on the specified port.
 */
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
