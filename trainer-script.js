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
        const div = document.createElement('div');
        div.className = 'snippet-control';
        div.draggable = true;
        div.setAttribute('data-index', index);

        const button = document.createElement('button');
        button.textContent = snippet.title || `Snippet ${index + 1}`;
        button.addEventListener('click', () => editSnippet(index));

        const preview = document.createElement('span');
        preview.textContent = snippet.code.substring(0, 30) + '...';

        div.appendChild(button);
        div.appendChild(preview);

        div.addEventListener('dragstart', dragStart);
        div.addEventListener('dragover', dragOver);
        div.addEventListener('drop', drop);

        container.appendChild(div);
    });
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.getAttribute('data-index'));
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const toIndex = parseInt(e.target.closest('.snippet-control').getAttribute('data-index'));
    
    if (fromIndex !== toIndex) {
        const [movedSnippet] = snippets.splice(fromIndex, 1);
        snippets.splice(toIndex, 0, movedSnippet);
        saveSnippets();
        updateSnippetControls();
    }
}

function editSnippet(index) {
    currentEditingIndex = index;
    const snippet = snippets[index];
    document.getElementById('snippetTitle').value = snippet.title || '';
    document.getElementById('preSnippetText').value = snippet.preText || '';
    document.getElementById('snippetCode').value = snippet.code || '';
    document.getElementById('postSnippetText').value = snippet.postText || '';
    document.getElementById('lineNumber').value = snippet.lineNumber || '';
    updatePreview(snippet);
}

function updatePreview(snippet) {
    const previewContent = document.getElementById('previewContent');
    previewContent.innerHTML = `
        <h3>${snippet.title || 'Untitled Snippet'}</h3>
        <p><strong>Pre-snippet Text:</strong> ${snippet.preText || 'None'}</p>
        <pre><code>${snippet.code || 'No code'}</code></pre>
        <p><strong>Post-snippet Text:</strong> ${snippet.postText || 'None'}</p>
        <p><strong>Line Number:</strong> ${snippet.lineNumber || 'Not specified'}</p>
    `;
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
    updatePreview(snippet);
    resetEditor();
}

function resetEditor() {
    currentEditingIndex = -1;
    document.getElementById('snippetTitle').value = '';
    document.getElementById('preSnippetText').value = '';
    document.getElementById('snippetCode').value = '';
    document.getElementById('postSnippetText').value = '';
    document.getElementById('lineNumber').value = '';
    document.getElementById('previewContent').innerHTML = '';
}

document.getElementById('addSnippetBtn').addEventListener('click', resetEditor);
document.getElementById('saveSnippetBtn').addEventListener('click', saveSnippet);

window.addEventListener('load', loadSnippets);