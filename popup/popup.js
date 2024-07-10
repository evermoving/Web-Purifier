document.addEventListener('DOMContentLoaded', () => {
  const enableToggle = document.getElementById('enable-toggle');
  const openOptionsButton = document.getElementById('open-options');

  // Load the current state
  browser.storage.local.get('enabled', (result) => {
    enableToggle.checked = result.enabled !== false;
  });

  // Update the state when the toggle is changed
  enableToggle.addEventListener('change', () => {
    browser.storage.local.set({ enabled: enableToggle.checked });
    updateContentScript();
  });

  // Open the options page when the button is clicked
  openOptionsButton.addEventListener('click', () => {
    browser.runtime.openOptionsPage();
  });
});

function updateContentScript() {
  browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    browser.tabs.sendMessage(tabs[0].id, { action: 'updateState' });
  });
}