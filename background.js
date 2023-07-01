function getSiteName() {
  var siteName = document.querySelector('meta[property="og:site_name"]');
  return siteName ? siteName.getAttribute('content') : '';
}

const checkIsMediumSite = (siteName) => siteName === 'Medium';

const use12FtService = (url) =>
  `https://12ft.io/proxy?q=${encodeURIComponent(url)}`;

chrome.tabs.onActivated.addListener(checkSiteAndEnableExtension);

async function checkSiteAndEnableExtension({ tabId }) {
  if (tabId) {
    try {
      const [res] = await chrome.scripting.executeScript({
        target: { tabId },
        func: getSiteName,
      });

      if (checkIsMediumSite(res.result)) {
        console.log('Medium site detected. Enabling extension.');
        chrome.action.enable();
        chrome.action.setIcon({ path: 'images/enabled_icon.png' });
      } else {
        chrome.action.setIcon({ path: 'images/disabled_icon.png' });
        chrome.action.disable();
      }
    } catch (e) {
      chrome.action.disable();
      console.log('Captured Error', e);
      chrome.action.setIcon({ path: 'images/disabled_icon.png' });
    }
  }
}

chrome.action.onClicked.addListener(async (tab) => {
  try {
    if (chrome.action.isEnabled()) {
      chrome.tabs.update(tab.id, { url: use12FtService(tab.url) });
      return;
    }
    return;
  } catch (e) {
    console.log('Captured Error', e);
  }
});

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  if (tab.active && changeInfo.status === 'complete' && tab.url)
    checkSiteAndEnableExtension({ tabId });
});
