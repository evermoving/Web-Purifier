document.addEventListener('DOMContentLoaded', () => {
    const enableToggle = document.getElementById('enable-toggle');
    const openOptionsButton = document.getElementById('open-options');
  
    browser.storage.local.get('enabled', (result) => {
      enableToggle.checked = result.enabled !== false;
    });
  
    enableToggle.addEventListener('change', () => {
      browser.storage.local.set({ enabled: enableToggle.checked });
      browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, { action: 'checkAndHide' });
      });
    });
  
    openOptionsButton.addEventListener('click', () => {
      browser.runtime.openOptionsPage();
    });
  });