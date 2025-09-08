document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const numCoursesInput = document.getElementById("numCourses");
  const coursesContainer = document.getElementById("coursesContainer");
  const calculateBtn = document.getElementById("calculateBtn");
  const resultDiv = document.getElementById("result");

  const gradeScale = {
    "A+": 4.33, "A": 4.0, "A-": 3.67,
    "B+": 3.33, "B": 3.0, "B-": 2.67,
    "C+": 2.33, "C": 2.0, "C-": 1.67,
    "D": 1.0, "F": 0.0
  };

  let username = "";

  startBtn.addEventListener("click", () => {
    username = document.getElementById("username").value.trim();
    const numCourses = parseInt(numCoursesInput.value);
    coursesContainer.innerHTML = "";

    for (let i = 0; i < numCourses; i++) {
      const div = document.createElement("div");
      div.innerHTML = `
        <input type="text" placeholder="Course Name">
        <select class="credits">
          <option value="2">2</option>
          <option value="4">4</option>
        </select>
        <select class="grade">
          ${Object.keys(gradeScale).map(g => `<option value="${g}">${g}</option>`).join("")}
        </select>
      `;
      coursesContainer.appendChild(div);
    }

    calculateBtn.style.display = "block";
  });

  calculateBtn.addEventListener("click", () => {
    const creditEls = document.querySelectorAll(".credits");
    const gradeEls = document.querySelectorAll(".grade");

    let totalPoints = 0;
    let totalCredits = 0;

    creditEls.forEach((creditEl, index) => {
      const credits = parseFloat(creditEl.value);
      const grade = gradeEls[index].value;
      totalPoints += gradeScale[grade] * credits;
      totalCredits += credits;
    });

    const gpa = (totalPoints / totalCredits).toFixed(2);
    const honorRoll = gpa >= 3.75;

    resultDiv.innerHTML = `<p>Your GPA is <strong>${gpa}</strong></p>` +
      (honorRoll ? `<p>🎉 Congratulations! You made the Honor Roll! 🎉</p>` : "");

    // Log to Google Sheets
    fetch("https://script.google.com/macros/s/AKfycbwxLoUnkibYb7E79xu6jWT-NwmrlAsc5galLYnr5Wrer6uJdHMpgkGG0c-3SWVnC9Vz/exec", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: username,
        gpa: gpa,
        honorRoll: honorRoll,
        ip: "", // Will be filled in by Google Apps Script if you use e.context.clientIp
        browser: navigator.userAgent
      })
    }).catch(err => console.error("Logging error:", err));
  });
});
