const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;

app.use(cors());

mongoose.connect("mongodb+srv://ewdata23:ewdatacollection@ewdata2.fa0rarx.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB Atlas");
});

const studentSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  parentPhoneNumber: String,
  email: String,
  class: String,
  photo: Buffer,
  username: String,
  password: String
});

const teacherSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  email: String,
  teachingClasses: [String],
  teachingSubject: String,
  username: String,
  password: String
});

const Student = mongoose.model("Student", studentSchema);
const Teacher = mongoose.model("Teacher", teacherSchema);

app.use(express.static(path.join(__dirname, "frontend")));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/register", upload.single("photo"), async (req, res) => {
  try {
    const userData = req.body;

    console.log("Received user data:", userData);

    if (!userData || !userData.type) {
      return res.status(400).json({ message: "Invalid user data." });
    }

    const { username, password } = generateCredentials(userData.name);
    const hashedPassword = await bcrypt.hash(password, 10);

    if (userData.type === "student") {
      const studentData = new Student({
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        parentPhoneNumber: userData.parentPhoneNumber,
        email: userData.email,
        class: userData.class,
        photo: req.file ? req.file.buffer : null,
        username: username,
        password: hashedPassword
      });
      await studentData.save();
      sendEmail(userData.email, username, password);
      res.json({ message: "Student registered successfully!" });
    } else if (userData.type === "teacher") {
      const teacherData = new Teacher({
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        teachingClasses: userData.teachingClasses,
        teachingSubject: userData.teachingSubject,
        username: username,
        password: hashedPassword
      });
      await teacherData.save();
      sendEmail(userData.email, username, password);
      res.json({ message: "Teacher registered successfully!" });
    } else {
      res.status(400).json({ message: "Invalid user type." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function generateCredentials(name) {
  const username = `${name}${Math.floor(Math.random() * 10000)}`;
  const password = Math.random().toString(36).slice(-8);

  return { username, password };
}

async function sendEmail(email, username, password) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'the1clubcom@gmail.com',
      pass: 'ivbactgqsrbexrbb',
    }
  });

  const mailOptions = {
    from: 'noreply@entrance-world.com',
    to: email,
    subject: 'Account Registration At Entrance World',
    text: `The Entrance World app will come soon, then you should login with the credentials given for you.Your account has been created with the following credentials:\nUsername: ${username}\nPassword: ${password}\nPlease change your password once you log in.\n IMPORTANT : DON'T SHARE YOUR PASSWORD WITH ANYONE!\n HAPPY LEARNING!`
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Could not send email: ", error);
  }
}
