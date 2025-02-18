const calendarGrid = document.getElementById("calendar-grid");
const totalTimeDisplay = document.getElementById("total-time");

const startDate = new Date(2025, 1, 16);

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

function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notifications enabled!");
        alert("Notifications are enabled! You will get daily plank reminders.");
        scheduleDailyReminder();
      } else {
        console.log("Notifications denied!");
        alert("You need to enable notifications for reminders.");
      }
    });
  } else {
    console.log("This browser does not support notifications.");
    alert("Your browser does not support notifications.");
  }
}

const notificationButton = document.getElementById("enable-notifications");
if (notificationButton) {
  notificationButton.addEventListener("click", requestNotificationPermission);
}

// Function to calculate total plank time
function calculateTotalTime() {
  const totalMinutes = Object.keys(plankedDays).length * 2;
  totalTimeDisplay.textContent = totalMinutes;
}

// Function to generate the calendar grid
function generateCalendar() {
  let currentMonth = "";

  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

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

    // Highlight the start day (Feb 16)
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

// Function to send a plank reminder
function sendPlankReminder() {
  if (Notification.permission === "granted") {
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;

    if (!plankedDays[dateKey]) {
      new Notification("Plank Reminder", {
        body: "Don't forget to plank today! 💪",
        icon: "https://abutler911.github.io/twoMinutesStrong",
      });
    }
  }
}

// Function to schedule a daily notification (Runs at 9 AM)
function scheduleDailyReminder() {
  const now = new Date();
  const nextReminder = new Date();

  nextReminder.setHours(9, 0, 0, 0);

  if (now > nextReminder) {
    nextReminder.setDate(nextReminder.getDate() + 1);
  }

  const timeUntilNextReminder = nextReminder - now;

  setTimeout(() => {
    sendPlankReminder();
    setInterval(sendPlankReminder, 86400000);
  }, timeUntilNextReminder);
}

// Generate the calendar
generateCalendar();
calculateTotalTime();
