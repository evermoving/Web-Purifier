let observer;

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'disable') {
    if (observer) {
      observer.disconnect();
    }
    // Remove any hiding styles that were applied
    const elements = document.body.getElementsByTagName('*');
    for (const element of elements) {
      if (element.style.display === 'none') {
        element.style.display = '';
      }
    }
  }
});

async function hideElements() {
  const { enabled, websiteGroups, wordGroups, assignments } = await browser.storage.sync.get([
    'enabled',
    'websiteGroups',
    'wordGroups',
    'assignments'
  ]);

  if (!enabled) return;

  const currentUrl = window.location.hostname;
  const applicableWebsiteGroups = Object.keys(websiteGroups).filter(group =>
    websiteGroups[group].some(url => currentUrl.includes(url))
  );

  // Include 'All websites' group
  applicableWebsiteGroups.push('All websites');

  const applicableWordGroups = applicableWebsiteGroups.flatMap(group => assignments[group] || []);
  const keywords = applicableWordGroups.flatMap(group => wordGroups[group] || []);

  const elements = document.body.getElementsByTagName('*');
  for (const element of elements) {
    if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
      const text = element.textContent.toLowerCase();
      if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
        element.style.display = 'none';
      }
    }
  }
}

// Initial check when the page loads
hideElements();

// Set up a MutationObserver to check for dynamically added content
observer = new MutationObserver(hideElements);
observer.observe(document.body, { childList: true, subtree: true });