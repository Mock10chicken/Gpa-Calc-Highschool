document.getElementById("startBtn").addEventListener("click", function () {
  const courseCount = document.getElementById("courseCount").value;
  const container = document.getElementById("courseInputs");
  container.innerHTML = "";

  if (!courseCount || courseCount < 1) {
    alert("Enter a valid number of courses");
    return;
  }

  for (let i = 1; i <= courseCount; i++) {
    const div = document.createElement("div");
    div.innerHTML = `
      <label>Course ${i}:</label>
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
      <select class="credits">
        <option value="1">1.0 Credit</option>
        <option value="0.5">0.5 Credit</option>
      </select>
      <label>
        <input type="checkbox" class="honors"> Honors/AP
      </label>
      <br><br>
    `;
    container.appendChild(div);
  }

  document.getElementById("calculateBtn").style.display = "block";
});

document.getElementById("calculateBtn").addEventListener("click", function () {
  const grades = document.querySelectorAll(".grade");
  const credits = document.querySelectorAll(".credits");
  const honors = document.querySelectorAll(".honors");

  let totalPoints = 0;
  let totalCredits = 0;

  grades.forEach((grade, i) => {
    let g = parseFloat(grade.value);
    if (honors[i].checked) g += 1.0;
    let c = parseFloat(credits[i].value);
    totalPoints += g * c;
    totalCredits += c;
  });

  const gpa = (totalPoints / totalCredits).toFixed(2);
  const result = document.getElementById("gpaResult");
  result.textContent = `Your GPA is ${gpa}`;

  if (gpa >= 3.75) result.textContent += " 🎉 You made Honor Roll!";

  // Send data to Google Sheets
  fetch("YOUR_GOOGLE_SCRIPT_URL", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("username").value,
      gpa: gpa,
      browser: navigator.userAgent,
    }),
  });

});

document.getElementById("askBtn").addEventListener("click", async function () {
  const gpa = document.getElementById("gpaResult").textContent.match(/[\d.]+/);
  const question = document.getElementById("questionInput").value;
  const responseBox = document.getElementById("aiResponse");

  if (!gpa || !question) {
    responseBox.textContent = "Please calculate GPA first and enter a question.";
    return;
  }

  responseBox.textContent = "Thinking...";

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gpa: gpa[0], question }),
    });

    const data = await res.json();
    responseBox.textContent = data.answer || "Error: " + data.error;
  } catch (err) {
    responseBox.textContent = "Error contacting AI assistant.";
  }
});
