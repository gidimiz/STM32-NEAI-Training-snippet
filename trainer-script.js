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
        button.addEventListener('click', () => {
            editSnippet(index);
            setActiveSnippet(index);
        });

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

function setActiveSnippet(index) {
    localStorage.setItem('activeSnippetIndex', index);
}

// ... (rest of the existing functions)

window.addEventListener('load', loadSnippets);