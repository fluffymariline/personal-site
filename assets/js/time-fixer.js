const updateTime = function (time) {
  const date = new Date(Date.parse(time));
  return date.toLocaleString();
};
/** @param {HTMLElement} el */
const updateTimeEl = function (el) {
  /** @type {string} */
  const input = el.dataset["time"];
  el.innerText = updateTime(input);
};

const updateAllTimeElements = function () {
  const times = document.querySelectorAll(".time-update");
  for (let i = 0; i < times.length; i++) {
    updateTimeEl(times[i]);
  }
};

updateAllTimeElements();
