import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      Notiflix.Notify.failure('Te rog alege o dată din viitor');
      document.querySelector('[data-start]').disabled = true; // Dezactivați butonul "Start"
    } else {
      document.querySelector('[data-start]').disabled = false; // Activați butonul "Start"
    }
  },
};

flatpickr('#datetime-picker', options);

const timerFields = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let timerInterval;

function startTimer(timeRemaining) {
  clearInterval(timerInterval);

  function updateTimerDisplay() {
    const { days, hours, minutes, seconds } = convertMs(timeRemaining);

    timerFields.days.textContent = addLeadingZero(days);
    timerFields.hours.textContent = addLeadingZero(hours);
    timerFields.minutes.textContent = addLeadingZero(minutes);
    timerFields.seconds.textContent = addLeadingZero(seconds);

    timeRemaining -= 1000;

    if (timeRemaining < 0) {
      clearInterval(timerInterval);
      Notiflix.Notify.success('Timer has ended!');
    }
  }

  updateTimerDisplay();
  timerInterval = setInterval(updateTimerDisplay, 1000);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

document.querySelector('[data-start]').addEventListener('click', () => {
  const selectedDate = flatpickr.parseDate(
    document.querySelector('#datetime-picker').value,
    'Y-m-d H:i'
  );
  const currentDate = new Date();

  if (selectedDate <= currentDate) {
    Notiflix.Notify.failure('Please choose a date in the future');
    return;
  }

  const timeRemaining = selectedDate - currentDate;
  startTimer(timeRemaining);
});
