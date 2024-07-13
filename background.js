browser.runtime.onInstalled.addListener(() => {
  browser.storage.sync.get(['enabled', 'websiteGroups', 'wordGroups', 'assignments'], (result) => {
    if (Object.keys(result).length === 0) {
      browser.storage.sync.set({
        enabled: false,
        websiteGroups: {},
        wordGroups: {},
        assignments: { 'All websites': [] }
      });
    }
  });
});

browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.enabled) {
    updateContentScript(changes.enabled.newValue);
  }
});

function updateContentScript(enabled) {
  if (enabled) {
    browser.tabs.query({}, (tabs) => {
      for (let tab of tabs) {
        browser.tabs.executeScript(tab.id, { file: 'content.js' });
      }
    });
  } else {
    browser.tabs.query({}, (tabs) => {
      for (let tab of tabs) {
        browser.tabs.sendMessage(tab.id, { action: 'disable' });
      }
    });
  }
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    browser.storage.sync.get('enabled', (result) => {
      if (result.enabled) {
        browser.tabs.executeScript(tabId, { file: 'content.js' });
      }
    });
  }
});