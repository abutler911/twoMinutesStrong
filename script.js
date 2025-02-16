const calendarGrid = document.getElementById("calendar-grid");
const totalTimeDisplay = document.getElementById("total-time");
const today = new Date();
const plankedDays = JSON.parse(localStorage.getItem("plankedDays")) || {};

// Array of month names
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Function to calculate total plank time
function calculateTotalTime() {
  const totalMinutes = Object.keys(plankedDays).length * 2;
  totalTimeDisplay.textContent = totalMinutes;
}

// Function to generate the calendar grid
function generateCalendar() {
  let currentMonth = "";

  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + i
    );
    const dayNumber = currentDate.getDate();
    const monthName = monthNames[currentDate.getMonth()];
    const dateKey = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()}`;

    // Create new row for a new month
    if (currentMonth !== monthName) {
      currentMonth = monthName;
      const monthHeader = document.createElement("div");
      monthHeader.classList.add("month-header");
      monthHeader.textContent = monthName;
      calendarGrid.appendChild(monthHeader);
    }

    // Create day box
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");
    gridItem.innerHTML = `<strong>${dayNumber}</strong>`;

    // Highlight current day
    if (i === 0) {
      gridItem.classList.add("current-day");
    }

    // Check if the day was already planked
    if (plankedDays[dateKey]) {
      gridItem.classList.add("planked");
    }

    // Add click event listener
    gridItem.addEventListener("click", () => {
      gridItem.classList.toggle("planked");

      if (gridItem.classList.contains("planked")) {
        plankedDays[dateKey] = true;
      } else {
        delete plankedDays[dateKey];
      }

      localStorage.setItem("plankedDays", JSON.stringify(plankedDays));
      calculateTotalTime();
    });

    calendarGrid.appendChild(gridItem);
  }
}

generateCalendar();
calculateTotalTime();
