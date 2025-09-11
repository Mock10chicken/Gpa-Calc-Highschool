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

    if (!username) {
      alert("Please enter your name first.");
      return;
    }
    if (!numCourses || numCourses <= 0) {
      alert("Please enter a valid number of courses.");
      return;
    }

    for (let i = 0; i < numCourses; i++) {
      const div = document.createElement("div");
      div.classList.add("course-item");
      div.innerHTML = `
        <input type="text" class="course-name" placeholder="Course Name">
        <select class="credits">
          <option value="1">1.0</option>
          <option value="0.5">0.5</option>
        </select>
        <select class="grade">
          ${Object.keys(gradeScale).map(g => `<option value="${g}">${g}</option>`).join("")}
        </select>
        <label>
          <input type="checkbox" class="honors"> Honors/AP
        </label>
      `;
      coursesContainer.appendChild(div);
    }

    calculateBtn.style.display = "block";
  });

  calculateBtn.addEventListener("click", () => {
    const creditEls = document.querySelectorAll(".credits");
    const gradeEls = document.querySelectorAll(".grade");
    const honorsEls = document.querySelectorAll(".honors");
    const courseNames = document.querySelectorAll(".course-name");

    let totalPoints = 0;
    let totalCredits = 0;
    let courseData = [];

    creditEls.forEach((creditEl, index) => {
      const credits = parseFloat(creditEl.value);
      let gradeValue = gradeScale[gradeEls[index].value];

      // Boost grade by +1.00 if Honors/AP is checked
      if (honorsEls[index].checked) {
        gradeValue = Math.min(gradeValue + 1.0, 5.33); // cap at 5.33 (A+ boosted)
      }

      totalPoints += gradeValue * credits;
      totalCredits += credits;

      courseData.push({
        name: courseNames[index].value || `Course ${index + 1}`,
        credits: credits,
        grade: gradeEls[index].value,
        honors: honorsEls[index].checked
      });
    });

    const gpa = (totalPoints / totalCredits).toFixed(2);
    const honorRoll = gpa >= 3.75;

    resultDiv.innerHTML = `<p>Your GPA is <strong>${gpa}</strong></p>` +
      (honorRoll ? `<p>🎉 Congratulations! You made the Honor Roll! 🎉</p>` : "");

    // ✅ Send to Google Sheet
    fetch("https://script.google.com/macros/s/AKfycbySAjsx7i_ArjvqTFFd3-kZpgXt4s02pclPNQJC4Dz6KDAE9YofWAmJktApjDHXMYAo/exec", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: username,
        gpa: gpa,
        honorRoll: honorRoll,
        browser: navigator.userAgent,
        courses: courseData
      })
    }).catch(err => console.error("Logging error:", err));
  });
});
