const startBtn = document.getElementById("startBtn");
const courseCountSection = document.getElementById("courseCountSection");
const generateCoursesBtn = document.getElementById("generateCoursesBtn");
const coursesContainer = document.getElementById("coursesContainer");
const gpaForm = document.getElementById("gpaForm");
const resultDiv = document.getElementById("result");
const aiAssistant = document.getElementById("aiAssistant");

let userName = "";

// Step 1: Enter Name
startBtn.addEventListener("click", () => {
  userName = document.getElementById("username").value.trim();
  if (!userName) return alert("Please enter your name.");
  document.getElementById("nameSection").style.display = "none";
  courseCountSection.style.display = "block";
});

// Step 2: Enter Number of Courses
generateCoursesBtn.addEventListener("click", () => {
  const count = parseInt(document.getElementById("courseCount").value);
  if (isNaN(count) || count <= 0) return alert("Enter a valid number of courses.");

  coursesContainer.innerHTML = "";
  for (let i = 0; i < count; i++) {
    coursesContainer.innerHTML += `
      <div class="course">
        <input type="text" placeholder="Course name" required />
        <select class="credits">
          <option value="1">1 Credit</option>
          <option value="0.5">0.5 Credit</option>
        </select>
        <select class="grade">
          <option value="4.33">A+</option>
          <option value="4.00">A</option>
          <option value="3.67">A-</option>
          <option value="3.33">B+</option>
          <option value="3.00">B</option>
          <option value="2.67">B-</option>
          <option value="2.33">C+</option>
          <option value="2.00">C</option>
          <option value="1.67">C-</option>
          <option value="1.00">D</option>
          <option value="0.00">F</option>
        </select>
        <label><input type="checkbox" class="honors"> Honors/AP</label>
      </div>
    `;
  }
  courseCountSection.style.display = "none";
  gpaForm.style.display = "block";
});

// Step 3: Calculate GPA
gpaForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let totalPoints = 0, totalCredits = 0;
  const courseDivs = document.querySelectorAll(".course");

  courseDivs.forEach(course => {
    const credits = parseFloat(course.querySelector(".credits").value);
    let gradePoints = parseFloat(course.querySelector(".grade").value);
    if (course.querySelector(".honors").checked) gradePoints += 1.0;
    totalPoints += gradePoints * credits;
    totalCredits += credits;
  });

  const gpa = (totalPoints / totalCredits).toFixed(2);
  resultDiv.innerHTML = `<strong>Your GPA: ${gpa}</strong><br>${gpa >= 3.75 ? "🎉 You made Honor Roll!" : ""}`;
  aiAssistant.style.display = "block";

  // Log to Google Sheet
  try {
    await fetch("https://script.google.com/macros/s/AKfycbySAjsx7i_ArjvqTFFd3-kZpgXt4s02pclPNQJC4Dz6KDAE9YofWAmJktApjDHXMYAo/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userName,
        gpa,
        browser: navigator.userAgent,
        ip: "Logged by Google Script"
      })
    });
  } catch (err) {
    console.error("Logging failed:", err);
  }
});

// Step 4: AI Assistant
document.getElementById("askBtn").addEventListener("click", async () => {
  const question = document.getElementById("questionInput").value;
  if (!question) return alert("Please ask a question.");

  document.getElementById("aiResponse").innerText = "Thinking...";

  try {
    const response = await fetch("/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gpa: document.querySelector("#result strong").innerText, question })
    });
    const data = await response.json();
    document.getElementById("aiResponse").innerText = data.answer;
  } catch (err) {
    document.getElementById("aiResponse").innerText = "Error contacting AI assistant.";
    console.error(err);
  }
});
