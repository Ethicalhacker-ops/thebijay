// Real-time clock
function updateClock() {
  const clockElement = document.getElementById('clock');
  if (clockElement) {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const day = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    clockElement.textContent = `${day}, ${date} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
  }
}
setInterval(updateClock, 1000);
updateClock();