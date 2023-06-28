function getSiteName() {
  var siteName = document.querySelector('meta[property="og:site_name"]');
  return siteName ? siteName.getAttribute('content') : '';
}

chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Get site name.
    const [res] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: getSiteName,
    });

    const { result: siteName } = res;

    const use12FtService = (url) =>
      `https://12ft.io/proxy?q=${encodeURIComponent(url)}`;

    const checkIsMediumSite = (siteName) => siteName === 'Medium';

    if (checkIsMediumSite(siteName)) {
      console.log('Medium site detected. Removing Paywall.');
      chrome.tabs.update(tab.id, { url: use12FtService(tab.url) });
      return;
    }
    return;
  } catch (e) {
    console.log('Captured Error', e);
  }
});
