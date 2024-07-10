let websiteGroups = {};
let wordGroups = {};
let assignments = {};

document.addEventListener('DOMContentLoaded', () => {
  loadOptions();
  
  document.getElementById('add-website').addEventListener('click', addWebsite);
  document.getElementById('add-word').addEventListener('click', addWord);
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
    groupDiv.className = 'card mb-3';
    groupDiv.innerHTML = `
      <div class="card-header d-flex justify-content-between align-items-center">
        <input type="text" class="form-control w-auto" value="${groupName}" data-original="${groupName}">
        <button class="btn btn-danger btn-sm delete-group-btn">Delete group</button>
      </div>
      <ul class="list-group list-group-flush"></ul>
      <div class="card-footer">
        <button class="btn btn-secondary btn-sm add-url-btn">Add URL</button>
      </div>
    `;
    container.appendChild(groupDiv);

    const input = groupDiv.querySelector('input');
    input.addEventListener('change', () => updateGroupName('website', groupName, input.value));

    const deleteBtn = groupDiv.querySelector('.delete-group-btn');
    deleteBtn.addEventListener('click', () => deleteGroup('website', groupName));

    const websiteList = groupDiv.querySelector('.list-group');
    websites.forEach(website => {
      const listItem = createWebsiteListItem(groupName, website);
      websiteList.appendChild(listItem);
    });

    const addUrlBtn = groupDiv.querySelector('.add-url-btn');
    addUrlBtn.addEventListener('click', () => addUrlToGroup(groupName, websiteList));
  }
}

function createWebsiteListItem(groupName, website) {
  const listItem = document.createElement('li');
  listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
  listItem.innerHTML = `
    <input type="text" class="form-control w-75" value="${website}">
    <button class="btn btn-danger btn-sm delete-url-btn">Delete URL</button>
  `;

  const websiteInput = listItem.querySelector('input');
  websiteInput.addEventListener('change', () => updateWebsite(groupName, website, websiteInput.value));

  const deleteUrlBtn = listItem.querySelector('.delete-url-btn');
  deleteUrlBtn.addEventListener('click', () => deleteWebsite(groupName, website));

  return listItem;
}

function updateWordGroups() {
  const container = document.getElementById('word-groups');
  container.innerHTML = '';
  
  for (const [groupName, words] of Object.entries(wordGroups)) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'card mb-3';
    groupDiv.innerHTML = `
      <div class="card-header d-flex justify-content-between align-items-center">
        <input type="text" class="form-control w-auto" value="${groupName}" data-original="${groupName}">
        <button class="btn btn-danger btn-sm delete-group-btn">Delete group</button>
      </div>
      <ul class="list-group list-group-flush"></ul>
      <div class="card-footer">
        <button class="btn btn-secondary btn-sm add-word-btn">Add Word</button>
      </div>
    `;
    container.appendChild(groupDiv);

    const input = groupDiv.querySelector('input');
    input.addEventListener('change', () => updateGroupName('word', groupName, input.value));

    const deleteBtn = groupDiv.querySelector('.delete-group-btn');
    deleteBtn.addEventListener('click', () => deleteGroup('word', groupName));

    const wordList = groupDiv.querySelector('.list-group');
    words.forEach(word => {
      const listItem = createWordListItem(groupName, word);
      wordList.appendChild(listItem);
    });

    const addWordBtn = groupDiv.querySelector('.add-word-btn');
    addWordBtn.addEventListener('click', () => addWordToGroup(groupName, wordList));
  }
}

function createWordListItem(groupName, word) {
  const listItem = document.createElement('li');
  listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
  listItem.innerHTML = `
    <input type="text" class="form-control w-75" value="${word}">
    <button class="btn btn-danger btn-sm delete-word-btn">Delete word</button>
  `;

  const wordInput = listItem.querySelector('input');
  wordInput.addEventListener('change', () => updateWord(groupName, word, wordInput.value));

  const deleteWordBtn = listItem.querySelector('.delete-word-btn');
  deleteWordBtn.addEventListener('click', () => deleteWord(groupName, word));

  return listItem;
}

function updateAssignments() {
  const container = document.getElementById('assignments');
  container.innerHTML = '';
  
  for (const websiteGroup of Object.keys(websiteGroups)) {
    const assignmentDiv = document.createElement('div');
    assignmentDiv.className = 'col-md-6 mb-3';
    assignmentDiv.innerHTML = `
      <div class="card">
        <div class="card-header">${websiteGroup}</div>
        <div class="card-body">
          <div class="word-group-list d-flex flex-wrap gap-2"></div>
        </div>
      </div>
    `;
    container.appendChild(assignmentDiv);

    const wordGroupListDiv = assignmentDiv.querySelector('.word-group-list');
    Object.keys(wordGroups).forEach(wordGroup => {
      const wordGroupTag = document.createElement('span');
      wordGroupTag.className = `badge ${assignments[websiteGroup]?.includes(wordGroup) ? 'bg-primary' : 'bg-secondary'}`;
      wordGroupTag.textContent = wordGroup;
      wordGroupTag.style.cursor = 'pointer';
      wordGroupTag.addEventListener('click', () => toggleAssignment(websiteGroup, wordGroup));
      wordGroupListDiv.appendChild(wordGroupTag);
    });
  }
}

