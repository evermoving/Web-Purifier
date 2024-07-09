let websiteGroups = {};
let wordGroups = {};
let assignments = {};

document.addEventListener('DOMContentLoaded', () => {
  loadOptions();
  
  document.getElementById('add-website').addEventListener('click', addWebsite);
  document.getElementById('save-website-group').addEventListener('click', saveWebsiteGroup);
  document.getElementById('add-word').addEventListener('click', addWord);
  document.getElementById('save-word-group').addEventListener('click', saveWordGroup);
  document.getElementById('save-assignment').addEventListener('click', saveAssignment);
});

async function loadOptions() {
  const result = await browser.storage.local.get(['websiteGroups', 'wordGroups', 'assignments']);
  websiteGroups = result.websiteGroups || {};
  wordGroups = result.wordGroups || {};
  assignments = result.assignments || {};
  
  updateWebsiteGroups();
  updateWordGroups();
  updateAssignments();
}

function updateWebsiteGroups() {
  const container = document.getElementById('website-groups');
  container.innerHTML = '';
  
  for (const [groupName, websites] of Object.entries(websiteGroups)) {
    const groupDiv = document.createElement('div');
    groupDiv.innerHTML = `
      <h3>${groupName}</h3>
      <ul>
        ${websites.map(website => `<li>${website}</li>`).join('')}
      </ul>
    `;
    container.appendChild(groupDiv);
  }
  
  updateWebsiteGroupSelect();
}

function updateWordGroups() {
  const container = document.getElementById('word-groups');
  container.innerHTML = '';
  
  for (const [groupName, words] of Object.entries(wordGroups)) {
    const groupDiv = document.createElement('div');
    groupDiv.innerHTML = `
      <h3>${groupName}</h3>
      <ul>
        ${words.map(word => `<li>${word}</li>`).join('')}
      </ul>
    `;
    container.appendChild(groupDiv);
  }
  
  updateWordGroupSelect();
}

function updateAssignments() {
  const container = document.getElementById('assignments');
  container.innerHTML = '';
  
  for (const [websiteGroup, wordGroupList] of Object.entries(assignments)) {
    const assignmentDiv = document.createElement('div');
    assignmentDiv.innerHTML = `
      <h3>${websiteGroup}</h3>
      <ul>
        ${wordGroupList.map(wordGroup => `<li>${wordGroup}</li>`).join('')}
      </ul>
    `;
    container.appendChild(assignmentDiv);
  }
}

function updateWebsiteGroupSelect() {
  const select = document.getElementById('website-group-select');
  select.innerHTML = '';
  
  for (const groupName of Object.keys(websiteGroups)) {
    const option = document.createElement('option');
    option.value = groupName;
    option.textContent = groupName;
    select.appendChild(option);
  }
}

function updateWordGroupSelect() {
  const select = document.getElementById('word-group-select');
  select.innerHTML = '';
  
  for (const groupName of Object.keys(wordGroups)) {
    const option = document.createElement('option');
    option.value = groupName;
    option.textContent = groupName;
    select.appendChild(option);
  }
}

function addWebsite() {
  const websiteInput = document.getElementById('new-website');
  const website = websiteInput.value.trim();
  
  if (website) {
    const groupName = document.getElementById('new-website-group').value.trim();
    if (!websiteGroups[groupName]) {
      websiteGroups[groupName] = [];
    }
    websiteGroups[groupName].push(website);
    websiteInput.value = '';
    updateWebsiteGroups();
  }
}

function saveWebsiteGroup() {
  browser.storage.local.set({ websiteGroups });
}

function addWord() {
  const wordInput = document.getElementById('new-word');
  const word = wordInput.value.trim();
  
  if (word) {
    const groupName = document.getElementById('new-word-group').value.trim();
    if (!wordGroups[groupName]) {
      wordGroups[groupName] = [];
    }
    wordGroups[groupName].push(word);
    wordInput.value = '';
    updateWordGroups();
  }
}

function saveWordGroup() {
  browser.storage.local.set({ wordGroups });
}

function saveAssignment() {
  const websiteGroup = document.getElementById('website-group-select').value;
  const wordGroupSelect = document.getElementById('word-group-select');
  const selectedWordGroups = Array.from(wordGroupSelect.selectedOptions).map(option => option.value);
  
  if (websiteGroup && selectedWordGroups.length > 0) {
    assignments[websiteGroup] = selectedWordGroups;
    updateAssignments();
    browser.storage.local.set({ assignments });
  }
}