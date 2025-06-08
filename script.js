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

let courseCount = 0;

function startForm() {
  const name = document.getElementById("user-name").value.trim();
  const count = parseInt(document.getElementById("course-count").value);

  if (!name || isNaN(count) || count <= 0) {
    alert("Please enter a valid name and number of courses.");
    return;
  }

  document.getElementById("form-section").style.display = "none";
  document.getElementById("courses-section").style.display = "block";

  courseCount = count;
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
        ${Object.keys(gradePoints).map(grade => `<option value="${grade}">${grade}</option>`).join("")}
      </select>
      <hr>
    `;
    container.appendChild(div);
  }
}

function calculateGPA() {
  const name = document.getElementById("user-name").value.trim();
  const names = Array.from(document.getElementsByClassName("course-name")).map(el => el.value.trim());
  const credits = Array.from(document.getElementsByClassName("course-credits")).map(el => parseFloat(el.value));
  const grades = Array.from(document.getElementsByClassName("course-grade")).map(el => el.value);

  let totalPoints = 0;
  let totalCredits = 0;

  for (let i = 0; i < courseCount; i++) {
    const grade = grades[i];
    const credit = credits[i];
    totalPoints += gradePoints[grade] * credit;
    totalCredits += credit;
  }

  const gpa = (totalPoints / totalCredits).toFixed(2);
  const honorRoll = gpa >= 3.75;

  document.getElementById("gpa-result").innerHTML = `
    <strong>${name}</strong>, your GPA is <strong>${gpa}</strong>.<br>
    ${honorRoll ? "🎉 You made the Honor Roll!" : ""}
  `;

  // Log to Google Sheets
  const data = {
    name,
    gpa,
    courses: names.map((course, i) => ({
      name: course,
      grade: grades[i],
      credits: credits[i]
    }))
  };

  fetch('https://script.google.com/macros/s/AKfycbySAjsx7i_ArjvqTFFd3-kZpgXt4s02pclPNQJC4Dz6KDAE9YofWAmJktApjDHXMYAo/exec
 {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
