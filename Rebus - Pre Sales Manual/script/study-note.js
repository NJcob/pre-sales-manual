// Study Notes Modal JavaScript
// Complete functionality for the study hub interface

class StudyNotesManager {
    constructor() {
        this.currentNote = null;
        this.notes = this.loadNotes();
        this.activeTab = 'notes';
        this.activeFilter = 'all';
        this.aiMessages = [];
        this.autoSaveInterval = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.clearSampleNotes(); // Remove hardcoded sample notes
        this.fixScrollingIssues(); // Fix CSS scrolling issues
        this.renderNotes();
        this.startAutoSave();
        this.createDeleteModal();
        this.createLinkModal();
        this.createCodeModal();
    }

    fixScrollingIssues() {
        // Add CSS fixes for scrolling issues
        const style = document.createElement('style');
        style.textContent = `
            /* Fix notes list scrolling */
            #notesList {
                height: calc(100vh - 380px);
                min-height: 300px;
                overflow-y: auto !important;
            }
            
            /* Ensure proper flex behavior */
            #notesTabContent {
                height: calc(100vh - 200px);
                min-height: 500px;
            }
            
            /* Fix note editor scrolling */
            #noteContent {
                max-height: calc(100vh - 400px);
                overflow-y: auto;
            }
            
            /* Smooth scrolling */
            #notesList, #noteContent {
                scrollbar-width: thin;
                scrollbar-color: #CBD5E1 transparent;
            }
            
            #notesList::-webkit-scrollbar, #noteContent::-webkit-scrollbar {
                width: 6px;
            }
            
            #notesList::-webkit-scrollbar-track, #noteContent::-webkit-scrollbar-track {
                background: transparent;
            }
            
            #notesList::-webkit-scrollbar-thumb, #noteContent::-webkit-scrollbar-thumb {
                background-color: #CBD5E1;
                border-radius: 3px;
            }
            
            #notesList::-webkit-scrollbar-thumb:hover, #noteContent::-webkit-scrollbar-thumb:hover {
                background-color: #94A3B8;
            }
            
            /* Ensure modal content is scrollable on small screens */
            #notesModalContent {
                max-height: 95vh;
                overflow: hidden;
            }
            
            /* Fix AI chat scrolling */
            #aiChatMessages {
                max-height: calc(100vh - 300px);
                overflow-y: auto !important;
            }
            
            /* Fix resources tab scrolling */
            #resourcesTabContent {
                height: calc(100vh - 200px);
                overflow-y: auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    clearSampleNotes() {
        // Remove the hardcoded sample notes from HTML
        const notesContainer = document.querySelector('#notesList .space-y-2');
        if (notesContainer) {
            notesContainer.innerHTML = '';
        }
    }

    bindEvents() {
        // Modal events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeNotesModal();
                this.closeDeleteModal();
                this.closeLinkModal();
                this.closeCodeModal();
            }
        });

        // Search functionality
        const searchInput = document.querySelector('input[placeholder="Search notes..."]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchNotes(e.target.value));
        }

        // Filter buttons
        this.bindFilterButtons();

        // AI chat input
        const aiInput = document.getElementById('aiChatInput');
        if (aiInput) {
            aiInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendAIMessage();
                }
            });
        }

        // AI popular questions
        this.bindAIPopularQuestions();

        // Note content editor
        const noteContent = document.getElementById('noteContent');
        if (noteContent) {
            noteContent.addEventListener('input', () => {
                this.updateWordCount();
                this.markAsModified();
            });
            
            noteContent.addEventListener('paste', (e) => {
                // Handle pasted images
                this.handlePaste(e);
                setTimeout(() => this.updateWordCount(), 100);
            });

            // Handle keyboard shortcuts
            noteContent.addEventListener('keydown', (e) => {
                this.handleKeyboardShortcuts(e);
            });
        }

        // Note title
        const noteTitle = document.getElementById('noteTitle');
        if (noteTitle) {
            noteTitle.addEventListener('input', () => {
                this.markAsModified();
            });
        }

        // Template buttons
        this.bindTemplateButtons();
    }

    bindAIPopularQuestions() {
        // Bind the popular question buttons in AI assistant
        setTimeout(() => {
            const questionButtons = document.querySelectorAll('.bg-yellow-50 button');
            questionButtons.forEach(button => {
                if (!button.onclick) {
                    const question = button.textContent.replace(/"/g, '').trim();
                    button.onclick = () => this.askAI(question);
                }
            });
        }, 100);
    }

    bindFilterButtons() {
        const filterContainer = document.querySelector('.flex.space-x-2.mt-3');
        if (filterContainer) {
            const buttons = filterContainer.querySelectorAll('button');
            buttons.forEach((button, index) => {
                const filters = ['all', 'recent', 'starred'];
                button.addEventListener('click', () => {
                    this.setActiveFilter(filters[index], button);
                });
            });
        }
    }

    bindTemplateButtons() {
        // Find template buttons by their text content
        const templateButtons = document.querySelectorAll('#noteEditorEmpty button');
        templateButtons.forEach(button => {
            const text = button.textContent.trim();
            if (text.includes('Meeting Notes Template')) {
                button.addEventListener('click', () => this.insertTemplate('meeting'));
            } else if (text.includes('Lesson Summary Template')) {
                button.addEventListener('click', () => this.insertTemplate('lesson'));
            } else if (text.includes('Q&A Template')) {
                button.addEventListener('click', () => this.insertTemplate('qa'));
            }
        });

        // Bind toolbar buttons
        this.bindToolbarButtons();
    }

    bindToolbarButtons() {
        // Find toolbar buttons and add onclick handlers
        const toolbarButtons = document.querySelectorAll('#editorToolbar button');
        toolbarButtons.forEach(button => {
            const title = button.getAttribute('title');
            if (title === 'Insert Link') {
                button.onclick = () => this.insertLink();
            } else if (title === 'Insert Image') {
                button.onclick = () => this.insertImage();
            } else if (title === 'Insert Code Block') {
                button.onclick = () => this.insertCodeBlock();
            }
        });
    }

    // Modal Management
    createDeleteModal() {
        if (document.getElementById('deleteNoteModal')) return;

        const modal = document.createElement('div');
        modal.id = 'deleteNoteModal';
        modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] opacity-0 invisible transition-all duration-300';
        modal.innerHTML = `
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full transform scale-95 transition-transform duration-300">
                    <div class="p-6">
                        <div class="flex items-center space-x-4 mb-4">
                            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900">Delete Note</h3>
                                <p class="text-sm text-gray-500">This action cannot be undone</p>
                            </div>
                        </div>
                        <div class="mb-6">
                            <p class="text-gray-700">Are you sure you want to delete this note?</p>
                            <div class="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p class="text-sm font-medium text-gray-900" id="deleteNoteTitle">Note Title</p>
                                <p class="text-xs text-gray-500 mt-1" id="deleteNoteInfo">Created date • word count</p>
                            </div>
                        </div>
                        <div class="flex space-x-3">
                            <button onclick="studyNotesManager.closeDeleteModal()" class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                Cancel
                            </button>
                            <button id="confirmDeleteBtn" class="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                                Delete Note
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    createLinkModal() {
        if (document.getElementById('linkModal')) return;

        const modal = document.createElement('div');
        modal.id = 'linkModal';
        modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] opacity-0 invisible transition-all duration-300';
        modal.innerHTML = `
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full transform scale-95 transition-transform duration-300">
                    <div class="p-6">
                        <div class="flex items-center space-x-4 mb-4">
                            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900">Insert Link</h3>
                                <p class="text-sm text-gray-500">Add a hyperlink to your note</p>
                            </div>
                        </div>
                        <form id="linkForm" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Link Text</label>
                                <input 
                                    type="text" 
                                    id="linkText" 
                                    placeholder="Enter display text..." 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">URL</label>
                                <input 
                                    type="url" 
                                    id="linkUrl" 
                                    placeholder="https://example.com" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    required
                                >
                            </div>
                            <div class="flex items-center space-x-2">
                                <input type="checkbox" id="linkNewTab" checked class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                <label for="linkNewTab" class="text-sm text-gray-700">Open in new tab</label>
                            </div>
                        </form>
                        <div class="flex space-x-3 mt-6">
                            <button onclick="studyNotesManager.closeLinkModal()" class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                Cancel
                            </button>
                            <button onclick="studyNotesManager.confirmInsertLink()" class="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                                Insert Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    createCodeModal() {
        if (document.getElementById('codeModal')) return;

        const modal = document.createElement('div');
        modal.id = 'codeModal';
        modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] opacity-0 invisible transition-all duration-300';
        modal.innerHTML = `
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full transform scale-95 transition-transform duration-300">
                    <div class="p-6">
                        <div class="flex items-center space-x-4 mb-4">
                            <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900">Insert Code Block</h3>
                                <p class="text-sm text-gray-500">Add formatted code to your note</p>
                            </div>
                        </div>
                        <form id="codeForm" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Language (optional)</label>
                                <select 
                                    id="codeLanguage" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none"
                                >
                                    <option value="">Select language...</option>
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="html">HTML</option>
                                    <option value="css">CSS</option>
                                    <option value="java">Java</option>
                                    <option value="cpp">C++</option>
                                    <option value="php">PHP</option>
                                    <option value="sql">SQL</option>
                                    <option value="json">JSON</option>
                                    <option value="xml">XML</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Code</label>
                                <textarea 
                                    id="codeContent" 
                                    placeholder="Paste your code here..." 
                                    rows="8"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none font-mono text-sm"
                                    required
                                ></textarea>
                            </div>
                        </form>
                        <div class="flex space-x-3 mt-6">
                            <button onclick="studyNotesManager.closeCodeModal()" class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                Cancel
                            </button>
                            <button onclick="studyNotesManager.confirmInsertCode()" class="flex-1 px-4 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors">
                                Insert Code
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    showDeleteModal(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;

        const modal = document.getElementById('deleteNoteModal');
        const titleEl = document.getElementById('deleteNoteTitle');
        const infoEl = document.getElementById('deleteNoteInfo');
        const confirmBtn = document.getElementById('confirmDeleteBtn');

        if (titleEl) titleEl.textContent = note.title;
        if (infoEl) {
            const createdDate = new Date(note.created).toLocaleDateString();
            infoEl.textContent = `Created ${createdDate} • ${note.wordCount} words`;
        }

        // Set up confirm button
        confirmBtn.onclick = () => this.confirmDeleteNote(noteId);

        // Show modal
        modal.classList.remove('opacity-0', 'invisible');
        modal.classList.add('opacity-100');
        modal.querySelector('.bg-white').classList.remove('scale-95');
        modal.querySelector('.bg-white').classList.add('scale-100');
    }

    closeDeleteModal() {
        const modal = document.getElementById('deleteNoteModal');
        if (modal) {
            modal.classList.add('opacity-0', 'invisible');
            modal.classList.remove('opacity-100');
            modal.querySelector('.bg-white').classList.add('scale-95');
            modal.querySelector('.bg-white').classList.remove('scale-100');
        }
    }

    showLinkModal() {
        const modal = document.getElementById('linkModal');
        const selectedText = getSelection().toString();
        
        // Pre-fill link text with selected text
        const linkTextInput = document.getElementById('linkText');
        if (linkTextInput && selectedText) {
            linkTextInput.value = selectedText;
        }

        // Show modal
        modal.classList.remove('opacity-0', 'invisible');
        modal.classList.add('opacity-100');
        modal.querySelector('.bg-white').classList.remove('scale-95');
        modal.querySelector('.bg-white').classList.add('scale-100');
        
        // Focus on URL input
        setTimeout(() => {
            const urlInput = document.getElementById('linkUrl');
            if (urlInput) urlInput.focus();
        }, 100);
    }

    closeLinkModal() {
        const modal = document.getElementById('linkModal');
        if (modal) {
            modal.classList.add('opacity-0', 'invisible');
            modal.classList.remove('opacity-100');
            modal.querySelector('.bg-white').classList.add('scale-95');
            modal.querySelector('.bg-white').classList.remove('scale-100');
            
            // Clear form
            document.getElementById('linkForm').reset();
        }
    }

    confirmInsertLink() {
        const linkText = document.getElementById('linkText').value.trim();
        const linkUrl = document.getElementById('linkUrl').value.trim();
        const newTab = document.getElementById('linkNewTab').checked;
        
        if (!linkUrl) {
            this.showToast('Please enter a URL', 'error');
            return;
        }
        
        // Validate URL format
        try {
            new URL(linkUrl);
        } catch {
            this.showToast('Please enter a valid URL', 'error');
            return;
        }
        
        const displayText = linkText || linkUrl;
        const target = newTab ? 'target="_blank" rel="noopener"' : '';
        const linkHtml = `<a href="${linkUrl}" ${target} class="text-blue-600 hover:text-blue-800 underline">${displayText}</a>`;
        
        document.execCommand('insertHTML', false, linkHtml);
        this.markAsModified();
        this.closeLinkModal();
        this.showToast('Link inserted successfully', 'success');
    }

    showCodeModal() {
        const modal = document.getElementById('codeModal');
        
        // Show modal
        modal.classList.remove('opacity-0', 'invisible');
        modal.classList.add('opacity-100');
        modal.querySelector('.bg-white').classList.remove('scale-95');
        modal.querySelector('.bg-white').classList.add('scale-100');
        
        // Focus on code textarea
        setTimeout(() => {
            const codeInput = document.getElementById('codeContent');
            if (codeInput) codeInput.focus();
        }, 100);
    }

    closeCodeModal() {
        const modal = document.getElementById('codeModal');
        if (modal) {
            modal.classList.add('opacity-0', 'invisible');
            modal.classList.remove('opacity-100');
            modal.querySelector('.bg-white').classList.add('scale-95');
            modal.querySelector('.bg-white').classList.remove('scale-100');
            
            // Clear form
            document.getElementById('codeForm').reset();
        }
    }

    confirmInsertCode() {
        const language = document.getElementById('codeLanguage').value;
        const code = document.getElementById('codeContent').value.trim();
        
        if (!code) {
            this.showToast('Please enter some code', 'error');
            return;
        }
        
        const languageLabel = language ? `<div class="text-xs text-gray-500 mb-2 font-medium">${language}</div>` : '';
        const codeBlock = `
            <div class="my-4 border border-gray-200 rounded-lg overflow-hidden">
                ${languageLabel}
                <pre class="bg-gray-50 p-4 overflow-x-auto"><code class="text-sm font-mono">${this.escapeHtml(code)}</code></pre>
            </div>
        `;
        
        document.execCommand('insertHTML', false, codeBlock);
        this.markAsModified();
        this.closeCodeModal();
        this.showToast('Code block inserted successfully', 'success');
    }

    confirmDeleteNote(noteId) {
        this.notes = this.notes.filter(n => n.id !== noteId);
        this.saveNotes();
        this.renderNotes();
        
        if (this.currentNote && this.currentNote.id === noteId) {
            this.currentNote = null;
            this.showEmptyState();
        }
        
        this.closeDeleteModal();
        this.showToast('Note deleted successfully', 'success');
    }

    // Filter Management
    setActiveFilter(filter, button) {
        this.activeFilter = filter;
        
        // Update button states
        const filterContainer = document.querySelector('.flex.space-x-2.mt-3');
        if (filterContainer) {
            filterContainer.querySelectorAll('button').forEach(btn => {
                btn.classList.remove('bg-purple-100', 'text-purple-700');
                btn.classList.add('bg-gray-200', 'text-gray-600');
            });
            
            button.classList.remove('bg-gray-200', 'text-gray-600');
            button.classList.add('bg-purple-100', 'text-purple-700');
        }
        
        this.renderNotes();
    }

    getFilteredNotes() {
        let filtered = [...this.notes];
        
        switch (this.activeFilter) {
            case 'recent':
                const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                filtered = filtered.filter(note => new Date(note.modified) > sevenDaysAgo);
                break;
            case 'starred':
                filtered = filtered.filter(note => note.starred);
                break;
            case 'all':
            default:
                break;
        }
        
        return filtered.sort((a, b) => new Date(b.modified) - new Date(a.modified));
    }

    // Modal Management
    openNotesModal() {
        const modal = document.getElementById('notesModal');
        if (modal) {
            modal.classList.remove('opacity-0', 'invisible');
            modal.classList.add('opacity-100');
            const content = document.getElementById('notesModalContent');
            if (content) {
                content.classList.remove('scale-95');
                content.classList.add('scale-100');
            }
            document.body.style.overflow = 'hidden';
        }
    }

    closeNotesModal() {
        const modal = document.getElementById('notesModal');
        if (modal) {
            modal.classList.add('opacity-0', 'invisible');
            modal.classList.remove('opacity-100');
            const content = document.getElementById('notesModalContent');
            if (content) {
                content.classList.add('scale-95');
                content.classList.remove('scale-100');
            }
            document.body.style.overflow = '';
            this.saveCurrentNote();
        }
    }

    // Tab Management
    switchTab(tabName) {
        // Hide all tab contents
        const tabs = ['notes', 'ai-assistant', 'resources'];
        tabs.forEach(tab => {
            const content = document.getElementById(`${tab}TabContent`);
            const button = document.getElementById(`${tab}Tab`);
            if (content) content.classList.add('hidden');
            if (button) {
                button.classList.remove('text-purple-600', 'border-purple-600');
                button.classList.add('text-gray-500', 'border-transparent');
            }
        });

        // Show selected tab
        const activeContent = document.getElementById(`${tabName}TabContent`);
        const activeButton = document.getElementById(`${tabName}Tab`);
        if (activeContent) activeContent.classList.remove('hidden');
        if (activeButton) {
            activeButton.classList.add('text-purple-600', 'border-purple-600');
            activeButton.classList.remove('text-gray-500', 'border-transparent');
        }

        this.activeTab = tabName;
    }

    // Notes Management
    loadNotes() {
        try {
            return JSON.parse(localStorage.getItem('studyNotes') || '[]');
        } catch {
            return [];
        }
    }

    saveNotes() {
        localStorage.setItem('studyNotes', JSON.stringify(this.notes));
    }

    createNewNote() {
        const newNote = {
            id: Date.now().toString(),
            title: 'Untitled Note',
            content: '',
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            wordCount: 0,
            starred: false
        };
        
        this.notes.unshift(newNote);
        this.saveNotes();
        this.renderNotes();
        this.selectNote(newNote.id);
        
        // Focus on title input
        setTimeout(() => {
            const titleInput = document.getElementById('noteTitle');
            if (titleInput) {
                titleInput.focus();
                titleInput.select();
            }
        }, 100);
    }

    selectNote(noteId) {
        this.saveCurrentNote();
        
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;
        
        this.currentNote = note;
        this.displayNote(note);
        this.highlightSelectedNote(noteId);
    }

    displayNote(note) {
        const editor = document.getElementById('noteEditor');
        const emptyState = document.getElementById('noteEditorEmpty');
        const titleContainer = document.getElementById('noteTitleContainer');
        const toolbar = document.getElementById('editorToolbar');
        
        if (editor) editor.classList.remove('hidden');
        if (emptyState) emptyState.style.display = 'none';
        if (titleContainer) titleContainer.classList.remove('hidden');
        if (toolbar) toolbar.classList.remove('hidden');
        
        const titleInput = document.getElementById('noteTitle');
        const contentDiv = document.getElementById('noteContent');
        
        if (titleInput) titleInput.value = note.title || '';
        if (contentDiv) contentDiv.innerHTML = note.content || '';
        
        this.updateWordCount();
    }

    highlightSelectedNote(noteId) {
        // Remove highlight from all notes
        const noteItems = document.querySelectorAll('#notesList .space-y-2 > div');
        noteItems.forEach(item => {
            item.classList.remove('bg-purple-50', 'border-purple-200');
            item.classList.add('bg-white', 'border-gray-200');
        });
        
        // Add highlight to selected note
        const selectedItem = document.querySelector(`[data-note-id="${noteId}"]`);
        if (selectedItem) {
            selectedItem.classList.remove('bg-white', 'border-gray-200');
            selectedItem.classList.add('bg-purple-50', 'border-purple-200');
        }
    }

    saveCurrentNote() {
        if (!this.currentNote) return;
        
        const titleInput = document.getElementById('noteTitle');
        const contentDiv = document.getElementById('noteContent');
        
        if (titleInput && contentDiv) {
            const updatedNote = {
                ...this.currentNote,
                title: titleInput.value || 'Untitled Note',
                content: contentDiv.innerHTML,
                modified: new Date().toISOString(),
                wordCount: this.getWordCount(contentDiv.textContent || '')
            };
            
            const index = this.notes.findIndex(n => n.id === this.currentNote.id);
            if (index !== -1) {
                this.notes[index] = updatedNote;
                this.currentNote = updatedNote;
                this.saveNotes();
                this.renderNotes();
            }
        }
        
        this.updateLastSaved();
    }

    deleteNote(noteId) {
        this.showDeleteModal(noteId);
    }

    toggleStarNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (note) {
            note.starred = !note.starred;
            note.modified = new Date().toISOString();
            this.saveNotes();
            this.renderNotes();
            this.showToast(note.starred ? 'Note starred' : 'Star removed', 'success');
        }
    }

