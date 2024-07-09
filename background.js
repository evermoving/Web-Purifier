browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.set({
    enabled: true,
    websiteGroups: {},
    wordGroups: {},
    assignments: {}
  });
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    browser.tabs.sendMessage(tabId, { action: 'checkAndHide' });
  }
});