const gradePoints = {
  "A+": 4.33,
  "A": 4.00,
  "A-": 3.67,
  "B+": 3.33,
  "B": 3.00,
  "B-": 2.67,
  "C+": 2.33,
  "C": 2.00,
  "C-": 1.67,
  "D": 1.00,
  "F": 0.00,
};

const creditOptions = [0.5, 1, 1.5, 2];
let userName = "";

function startForm() {
  userName = document.getElementById("user-name").value.trim();
  const courseCount = parseInt(document.getElementById("course-count").value);

  if (!userName || isNaN(courseCount) || courseCount <= 0) {
    alert("Please enter your name and a valid number of courses.");
    return;
  }

  document.getElementById("start-form").style.display = "none";
  document.getElementById("course-input-section").style.display = "block";

  generateCourseInputs(courseCount);
}

function generateCourseInputs(count) {
  const container = document.getElementById("courses-container");
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const div = document.createElement("div");
    div.innerHTML = `
      <h4>Course ${i + 1}</h4>
      <input type="text" placeholder="Course Name" class="course-name" required>
      <select class="course-credits">
        ${creditOptions.map(c => `<option value="${c}">${c} credits</option>`).join("")}
      </select>
      <select class="course-grade">
        ${Object.keys(gradePoints).map(g => `<option value="${g}">${g}</option>`).join("")}
      </select>
      <hr>
    `;
    container.appendChild(div);
  }
}

function calculateGPA() {
  const courseNames = Array.from(document.getElementsByClassName("course-name")).map(el => el.value.trim());
  const courseCredits = Array.from(document.getElementsByClassName("course-credits")).map(el => parseFloat(el.value));
  const courseGrades = Array.from(document.getElementsByClassName("course-grade")).map(el => el.value);

  let totalPoints = 0;
  let totalCredits = 0;

  for (let i = 0; i < courseNames.length; i++) {
    const grade = courseGrades[i];
    const credit = courseCredits[i];
    totalPoints += gradePoints[grade] * credit;
    totalCredits += credit;
  }

  const gpa = (totalPoints / totalCredits).toFixed(2);
  const honorRoll = gpa >= 3.75;

  document.getElementById("gpa-result").innerHTML = `
    <strong>${userName}</strong>, your GPA is <strong>${gpa}</strong>.<br>
    ${honorRoll ? "🎉 You made the Honor Roll!" : ""}
  `;

  // Log to Google Sheets
  const payload = {
    name: userName,
    gpa: gpa,
    courses: courseNames.map((name, i) => ({
      name: name,
      grade: courseGrades[i],
      credits: courseCredits[i]
    }))
  };

  fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