    renderNotes() {
        const container = document.querySelector('#notesList .space-y-2');
        if (!container) return;
        
        const filteredNotes = this.getFilteredNotes();
        
        // Update note count in tab
        this.updateNoteCount(filteredNotes.length);
        
        if (filteredNotes.length === 0) {
            const emptyMessage = this.activeFilter === 'starred' ? 'No starred notes' : 
                                this.activeFilter === 'recent' ? 'No recent notes' : 'No notes yet';
            const emptySubtext = this.activeFilter === 'starred' ? 'Star some notes to see them here' :
                               this.activeFilter === 'recent' ? 'Notes from the last 7 days will appear here' :
                               'Create your first note to get started';
            
            container.innerHTML = `
                <div class="text-center text-gray-500 mt-8">
                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <p class="text-lg font-medium">${emptyMessage}</p>
                    <p class="text-sm">${emptySubtext}</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = filteredNotes.map(note => this.createNoteListItem(note)).join('');
    }

    updateNoteCount(count) {
        const noteCountBadge = document.querySelector('#notesTab .bg-purple-100');
        if (noteCountBadge) {
            noteCountBadge.textContent = count.toString();
        }
    }

    createNoteListItem(note) {
        const timeAgo = this.getTimeAgo(new Date(note.modified));
        const preview = this.getTextPreview(note.content);
        
        return `
            <div class="p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                 data-note-id="${note.id}" onclick="studyNotesManager.selectNote('${note.id}')">
                <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                        <h4 class="font-medium text-gray-900 text-sm truncate">${this.escapeHtml(note.title)}</h4>
                        <p class="text-xs text-gray-500 mt-1 line-clamp-2">${preview}</p>
                        <div class="flex items-center mt-2 space-x-2">
                            <span class="text-xs text-gray-400">${timeAgo}</span>
                            <div class="w-1 h-1 bg-gray-300 rounded-full"></div>
                            <span class="text-xs text-gray-400">${note.wordCount} words</span>
                        </div>
                    </div>
                    <div class="flex items-center space-x-1 ml-2">
                        <button class="p-1 hover:bg-gray-100 rounded transition-colors" onclick="event.stopPropagation(); studyNotesManager.toggleStarNote('${note.id}')" title="${note.starred ? 'Remove star' : 'Star note'}">
                            <svg class="w-4 h-4 ${note.starred ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'} flex-shrink-0 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        </button>
                        <button class="p-1 hover:bg-gray-100 rounded transition-colors" onclick="event.stopPropagation(); studyNotesManager.deleteNote('${note.id}')" title="Delete note">
                            <svg class="w-3 h-3 text-gray-400 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    searchNotes(query) {
        const allNotes = this.getFilteredNotes();
        const filteredNotes = allNotes.filter(note => 
            note.title.toLowerCase().includes(query.toLowerCase()) ||
            this.getTextPreview(note.content).toLowerCase().includes(query.toLowerCase())
        );
        
        const container = document.querySelector('#notesList .space-y-2');
        if (container) {
            if (query.trim() === '') {
                this.renderNotes();
            } else {
                container.innerHTML = filteredNotes.map(note => this.createNoteListItem(note)).join('');
                if (filteredNotes.length === 0) {
                    container.innerHTML = `
                        <div class="text-center text-gray-500 mt-8">
                            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                            <p class="text-lg font-medium">No results found</p>
                            <p class="text-sm">Try different keywords or check your spelling</p>
                        </div>
                    `;
                }
            }
        }
    }

    showEmptyState() {
        const editor = document.getElementById('noteEditor');
        const emptyState = document.getElementById('noteEditorEmpty');
        const titleContainer = document.getElementById('noteTitleContainer');
        const toolbar = document.getElementById('editorToolbar');
        
        if (editor) editor.classList.add('hidden');
        if (emptyState) emptyState.style.display = 'flex';
        if (titleContainer) titleContainer.classList.add('hidden');
        if (toolbar) toolbar.classList.add('hidden');
    }

    // Rich Text Editing
    formatText(command, value = null) {
        document.execCommand(command, false, value);
        const noteContent = document.getElementById('noteContent');
        if (noteContent) noteContent.focus();
        this.markAsModified();
    }

    insertList(type) {
        const command = type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList';
        this.formatText(command);
    }

    insertLink() {
        this.showLinkModal();
    }

    insertImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = `<img src="${event.target.result}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0;" alt="Uploaded image">`;
                    document.execCommand('insertHTML', false, img);
                    this.markAsModified();
                    this.showToast('Image inserted successfully', 'success');
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    insertCodeBlock() {
        this.showCodeModal();
    }

    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'b':
                    e.preventDefault();
                    this.formatText('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    this.formatText('italic');
                    break;
                case 'u':
                    e.preventDefault();
                    this.formatText('underline');
                    break;
                case 's':
                    e.preventDefault();
                    this.saveCurrentNote();
                    this.showToast('Note saved', 'success');
                    break;
            }
        }
    }

    handlePaste(e) {
        const items = e.clipboardData.items;
        for (let item of items) {
            if (item.type.indexOf('image') !== -1) {
                e.preventDefault();
                const file = item.getAsFile();
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = `<img src="${event.target.result}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0;" alt="Pasted image">`;
                    document.execCommand('insertHTML', false, img);
                    this.markAsModified();
                };
                reader.readAsDataURL(file);
                break;
            }
        }
    }

    // Word Count and Stats
    updateWordCount() {
        const noteContent = document.getElementById('noteContent');
        const wordCountEl = document.getElementById('wordCount');
        
        if (!noteContent || !wordCountEl) return;
        
        const text = noteContent.textContent || '';
        const wordCount = this.getWordCount(text);
        const charCount = text.length;
        const paraCount = Math.max(1, noteContent.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6').length);
        
        wordCountEl.textContent = `${wordCount} words`;
        const charCountEl = wordCountEl.nextElementSibling?.nextElementSibling;
        const paraCountEl = charCountEl?.nextElementSibling?.nextElementSibling;
        
        if (charCountEl) charCountEl.textContent = `${charCount} characters`;
        if (paraCountEl) paraCountEl.textContent = `${paraCount} paragraphs`;
    }

    getWordCount(text) {
        return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    }

    // Auto-save functionality
    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            if (this.currentNote) {
                this.saveCurrentNote();
            }
        }, 30000); // Auto-save every 30 seconds
    }

    markAsModified() {
        // Visual indication that content has changed
        const lastSavedEl = document.getElementById('lastSaved');
        if (lastSavedEl) {
            lastSavedEl.textContent = 'Unsaved changes';
            lastSavedEl.classList.add('text-orange-500');
        }
    }

    updateLastSaved() {
        const lastSavedEl = document.getElementById('lastSaved');
        if (lastSavedEl) {
            lastSavedEl.textContent = `Saved ${this.getTimeAgo(new Date())}`;
            lastSavedEl.classList.remove('text-orange-500');
        }
    }

    // Export/Import functionality
    exportNotes() {
        const data = {
            notes: this.notes,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `study-notes-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Notes exported successfully', 'success');
    }

    importNotes() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        if (data.notes && Array.isArray(data.notes)) {
                            this.notes = [...this.notes, ...data.notes];
                            this.saveNotes();
                            this.renderNotes();
                            this.showToast(`Imported ${data.notes.length} notes`, 'success');
                        } else {
                            this.showToast('Invalid file format', 'error');
                        }
                    } catch (error) {
                        this.showToast('Error reading file', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    // AI Chat Functionality (Mock Implementation)
    sendAIMessage() {
        const input = document.getElementById('aiChatInput');
        if (!input || !input.value.trim()) return;
        
        const message = input.value.trim();
        input.value = '';
        
        // Add user message
        this.addAIMessage('user', message);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate AI response delay
        setTimeout(() => {
            this.hideTypingIndicator();
            this.generateAIResponse(message);
        }, 1000 + Math.random() * 2000);
    }

    askAI(question) {
        const input = document.getElementById('aiChatInput');
        if (input) {
            input.value = question;
            this.sendAIMessage();
        }
    }

    addAIMessage(sender, message) {
        const container = document.getElementById('aiChatMessages');
        if (!container) return;
        
        const isUser = sender === 'user';
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start space-x-3';
        
        messageDiv.innerHTML = `
            <div class="w-8 h-8 ${isUser ? 'bg-gray-500' : 'bg-gradient-to-br from-blue-500 to-purple-600'} rounded-full flex items-center justify-center flex-shrink-0">
                ${isUser ? `
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                ` : `
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                `}
            </div>
            <div class="flex-1">
                <div class="${isUser ? 'bg-gray-100' : 'bg-blue-50 border border-blue-200'} rounded-lg p-3">
                    <p class="text-gray-800">${this.escapeHtml(message)}</p>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                    ${isUser ? 'You' : 'AI Assistant'} • ${this.getTimeAgo(new Date())}
                </p>
            </div>
        `;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    showTypingIndicator() {
        const container = document.getElementById('aiChatMessages');
        if (!container) return;
        
        const indicator = document.createElement('div');
        indicator.id = 'typingIndicator';
        indicator.className = 'flex items-start space-x-3';
        indicator.innerHTML = `
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
            </div>
            <div class="flex-1">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
                        <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
                    </div>
                </div>
                <p class="text-xs text-gray-500 mt-1">AI Assistant is typing...</p>
            </div>
        `;
        
        container.appendChild(indicator);
        container.scrollTop = container.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    generateAIResponse(userMessage) {
        const responses = this.getContextualResponse(userMessage);
        const response = responses[Math.floor(Math.random() * responses.length)];
        this.addAIMessage('ai', response);
    }

    getContextualResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('closeoutsoft') || lowerMessage.includes('features')) {
            return [
                "CloseoutSoft is a comprehensive construction project closeout platform that streamlines the final phases of construction projects. Key features include digital document management, automated submittal workflows, QA/QC tracking, and real-time collaboration tools.",
                "The main features of CloseoutSoft include: Digital Submittal Management, Quality Assurance/Quality Control (QA/QC) procedures, Document Organization, Automated Workflows, Real-time Collaboration, and Comprehensive Reporting capabilities."
            ];
        }
        
        if (lowerMessage.includes('qa') || lowerMessage.includes('qc') || lowerMessage.includes('quality')) {
            return [
                "QA/QC in CloseoutSoft refers to Quality Assurance and Quality Control procedures. QA focuses on preventing defects through process improvements, while QC involves detecting defects through inspections and testing. The platform automates these processes to ensure project quality standards are met.",
                "Quality control procedures in CloseoutSoft include automated checklists, digital inspections, photo documentation, deficiency tracking, and approval workflows. This ensures all work meets specifications before project handover."
            ];
        }
        
        if (lowerMessage.includes('digital submittal') || lowerMessage.includes('submittal')) {
            return [
                "The digital submittal process in CloseoutSoft allows contractors to submit required documents, drawings, and certifications electronically. This includes automated routing for approvals, version control, and real-time status tracking, significantly reducing paperwork and processing time.",
                "Digital submittals streamline the traditional paper-based process by providing electronic submission, automated workflows, instant notifications, centralized storage, and audit trails. This reduces processing time from weeks to days."
            ];
        }
        
        if (lowerMessage.includes('quiz') || lowerMessage.includes('question') || lowerMessage.includes('test')) {
            return [
                "Here are some practice questions for CloseoutSoft: 1) What are the three main components of the QA/QC process? 2) How does digital submittal improve project timelines? 3) What types of documents can be managed in CloseoutSoft? 4) Who are the typical users in a CloseoutSoft workflow?",
                "I can create custom quiz questions for you! Would you like questions about: Platform Overview, Digital Submittals, QA/QC Procedures, User Roles, or Benefits and Features? Let me know which topic interests you most."
            ];
        }
        
        if (lowerMessage.includes('benefit') || lowerMessage.includes('advantage')) {
            return [
                "CloseoutSoft provides numerous benefits including: 50% reduction in closeout time, improved document organization, enhanced collaboration, reduced errors through automation, better compliance tracking, and significant cost savings on project completion.",
                "The main advantages of CloseoutSoft are faster project delivery, improved quality control, better documentation, enhanced team collaboration, reduced administrative burden, and improved client satisfaction through timely project completion."
            ];
        }
        
        if (lowerMessage.includes('user') || lowerMessage.includes('role')) {
            return [
                "CloseoutSoft supports various user roles including Project Managers (overall project oversight), Contractors (document submission), Quality Inspectors (QA/QC activities), Clients/Owners (review and approval), and System Administrators (platform configuration and user management).",
                "Different user roles have specific permissions: Contractors can submit and edit documents, Project Managers can review and approve, Inspectors can conduct QA/QC activities, and Clients have viewing and final approval rights."
            ];
        }
        
        // Default responses
        return [
            "That's an interesting question about CloseoutSoft! Could you be more specific about what aspect you'd like to learn about? I can help with features, processes, benefits, or specific procedures.",
            "I'd be happy to help you understand that concept better. CloseoutSoft has many components - would you like me to focus on digital submittals, QA/QC procedures, user roles, or platform benefits?",
            "Great question! CloseoutSoft is designed to simplify construction project closeout. What specific area would you like to explore? I can provide detailed explanations, examples, or even create practice questions for you."
        ];
    }

    clearAIChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            const container = document.getElementById('aiChatMessages');
            if (container) {
                // Keep only the welcome message and sample questions
                const welcomeContent = container.innerHTML.split('<div class="text-center py-8">')[0];
                container.innerHTML = welcomeContent + `
                    <div class="text-center py-8">
                        <div class="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            Chat cleared successfully
                        </div>
                    </div>
                `;
            }
        }
    }

    exportAIConversation() {
        const messages = Array.from(document.querySelectorAll('#aiChatMessages .flex.items-start.space-x-3'))
            .slice(2) // Skip welcome message and sample questions
            .map(msg => {
                const isUser = msg.querySelector('.bg-gray-500') !== null;
                const content = msg.querySelector('p').textContent;
                return `${isUser ? 'User' : 'AI'}: ${content}`;
            })
            .join('\n\n');
            
        if (messages.trim()) {
            const blob = new Blob([messages], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ai-conversation-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.showToast('Conversation exported', 'success');
        } else {
            this.showToast('No conversation to export', 'info');
        }
    }

    handleAIChatKeyPress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendAIMessage();
        }
    }

    // Toast Notifications
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500',
            warning: 'bg-yellow-500'
        };
        
        toast.className = `fixed bottom-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-y-full opacity-0 transition-all duration-300`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-y-full', 'opacity-0');
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            toast.classList.add('translate-y-full', 'opacity-0');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    // Utility Functions
    getTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
        return `${days} day${days === 1 ? '' : 's'} ago`;
    }

    getTextPreview(html, maxLength = 100) {
        const div = document.createElement('div');
        div.innerHTML = html;
        const text = div.textContent || div.innerText || '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Template insertion
    insertTemplate(templateType) {
        const templates = {
            meeting: `
                <h2>Meeting Notes - ${new Date().toLocaleDateString()}</h2>
                <p><strong>Meeting Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Time:</strong> </p>
                <p><strong>Location/Platform:</strong> </p>
                
                <h3>Attendees:</h3>
                <ul>
                    <li>Name - Role</li>
                    <li>Name - Role</li>
                </ul>
                
                <h3>Agenda Items:</h3>
                <ol>
                    <li>Topic 1</li>
                    <li>Topic 2</li>
                    <li>Topic 3</li>
                </ol>
                
                <h3>Discussion Points:</h3>
                <ul>
                    <li>Key point discussed...</li>
                    <li>Important decision made...</li>
                </ul>
                
                <h3>Action Items:</h3>
                <ul>
                    <li>Task description - Assigned to: Name - Due: Date</li>
                    <li>Task description - Assigned to: Name - Due: Date</li>
                </ul>
                
                <h3>Next Meeting:</h3>
                <p><strong>Date:</strong> </p>
                <p><strong>Agenda Preview:</strong> </p>
            `,
            lesson: `
                <h2>Lesson Summary - ${new Date().toLocaleDateString()}</h2>
                <p><strong>Course:</strong> CloseoutSoft Introduction</p>
                <p><strong>Lesson:</strong> </p>
                <p><strong>Instructor:</strong> </p>
                <p><strong>Duration:</strong> </p>
                
                <h3>Learning Objectives:</h3>
                <ul>
                    <li>Objective 1</li>
                    <li>Objective 2</li>
                    <li>Objective 3</li>
                </ul>
                
                <h3>Key Concepts Covered:</h3>
                <ul>
                    <li><strong>Concept 1:</strong> Brief explanation...</li>
                    <li><strong>Concept 2:</strong> Brief explanation...</li>
                    <li><strong>Concept 3:</strong> Brief explanation...</li>
                </ul>
                
                <h3>Important Details:</h3>
                <ul>
                    <li>Detail 1</li>
                    <li>Detail 2</li>
                </ul>
                
                <h3>Examples Discussed:</h3>
                <ul>
                    <li>Example 1 description</li>
                    <li>Example 2 description</li>
                </ul>
                
                <h3>Questions for Review:</h3>
                <ol>
                    <li>Question 1?</li>
                    <li>Question 2?</li>
                    <li>Question 3?</li>
                </ol>
                
                <h3>Additional Resources:</h3>
                <ul>
                    <li>Resource 1</li>
                    <li>Resource 2</li>
                </ul>
            `,
            qa: `
                <h2>Q&A Session - ${new Date().toLocaleDateString()}</h2>
                <p><strong>Topic:</strong> CloseoutSoft Features</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                
                <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #3B82F6; background: #EFF6FF;">
                    <h3 style="margin-top: 0; color: #1E40AF;">Q: What is CloseoutSoft?</h3>
                    <p><strong>A:</strong> CloseoutSoft is a comprehensive construction project closeout platform that streamlines the final phases of construction projects through digital document management and automated workflows.</p>
                </div>
                
                <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #10B981; background: #ECFDF5;">
                    <h3 style="margin-top: 0; color: #047857;">Q: How does the QA/QC process work?</h3>
                    <p><strong>A:</strong> The QA/QC process in CloseoutSoft includes automated checklists, digital inspections, photo documentation, and approval workflows to ensure quality standards are met.</p>
                </div>
                
                <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #F59E0B; background: #FFFBEB;">
                    <h3 style="margin-top: 0; color: #D97706;">Q: Add your question here?</h3>
                    <p><strong>A:</strong> Add your answer here...</p>
                </div>
                
                <h3>Follow-up Items:</h3>
                <ul>
                    <li>Research topic for next session</li>
                    <li>Practice with platform demo</li>
                </ul>
            `
        };
        
        if (templates[templateType]) {
            // Check if we're in empty state or have a current note
            const isEmptyState = document.getElementById('noteEditorEmpty').style.display !== 'none';
            
            if (isEmptyState || !this.currentNote) {
                // Create new note only if we're in empty state
                this.createNewNote();
                setTimeout(() => {
                    this.applyTemplate(templateType, templates[templateType]);
                }, 200);
            } else {
                // Apply template to current note
                this.applyTemplate(templateType, templates[templateType]);
            }
        }
    }

    applyTemplate(templateType, templateContent) {
        const titleInput = document.getElementById('noteTitle');
        const contentDiv = document.getElementById('noteContent');
        
        if (titleInput && contentDiv) {
            const templateNames = {
                meeting: 'Meeting Notes',
                lesson: 'Lesson Summary', 
                qa: 'Q&A Session'
            };
            
            // Only update title if it's empty or default
            if (!titleInput.value || titleInput.value === 'Untitled Note') {
                titleInput.value = `${templateNames[templateType]} - ${new Date().toLocaleDateString()}`;
            }
            
            contentDiv.innerHTML = templateContent;
            this.updateWordCount();
            this.markAsModified();
            this.showToast(`${templateNames[templateType]} template applied`, 'success');
        }
    }
}

// Global Functions (called from HTML onclick handlers)
let studyNotesManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    studyNotesManager = new StudyNotesManager();
    
    // Fix hardcoded HTML elements after initialization
    setTimeout(() => {
        // Make sure toolbar buttons have proper onclick handlers
        const linkBtn = document.querySelector('button[title="Insert Link"]');
        const imageBtn = document.querySelector('button[title="Insert Image"]');  
        const codeBtn = document.querySelector('button[title="Insert Code Block"]');
        
        if (linkBtn && !linkBtn.onclick) linkBtn.onclick = () => studyNotesManager.insertLink();
        if (imageBtn && !imageBtn.onclick) imageBtn.onclick = () => studyNotesManager.insertImage();
        if (codeBtn && !codeBtn.onclick) codeBtn.onclick = () => studyNotesManager.insertCodeBlock();
        
        // Bind template buttons
        const templateBtns = document.querySelectorAll('#noteEditorEmpty button');
        templateBtns.forEach(btn => {
            const text = btn.textContent;
            if (text.includes('Meeting Notes') && !btn.onclick) {
                btn.onclick = () => studyNotesManager.insertTemplate('meeting');
            } else if (text.includes('Lesson Summary') && !btn.onclick) {
                btn.onclick = () => studyNotesManager.insertTemplate('lesson'); 
            } else if (text.includes('Q&A Template') && !btn.onclick) {
                btn.onclick = () => studyNotesManager.insertTemplate('qa');
            }
        });
        
        // Bind AI popular questions
        const questionBtns = document.querySelectorAll('.bg-yellow-50 button');
        questionBtns.forEach(btn => {
            if (!btn.onclick) {
                const question = btn.textContent.replace(/"/g, '').trim();
                btn.onclick = () => studyNotesManager.askAI(question);
            }
        });
        
    }, 500);
});

// Global functions for HTML onclick handlers
function openNotesModal() {
    if (studyNotesManager) studyNotesManager.openNotesModal();
}

function closeNotesModal() {
    if (studyNotesManager) studyNotesManager.closeNotesModal();
}

function switchTab(tabName) {
    if (studyNotesManager) studyNotesManager.switchTab(tabName);
}

function createNewNote() {
    if (studyNotesManager) studyNotesManager.createNewNote();
}

function updateNoteTitle() {
    if (studyNotesManager) studyNotesManager.markAsModified();
}

function formatText(command, value = null) {
    if (studyNotesManager) studyNotesManager.formatText(command, value);
}

function insertList(type) {
    if (studyNotesManager) studyNotesManager.insertList(type);
}

function insertLink() {
    if (studyNotesManager) studyNotesManager.insertLink();
}

function insertImage() {
    if (studyNotesManager) studyNotesManager.insertImage();
}

function insertCodeBlock() {
    if (studyNotesManager) studyNotesManager.insertCodeBlock();
}

function updateWordCount() {
    if (studyNotesManager) studyNotesManager.updateWordCount();
}

function sendAIMessage() {
    if (studyNotesManager) studyNotesManager.sendAIMessage();
}

function askAI(question) {
    if (studyNotesManager) studyNotesManager.askAI(question);
}

function clearAIChat() {
    if (studyNotesManager) studyNotesManager.clearAIChat();
}

function exportAIConversation() {
    if (studyNotesManager) studyNotesManager.exportAIConversation();
}

function handleAIChatKeyPress(event) {
    if (studyNotesManager) studyNotesManager.handleAIChatKeyPress(event);
}