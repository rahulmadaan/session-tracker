let sessionInterval = "???";
const startTimer = () => {
  let timestamp = +localStorage.getItem("lastLogin");
  const interval = setInterval(() => {
    sessionInterval = interval;
    let minutes = parseInt(timestamp / 60, 10);
    let seconds = parseInt(timestamp % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    chrome.browserAction.setBadgeText({ text: `${minutes}:${seconds}` });
    if (--timestamp < 0) {
      clearInterval(interval);
    }
  }, 1000);
};

const ifTarget = url =>
  url.match(/https\:\/\/pf-corp.auth0.com\/login\/callback/g);

const monitorTab = tabInfo => {
  if (ifTarget(tabInfo.url)) {
    localStorage.setItem("lastLogin", 15 * 60);
    if (sessionInterval != "???") {
      clearInterval(sessionInterval);
    }
    startTimer();
  }
};

const setupTabListener = () => {
  chrome.tabs.onUpdated.addListener((tabId, tabInfo, tab) => {
    monitorTab(tabInfo);
  });
};

const setupTimer = () => chrome.browserAction.setBadgeText({ text: "?" });

const initialize = () => {
  setupTimer();
  setupTabListener();
};

window.onload = initialize;
