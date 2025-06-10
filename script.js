const gradeScale = {
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
  "F": 0.00
};

function startCourseInput() {
  const username = document.getElementById("username").value.trim();
  if (!username) {
    alert("Please enter your name.");
    return;
  }

  localStorage.setItem("username", username);
  document.getElementById("form-section").classList.add("hidden");
  document.getElementById("course-count-section").classList.remove("hidden");

  // Log visit
  fetch("https://api.ipify.org?format=json")
    .then(res => res.json())
    .then(data => {
      const ip = data.ip;
      const browser = navigator.userAgent;
      const timestamp = new Date().toISOString();

      fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          ip: ip,
          browser: browser,
          time: timestamp,
          type: "visit"
        }),
      });
    });
}

function generateCourseFields() {
  const courseCount = parseInt(document.getElementById("courseCount").value);
  if (isNaN(courseCount) || courseCount < 1) {
    alert("Please enter a valid number of courses.");
    return;
  }

  const form = document.getElementById("courses-form");
  form.innerHTML = "";

  for (let i = 0; i < courseCount; i++) {
    form.innerHTML += `
      <div>
        <label>Course ${i + 1} Name:</label>
        <input type="text" name="course${i}" required />

        <label>Credits:</label>
        <select name="credits${i}">
          <option value="1">1</option>
          <option value="0.5">0.5</option>
          <option value="2">2</option>
        </select>

        <label>Grade:</label>
        <select name="grade${i}">
          ${Object.keys(gradeScale).map(g => `<option value="${g}">${g}</option>`).join("")}
        </select>
      </div>
    `;
  }

  form.innerHTML += `<button type="button" onclick="calculateGPA(${courseCount})">Calculate GPA</button>`;
  form.classList.remove("hidden");
}

function calculateGPA(courseCount) {
  let totalPoints = 0;
  let totalCredits = 0;

  for (let i = 0; i < courseCount; i++) {
    const credits = parseFloat(document.querySelector(`[name="credits${i}"]`).value);
    const grade = document.querySelector(`[name="grade${i}"]`).value;
    const points = gradeScale[grade];

    totalPoints += credits * points;
    totalCredits += credits;
  }

  const gpa = (totalPoints / totalCredits).toFixed(2);
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `Your GPA is <strong>${gpa}</strong>`;

  if (gpa >= 3.75) {
    resultDiv.innerHTML += `<br><span style="color: gold; font-weight: bold;">You made Honor Roll!</span>`;
  }

  resultDiv.classList.remove("hidden");

  // Log GPA result
  const username = localStorage.getItem("username");
  const timestamp = new Date().toISOString();

  fetch("https://api.ipify.org?format=json")
    .then(res => res.json())
    .then(data => {
      const ip = data.ip;
      const browser = navigator.userAgent;

      fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          gpa: gpa,
          ip: ip,
          browser: browser,
          time: timestamp,
          type: "result"
        }),
      });
    });
}


