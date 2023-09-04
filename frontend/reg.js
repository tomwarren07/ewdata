document.addEventListener("DOMContentLoaded", function() {
  const toggleBtns = document.querySelectorAll(".toggle-btn");
  const studentForm = document.getElementById("studentForm");
  const teacherForm = document.getElementById("teacherForm");
  const studentNameInput = document.getElementById("studentName");
  const studentPhoneNumberInput = document.getElementById("studentPhoneNumber");
  const parentPhoneNumberInput = document.getElementById("parentPhoneNumber");
  const studentEmailInput = document.getElementById("studentEmail");
  const studentClassSelect = document.getElementById("studentClass");
  const studentPhotoInput = document.getElementById("studentPhoto");
  const teacherNameInput = document.getElementById("teacherName");
  const teacherPhoneNumberInput = document.getElementById("teacherPhoneNumber");
  const teacherEmailInput = document.getElementById("teacherEmail");
  const teachingClassCheckboxes = document.querySelectorAll("input[name='teachingClass']");
  const teachingSubjectInput = document.getElementById("teachingSubject");

  const phonePattern = /^[0-9]{10}$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Handle avatar click to trigger file input
  const avatar = document.getElementById("avatar");
  avatar.addEventListener("click", function() {
      studentPhotoInput.click();
  });

  // Update avatar when a file is selected
  studentPhotoInput.addEventListener("change", function() {
      const file = studentPhotoInput.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
              avatar.src = e.target.result;
          };
          reader.readAsDataURL(file);
      }
  });

  toggleBtns.forEach(btn => {
      btn.addEventListener("click", function() {
          const isStudent = btn.textContent === "STUDENT";
          studentForm.style.display = isStudent ? "block" : "none";
          teacherForm.style.display = isStudent ? "none" : "block";
          // Highlight the active button
          toggleBtns.forEach(btn => btn.classList.remove("active"));
          btn.classList.add("active");
      });
  });

  document.getElementById("registerButton").addEventListener("click", function() {
      const isStudentFormActive = studentForm.style.display === "block";
      const isTeacherFormActive = teacherForm.style.display === "block";

      if (isStudentFormActive) {
          const studentPhoneNumber = studentPhoneNumberInput.value;
          const parentPhoneNumber = parentPhoneNumberInput.value;
          const studentEmail = studentEmailInput.value;
          const studentClass = studentClassSelect.value;
          const studentPhoto = studentPhotoInput.files.length > 0 ? studentPhotoInput.files[0] : null;
          const studentName = studentNameInput.value;

          if (!phonePattern.test(studentPhoneNumber) || !phonePattern.test(parentPhoneNumber) || !emailPattern.test(studentEmail)) {
              alert("Invalid input format! Check your input.");
              return;
          }

          const studentData = new FormData();
          studentData.append("type", "student");
          studentData.append("name", studentName);
          studentData.append("phoneNumber", studentPhoneNumber);
          studentData.append("parentPhoneNumber", parentPhoneNumber);
          studentData.append("email", studentEmail);
          studentData.append("class", studentClass);

          if (studentPhoto) {
              studentData.append("photo", studentPhoto);
          }

          // Send student data to the backend
          sendUserData(studentData);
      }

      if (isTeacherFormActive) {
          // ... (get teacher form data)
          const teachingClassCheckboxes = document.querySelectorAll("input[name='teachingClass']:checked");
          const teachingClasses = Array.from(teachingClassCheckboxes).map(checkbox => checkbox.value);
          const teachingSubject = teachingSubjectInput.value;
          const teacherPhoneNumber = teacherPhoneNumberInput.value;
          const teacherEmail = teacherEmailInput.value;
          const teacherName = teacherNameInput.value;

          if (!phonePattern.test(teacherPhoneNumber) || !emailPattern.test(teacherEmail) || teachingClasses.length === 0) {
              alert("Invalid input format! Check your input.");
              return;
          }

          const teacherData = new FormData();
          teacherData.append("type", "teacher");
          teacherData.append("name", teacherName);
          teacherData.append("phoneNumber", teacherPhoneNumber);
          teacherData.append("email", teacherEmail);
          teachingClasses.forEach(classValue => {
              teacherData.append("teachingClasses", classValue);
          });
          teacherData.append("teachingSubject", teachingSubject);

          // Send teacher data to the backend
          sendUserData(teacherData);
      }
  });

  function sendUserData(data) {
    fetch("http://ewdata.onrender.com/register", {
      method: "POST",
      body: data,
    })
    
      .then(response => {
          if (!response.ok) {
              throw new Error("Network response was not ok");
          }
          return response.json();
      })
      .then(data => {
          console.log("Response data:", data);
          alert(data.message);
          window.location.href = "reg_success.html";
      })
      .catch(error => {
          console.error("Error:", error);
          console.log("Response object:", error.response);
          alert("An error occurred while processing your request.");
      });
  }
});
