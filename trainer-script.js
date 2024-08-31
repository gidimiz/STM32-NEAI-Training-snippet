let snippets = [];
let currentEditingIndex = -1;

function loadSnippets() {
    const storedSnippets = localStorage.getItem('snippets');
    if (storedSnippets) {
        snippets = JSON.parse(storedSnippets);
        updateSnippetControls();
    }
}

function saveSnippets() {
    localStorage.setItem('snippets', JSON.stringify(snippets));
}

function updateSnippetControls() {
    const container = document.getElementById('snippetControls');
    container.innerHTML = '';
    snippets.forEach((snippet, index) => {
        const button = document.createElement('button');
        button.textContent = snippet.title || `Snippet ${index + 1}`;
        button.addEventListener('click', () => editSnippet(index));
        container.appendChild(button);
    });
}

function editSnippet(index) {
    currentEditingIndex = index;
    const snippet = snippets[index];
    document.getElementById('snippetTitle').value = snippet.title || '';
    document.getElementById('preSnippetText').value = snippet.preText || '';
    document.getElementById('snippetCode').value = snippet.code || '';
    document.getElementById('postSnippetText').value = snippet.postText || '';
    document.getElementById('lineNumber').value = snippet.lineNumber || '';
}

function saveSnippet() {
    const snippet = {
        title: document.getElementById('snippetTitle').value,
        preText: document.getElementById('preSnippetText').value,
        code: document.getElementById('snippetCode').value,
        postText: document.getElementById('postSnippetText').value,
        lineNumber: document.getElementById('lineNumber').value
    };

    if (currentEditingIndex === -1) {
        snippets.push(snippet);
    } else {
        snippets[currentEditingIndex] = snippet;
    }

    saveSnippets();
    updateSnippetControls();
    resetEditor();
}

function resetEditor() {
    currentEditingIndex = -1;
    document.getElementById('snippetTitle').value = '';
    document.getElementById('preSnippetText').value = '';
    document.getElementById('snippetCode').value = '';
    document.getElementById('postSnippetText').value = '';
    document.getElementById('lineNumber').value = '';
}

document.getElementById('addSnippetBtn').addEventListener('click', resetEditor);
document.getElementById('saveSnippetBtn').addEventListener('click', saveSnippet);

window.addEventListener('load', loadSnippets);
