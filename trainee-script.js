let snippets = [];
let currentSnippetIndex = 0;

function loadSnippets() {
    const storedSnippets = localStorage.getItem('snippets');
    const activeIndex = localStorage.getItem('activeSnippetIndex');
    if (storedSnippets) {
        snippets = JSON.parse(storedSnippets);
        currentSnippetIndex = activeIndex ? parseInt(activeIndex) : 0;
        displayCurrentSnippet();
    }
}

function displayCurrentSnippet() {
    if (snippets.length === 0) return;

    const snippet = snippets[currentSnippetIndex];
    document.getElementById('lineNumber').textContent = `Paste at line: ${snippet.lineNumber}`;
    document.getElementById('preSnippetText').textContent = snippet.preText;
    document.getElementById('codeSnippet').textContent = snippet.code;
    document.getElementById('postSnippetText').textContent = snippet.postText;
    applyHighlighting();
}

function copyCodeToClipboard() {
    const codeSnippet = document.getElementById('codeSnippet');
    const range = document.createRange();
    range.selectNode(codeSnippet);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert('Code copied to clipboard!');
}

function refreshSnippet() {
    loadSnippets();
}

// Simple syntax highlighting
function highlightSyntax(code) {
    // This is a very basic implementation and doesn't cover all C/C++ syntax
    const keywords = ['int', 'float', 'double', 'char', 'void', 'for', 'while', 'if', 'else', 'return'];
    const keywordRegex = new RegExp('\\b(' + keywords.join('|') + ')\\b', 'g');
    return code
        .replace(/\/\/.*/g, '<span class="comment">$&</span>')
        .replace(/["'`].*?["'`]/g, '<span class="string">$&</span>')
        .replace(keywordRegex, '<span class="keyword">$&</span>')
        .replace(/\b\d+\b/g, '<span class="number">$&</span>');
}

function applyHighlighting() {
    const codeElement = document.getElementById('codeSnippet');
    codeElement.innerHTML = highlightSyntax(codeElement.textContent);
}

document.getElementById('copyButton').addEventListener('click', copyCodeToClipboard);
document.getElementById('refreshButton').addEventListener('click', refreshSnippet);

window.addEventListener('load', loadSnippets);

// Check for updates every 2 seconds
setInterval(loadSnippets, 2000);