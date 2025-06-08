let userName = '';
const gradesMap = {
  'A+': 4.33, 'A': 4.00, 'A-': 3.67,
  'B+': 3.33, 'B': 3.00, 'B-': 2.67,
  'C+': 2.33, 'C': 2.00, 'C-': 1.67,
  'D': 1.00, 'F': 0.00
};
document.addEventListener('DOMContentLoaded', () => {
  const userNameInputDiv = document.getElementById('userNameInput');
  const courseCountInputDiv = document.getElementById('courseCountInput');
  const coursesForm = document.getElementById('coursesForm');
  const coursesContainer = document.getElementById('coursesContainer');
  const resultDiv = document.getElementById('result');
  document.getElementById('startBtn').addEventListener('click', () => {
    const input = document.getElementById('userName').value.trim();
    if (input === '') {
      alert('Please enter your name');
      return;
    }
    userName = input;
    userNameInputDiv.style.display = 'none';
    courseCountInputDiv.style.display = 'block';
  });
  document.getElementById('courseCountBtn').addEventListener('click', () => {
    const count = parseInt(document.getElementById('courseCount').value);
    if (isNaN(count) || count < 1 || count > 20) {
      alert('Please enter a valid number of courses (1-20)');
      return;
    }
    courseCountInputDiv.style.display = 'none';
    coursesForm.style.display = 'block';
    coursesContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const div = document.createElement('div');
      div.classList.add('input-section');
      div.innerHTML = `
        <label>Course ${i + 1} Name:</label>
        <input type="text" name="courseName${i}" required placeholder="Course name" />
        <label>Credits:</label>
        <select name="credits${i}" required>
          <option value="0.5">0.5</option>
          <option value="1" selected>1</option>
          <option value="1.5">1.5</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <label>Grade:</label>
        <select name="grade${i}" required>
          <option value="A+">A+</option>
          <option value="A">A</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B">B</option>
          <option value="B-">B-</option>
          <option value="C+">C+</option>
          <option value="C">C</option>
          <option value="C-">C-</option>
          <option value="D">D</option>
          <option value="F">F</option>
        </select>
      `;
      coursesContainer.appendChild(div);
    }
  });
  coursesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let totalPoints = 0;
    let totalCredits = 0;
    const formData = new FormData(coursesForm);
    const count = coursesContainer.children.length;
    for(let i=0; i < count; i++){
      const grade = formData.get('grade'+i);
      const credits = parseFloat(formData.get('credits'+i));
      if (!gradesMap[grade]) {
        alert('Invalid grade for course ' + (i+1));
        return;
      }
      totalPoints += gradesMap[grade] * credits;
      totalCredits += credits;
    }
    const gpa = totalPoints / totalCredits;
    let honorRollMsg = gpa >= 3.75 ? "<br><strong>Congratulations! You made Honor Roll.</strong>" : "";
    resultDiv.innerHTML = `${userName}, your GPA is ${gpa.toFixed(2)}${honorRollMsg}`;
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => {
        const visitData = new FormData();
        visitData.append('name', userName);
        visitData.append('ip', data.ip);
        visitData.append('browser', navigator.userAgent);
        visitData.append('gpa', gpa.toFixed(2));
        fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
          method: 'POST',
          body: visitData
        });
      });
  });
});