browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.set({
    enabled: false,
    websiteGroups: {},
    wordGroups: {},
    assignments: {}
  });
});

browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.enabled) {
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
    browser.storage.local.get('enabled', (result) => {
      if (result.enabled) {
        browser.tabs.executeScript(tabId, { file: 'content.js' });
      }
    });
  }
});