function addWebsite() {
  const websiteInput = document.getElementById('new-website');
  const website = websiteInput.value.trim();
  const groupName = document.getElementById('new-website-group').value.trim();
  
  if (website && groupName) {
    if (!websiteGroups[groupName]) {
      websiteGroups[groupName] = [];
    }
    websiteGroups[groupName].push(website);
    websiteInput.value = '';
    document.getElementById('new-website-group').value = '';
    updateWebsiteGroups();
    updateAssignments();
    saveOptions();
  }
}

function addWord() {
  const wordInput = document.getElementById('new-word');
  const word = wordInput.value.trim();
  const groupName = document.getElementById('new-word-group').value.trim();
  
  if (word && groupName) {
    if (!wordGroups[groupName]) {
      wordGroups[groupName] = [];
    }
    wordGroups[groupName].push(word);
    wordInput.value = '';
    document.getElementById('new-word-group').value = '';
    updateWordGroups();
    updateAssignments();
    saveOptions();
  }
}

function updateGroupName(type, oldName, newName) {
  if (oldName !== newName) {
    if (type === 'website') {
      websiteGroups[newName] = websiteGroups[oldName];
      delete websiteGroups[oldName];
      
      // Update assignments
      if (assignments[oldName]) {
        assignments[newName] = assignments[oldName];
        delete assignments[oldName];
      }
    } else if (type === 'word') {
      wordGroups[newName] = wordGroups[oldName];
      delete wordGroups[oldName];
      
      // Update assignments
      for (const websiteGroup in assignments) {
        const index = assignments[websiteGroup].indexOf(oldName);
        if (index !== -1) {
          assignments[websiteGroup][index] = newName;
        }
      }
    }
    saveOptions();
    updateWebsiteGroups();
    updateWordGroups();
    updateAssignments();
  }
}

function deleteGroup(type, groupName) {
  if (type === 'website') {
    delete websiteGroups[groupName];
    delete assignments[groupName];
  } else if (type === 'word') {
    delete wordGroups[groupName];
    for (const websiteGroup in assignments) {
      assignments[websiteGroup] = assignments[websiteGroup].filter(wg => wg !== groupName);
    }
  }
  updateWebsiteGroups();
  updateWordGroups();
  updateAssignments();
  saveOptions();
}

function updateWebsite(groupName, oldWebsite, newWebsite) {
  const index = websiteGroups[groupName].indexOf(oldWebsite);
  if (index !== -1) {
    websiteGroups[groupName][index] = newWebsite;
    saveOptions();
  }
}

function deleteWebsite(groupName, website) {
  websiteGroups[groupName] = websiteGroups[groupName].filter(w => w !== website);
  updateWebsiteGroups();
  saveOptions();
}

function updateWord(groupName, oldWord, newWord) {
  const index = wordGroups[groupName].indexOf(oldWord);
  if (index !== -1) {
    wordGroups[groupName][index] = newWord;
    saveOptions();
  }
}

function deleteWord(groupName, word) {
  wordGroups[groupName] = wordGroups[groupName].filter(w => w !== word);
  updateWordGroups();
  saveOptions();
}

function toggleAssignment(websiteGroup, wordGroup) {
  if (!assignments[websiteGroup]) {
    assignments[websiteGroup] = [];
  }
  
  const index = assignments[websiteGroup].indexOf(wordGroup);
  if (index === -1) {
    assignments[websiteGroup].push(wordGroup);
  } else {
    assignments[websiteGroup].splice(index, 1);
  }
  
  updateAssignments();
  saveOptions();
}

function addUrlToGroup(groupName, websiteList) {
  const newWebsite = '';
  websiteGroups[groupName].push(newWebsite);
  const listItem = createWebsiteListItem(groupName, newWebsite);
  websiteList.appendChild(listItem);
  saveOptions();
}

function addWordToGroup(groupName, wordList) {
  const newWord = '';
  wordGroups[groupName].push(newWord);
  const listItem = createWordListItem(groupName, newWord);
  wordList.appendChild(listItem);
  saveOptions();
}

function saveOptions() {
  browser.storage.local.set({ websiteGroups, wordGroups, assignments });
}