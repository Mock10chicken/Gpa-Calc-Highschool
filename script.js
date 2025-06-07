const setupForm = document.getElementById("setup-form");
const gradesForm = document.getElementById("grades-form");
const gradeInputs = document.getElementById("grade-inputs");
const resultDiv = document.getElementById("result");

const gradeValues = {
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

setupForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const count = parseInt(document.getElementById("course-count").value);
  gradeInputs.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const select = document.createElement("select");
    select.name = "grade";
    select.required = true;
    for (const grade in gradeValues) {
      const option = document.createElement("option");
      option.value = grade;
      option.textContent = grade;
      select.appendChild(option);
    }
    gradeInputs.appendChild(document.createElement("br"));
    gradeInputs.appendChild(select);
  }
  setupForm.style.display = "none";
  gradesForm.style.display = "block";
});

gradesForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const selects = document.getElementsByName("grade");
  let total = 0;
  for (const select of selects) {
    total += gradeValues[select.value];
  }
  const gpa = total / selects.length;
  resultDiv.textContent = `Your GPA is ${gpa.toFixed(2)}`;
  if (gpa >= 3.75) {
    const honorMsg = document.createElement("p");
    honorMsg.textContent = "Congratulations! You made the Honor Roll!";
    honorMsg.style.color = "#ffa500";
    honorMsg.style.fontWeight = "bold";
    resultDiv.appendChild(honorMsg);
  }
});
