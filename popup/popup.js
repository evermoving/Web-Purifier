document.addEventListener('DOMContentLoaded', () => {
  const enableToggle = document.getElementById('enable-toggle');
  const openOptionsButton = document.getElementById('open-options');

  // Load the current state
  browser.storage.sync.get('enabled', (result) => {
    enableToggle.checked = result.enabled === true;
  });

  // Update the state when the toggle is changed
  enableToggle.addEventListener('change', () => {
    browser.storage.sync.set({ enabled: enableToggle.checked });
  });

  // Open the options page when the button is clicked
  openOptionsButton.addEventListener('click', () => {
    browser.runtime.openOptionsPage();
  });
});