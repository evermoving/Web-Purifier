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
    groupDiv.className = 'group-item';
    groupDiv.innerHTML = `
      <input type="text" value="${groupName}" data-original="${groupName}">
      <button class="delete-btn">Delete</button>
    `;
    container.appendChild(groupDiv);

    const input = groupDiv.querySelector('input');
    input.addEventListener('change', () => updateGroupName('website', groupName, input.value));

    const deleteBtn = groupDiv.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteGroup('website', groupName));

    const websiteList = document.createElement('ul');
    websiteList.className = 'group-content';
    websites.forEach(website => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <input type="text" value="${website}">
        <button class="delete-btn">Delete</button>
      `;
      websiteList.appendChild(listItem);

      const websiteInput = listItem.querySelector('input');
      websiteInput.addEventListener('change', () => updateWebsite(groupName, website, websiteInput.value));

      const deleteWebsiteBtn = listItem.querySelector('.delete-btn');
      deleteWebsiteBtn.addEventListener('click', () => deleteWebsite(groupName, website));
    });
    groupDiv.appendChild(websiteList);
  }
}

function updateWordGroups() {
  const container = document.getElementById('word-groups');
  container.innerHTML = '';
  
  for (const [groupName, words] of Object.entries(wordGroups)) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'group-item';
    groupDiv.innerHTML = `
      <input type="text" value="${groupName}" data-original="${groupName}">
      <button class="delete-btn">Delete</button>
    `;
    container.appendChild(groupDiv);

    const input = groupDiv.querySelector('input');
    input.addEventListener('change', () => updateGroupName('word', groupName, input.value));

    const deleteBtn = groupDiv.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteGroup('word', groupName));

    const wordList = document.createElement('ul');
    wordList.className = 'group-content';
    words.forEach(word => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <input type="text" value="${word}">
        <button class="delete-btn">Delete</button>
      `;
      wordList.appendChild(listItem);

      const wordInput = listItem.querySelector('input');
      wordInput.addEventListener('change', () => updateWord(groupName, word, wordInput.value));

      const deleteWordBtn = listItem.querySelector('.delete-btn');
      deleteWordBtn.addEventListener('click', () => deleteWord(groupName, word));
    });
    groupDiv.appendChild(wordList);
  }
}

function updateAssignments() {
  const container = document.getElementById('assignments');
  container.innerHTML = '';
  
  for (const websiteGroup of Object.keys(websiteGroups)) {
    const assignmentDiv = document.createElement('div');
    assignmentDiv.className = 'assignment-item';
    assignmentDiv.innerHTML = `
      <h3>${websiteGroup}</h3>
      <div class="word-group-list"></div>
    `;
    container.appendChild(assignmentDiv);

    const wordGroupListDiv = assignmentDiv.querySelector('.word-group-list');
    Object.keys(wordGroups).forEach(wordGroup => {
      const wordGroupTag = document.createElement('span');
      wordGroupTag.className = `word-group-tag ${assignments[websiteGroup]?.includes(wordGroup) ? 'active' : 'inactive'}`;
      wordGroupTag.textContent = wordGroup;
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

function saveOptions() {
  browser.storage.local.set({ websiteGroups, wordGroups, assignments });
}

// Initial load
loadOptions();