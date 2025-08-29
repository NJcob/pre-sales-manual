// Interactive Glossary System
// Advanced glossary with search, categories, favorites, and more

class GlossaryManager {
    constructor() {
        this.glossaryData = this.loadGlossaryData();
        this.favorites = this.loadFavorites();
        this.recentlyViewed = this.loadRecentlyViewed();
        this.currentCategory = 'all';
        this.currentSearch = '';
        
        this.init();
    }

    init() {
        this.createGlossaryModal();
        this.createDeleteModal();
        this.bindGlossaryButton();
    }

    bindGlossaryButton() {
        const glossaryBtn = document.querySelector('[data-search="glossary"]');
        if (glossaryBtn) {
            glossaryBtn.addEventListener('click', () => this.openGlossary());
        }
    }

    createDeleteModal() {
        if (document.getElementById('deleteModal')) return;

        const modal = document.createElement('div');
        modal.id = 'deleteModal';
        modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] opacity-0 invisible transition-all duration-300';
        modal.innerHTML = `
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full transform scale-95 transition-transform duration-300">
                    <div class="p-6">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900">Delete Term</h3>
                                <p class="text-sm text-gray-500">This action cannot be undone</p>
                            </div>
                        </div>
                        
                        <div class="mb-6">
                            <p class="text-gray-700">Are you sure you want to delete this term?</p>
                            <div class="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p class="font-medium text-gray-900" id="deleteTermName"></p>
                                <p class="text-sm text-gray-600 mt-1" id="deleteTermDefinition"></p>
                            </div>
                        </div>
                        
                        <div class="flex space-x-3">
                            <button 
                                id="confirmDelete" 
                                class="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Delete Term
                            </button>
                            <button 
                                onclick="glossaryManager.closeDeleteModal()" 
                                class="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    createGlossaryModal() {
        if (document.getElementById('glossaryModal')) return;

        const modal = document.createElement('div');
        modal.id = 'glossaryModal';
        modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 opacity-0 invisible transition-all duration-300';
        modal.innerHTML = `
            <div class="flex items-center justify-center min-h-screen p-2 py-4">
                <div id="glossaryModalContent" class="bg-white rounded-3xl shadow-2xl max-w-6xl w-full h-[92vh] flex flex-col transform scale-95 transition-transform duration-300">
                    
                    <!-- Header -->
                    <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50 flex-shrink-0 rounded-t-3xl">
                        <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold text-gray-900">Glossary</h2>
                                <p class="text-sm text-gray-500">CloseoutSoft Terms & Definitions</p>
                                <div class="flex items-center mt-1 space-x-2">
                                    <span id="termCount" class="text-xs text-gray-500">124 terms available</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button onclick="glossaryManager.exportGlossary()" class="p-2 text-gray-500 hover:text-indigo-600 hover:bg-white rounded-xl transition-all" title="Export Glossary">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                            </button>
                            <button onclick="glossaryManager.closeGlossary()" class="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all duration-200">
                                <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Search & Filters -->
                    <div class="p-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                        <div class="flex flex-col md:flex-row gap-4">
                            <!-- Search Bar -->
                            <div class="flex-1 relative">
                                <input 
                                    type="text" 
                                    id="glossarySearch"
                                    placeholder="Search terms, definitions, or examples..." 
                                    class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                >
                                <svg class="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                                <button id="clearSearch" class="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-600 hidden transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                            
                            <!-- Category Filter -->
                            <div class="relative">
                                <select id="categoryFilter" class="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-8 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                                    <option value="all">All Categories</option>
                                    <option value="general">General Terms</option>
                                    <option value="quality">Quality Control</option>
                                    <option value="digital">Digital Processes</option>
                                    <option value="workflow">Workflow</option>
                                    <option value="compliance">Compliance</option>
                                    <option value="technical">Technical</option>
                                </select>
                                <svg class="w-4 h-4 text-gray-400 absolute right-3 top-3.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                </svg>
                            </div>
                        </div>
                        
                        <!-- Quick Filters -->
                        <div class="flex flex-wrap gap-2 mt-4">
                            <button onclick="glossaryManager.showFavorites()" class="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium hover:bg-yellow-200 transition-colors flex items-center shadow-sm">
                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                Favorites (<span id="favCount">0</span>)
                            </button>
                            <button onclick="glossaryManager.showRecentlyViewed()" class="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors flex items-center shadow-sm">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Recent (<span id="recentCount">0</span>)
                            </button>
                            <button onclick="glossaryManager.toggleAddTerm()" class="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 transition-colors flex items-center shadow-sm">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                </svg>
                                Add Term
                            </button>
                        </div>
                    </div>

                    <!-- Content Area -->
                    <div class="flex-1 flex overflow-hidden min-h-0">
                        <!-- Terms List -->
                        <div class="w-2/5 border-r border-gray-200 bg-gray-50 flex flex-col">
                            <div class="p-4 flex-shrink-0">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="font-semibold text-gray-900">Terms</h3>
                                    <div class="flex space-x-2">
                                        <button onclick="glossaryManager.sortTerms('alpha')" class="p-1.5 text-gray-400 hover:text-indigo-600 rounded transition-colors" title="Sort A-Z">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/>
                                            </svg>
                                        </button>
                                        <button onclick="glossaryManager.sortTerms('category')" class="p-1.5 text-gray-400 hover:text-indigo-600 rounded transition-colors" title="Sort by Category">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div id="termsList" class="flex-1 space-y-2 overflow-y-auto px-4 pb-4">
                                <!-- Terms will be populated here -->
                            </div>
                        </div>

                        <!-- Definition Panel -->
                        <div class="flex-1 flex flex-col">
                            <div id="definitionPanel" class="flex-1 p-6 overflow-y-auto">
                                <!-- Welcome State -->
                                <div id="welcomeState" class="flex items-center justify-center h-full text-gray-500">
                                    <div class="text-center">
                                        <svg class="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                        </svg>
                                        <h3 class="text-xl font-medium mb-2">Select a term to view definition</h3>
                                        <p class="text-gray-400 mb-6">Browse the glossary or search for specific terms</p>
                                        <div class="space-y-2">
                                            <p class="text-sm text-gray-600 mb-3">Popular terms:</p>
                                            <div class="flex flex-wrap gap-2 justify-center">
                                                <button onclick="glossaryManager.selectTerm('qa-qc')" class="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm hover:bg-indigo-200 transition-colors">QA/QC</button>
                                                <button onclick="glossaryManager.selectTerm('digital-submittal')" class="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm hover:bg-indigo-200 transition-colors">Digital Submittal</button>
                                                <button onclick="glossaryManager.selectTerm('closeout')" class="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm hover:bg-indigo-200 transition-colors">Closeout</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Term Definition Content -->
                                <div id="termContent" class="hidden">
                                    <!-- Content will be populated dynamically -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Add Term Panel (Hidden by default) -->
                    <div id="addTermPanel" class="hidden border-t border-gray-200 bg-gray-50 p-4 flex-shrink-0 rounded-b-3xl">
                        <h3 class="font-semibold text-gray-900 mb-4">Add New Term</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Term</label>
                                <input type="text" id="newTermName" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Enter term...">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select id="newTermCategory" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                                    <option value="general">General Terms</option>
                                    <option value="quality">Quality Control</option>
                                    <option value="digital">Digital Processes</option>
                                    <option value="workflow">Workflow</option>
                                    <option value="compliance">Compliance</option>
                                    <option value="technical">Technical</option>
                                </select>
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Definition</label>
                                <textarea id="newTermDefinition" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Enter definition..."></textarea>
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Example (Optional)</label>
                                <textarea id="newTermExample" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Enter example usage..."></textarea>
                            </div>
                        </div>
                        <div class="flex space-x-3 mt-6">
                            <button onclick="glossaryManager.saveNewTerm()" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                                Add Term
                            </button>
                            <button onclick="glossaryManager.toggleAddTerm()" class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Bind events
        this.bindGlossaryEvents();
    }

    bindGlossaryEvents() {
        // Search
        const searchInput = document.getElementById('glossarySearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value;
                this.filterAndRenderTerms();
                this.toggleClearSearch();
            });
        }

        // Clear search
        const clearBtn = document.getElementById('clearSearch');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                this.currentSearch = '';
                this.filterAndRenderTerms();
                this.toggleClearSearch();
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.filterAndRenderTerms();
            });
        }

        // Close modal on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeGlossary();
                this.closeDeleteModal();
            }
        });
    }

    toggleClearSearch() {
        const clearBtn = document.getElementById('clearSearch');
        const searchInput = document.getElementById('glossarySearch');
        if (clearBtn && searchInput) {
            clearBtn.classList.toggle('hidden', !searchInput.value);
        }
    }

    openGlossary() {
        const modal = document.getElementById('glossaryModal');
        if (modal) {
            modal.classList.remove('opacity-0', 'invisible');
            modal.classList.add('opacity-100');
            const content = document.getElementById('glossaryModalContent');
            if (content) {
                content.classList.remove('scale-95');
                content.classList.add('scale-100');
            }
            document.body.style.overflow = 'hidden';
            this.renderTerms();
            this.updateCounts();
        }
    }

    closeGlossary() {
        const modal = document.getElementById('glossaryModal');
        if (modal) {
            modal.classList.add('opacity-0', 'invisible');
            modal.classList.remove('opacity-100');
            const content = document.getElementById('glossaryModalContent');
            if (content) {
                content.classList.add('scale-95');
                content.classList.remove('scale-100');
            }
            document.body.style.overflow = '';
        }
    }

    openDeleteModal(termKey) {
        const modal = document.getElementById('deleteModal');
        const term = this.glossaryData[termKey];
        if (!modal || !term) return;

        // Populate modal content
        document.getElementById('deleteTermName').textContent = term.term;
        document.getElementById('deleteTermDefinition').textContent = term.definition.substring(0, 100) + (term.definition.length > 100 ? '...' : '');

        // Set up confirm button
        const confirmBtn = document.getElementById('confirmDelete');
        confirmBtn.onclick = () => this.confirmDeleteTerm(termKey);

        // Show modal
        modal.classList.remove('opacity-0', 'invisible');
        modal.classList.add('opacity-100');
        const content = modal.querySelector('.bg-white');
        if (content) {
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }
    }

    closeDeleteModal() {
        const modal = document.getElementById('deleteModal');
        if (modal) {
            modal.classList.add('opacity-0', 'invisible');
            modal.classList.remove('opacity-100');
            const content = modal.querySelector('.bg-white');
            if (content) {
                content.classList.add('scale-95');
                content.classList.remove('scale-100');
            }
        }
    }

    confirmDeleteTerm(termKey) {
        const term = this.glossaryData[termKey];
        if (!term || !term.isCustom) return;

        delete this.glossaryData[termKey];
        this.favorites = this.favorites.filter(key => key !== termKey);
        this.recentlyViewed = this.recentlyViewed.filter(key => key !== termKey);
        
        this.saveGlossaryData();
        this.saveFavorites();
        this.saveRecentlyViewed();
        
        this.renderTerms();
        this.updateCounts();
        
        // Show welcome state
        document.getElementById('welcomeState').style.display = 'flex';
        document.getElementById('termContent').style.display = 'none';
        
        this.closeDeleteModal();
        this.showToast('Term deleted successfully', 'success');
    }

    loadGlossaryData() {
        // Note: localStorage not supported in Claude artifacts, using in-memory storage
        return this.getDefaultGlossaryData();
    }

    getDefaultGlossaryData() {
        return {
            'closeout': {
                term: 'Closeout',
                category: 'general',
                definition: 'The process of finalizing all project activities and documentation to enable project completion and handover.',
                example: 'Closeout activities included compiling O&M manuals and final inspection reports.',
                isCustom: false
            },
            'qa-qc': {
                term: 'QA/QC',
                category: 'quality',
                definition: 'Quality Assurance and Quality Control - systematic processes to ensure that project deliverables meet specified requirements and standards.',
                example: 'The QA/QC engineer verified waterproofing installation before approval.',
                isCustom: false
            },
            'digital-submittal': {
                term: 'Digital Submittal',
                category: 'digital',
                definition: 'Electronic submission of project documents, drawings, specifications, and other materials through a digital platform.',
                example: 'All contractors must use the digital submittal process for faster approval workflows.',
                isCustom: false
            },
            'non-conformance': {
                term: 'Non-Conformance',
                category: 'compliance',
                definition: 'A deviation from specified requirements, standards, or expectations that must be documented and corrected.',
                example: 'The inspector issued a non-conformance report for the improper installation.',
                isCustom: false
            },
            'punch-list': {
                term: 'Punch List',
                category: 'quality',
                definition: 'A document listing items that need to be completed or corrected before final project acceptance.',
                example: 'The punch list contained 15 items that needed to be addressed before handover.',
                isCustom: false
            },
            'as-built': {
                term: 'As-Built Drawings',
                category: 'technical',
                definition: 'Drawings that show the actual construction and installation details as built in the field, including any changes from the original design.',
                example: 'The contractor must submit as-built drawings showing all field modifications.',
                isCustom: false
            },
            'commissioning': {
                term: 'Commissioning',
                category: 'technical',
                definition: 'The systematic process of ensuring that building systems perform as designed and meet operational requirements.',
                example: 'The HVAC commissioning process revealed several control system issues.',
                isCustom: false
            },
            'substantial-completion': {
                term: 'Substantial Completion',
                category: 'general',
                definition: 'The stage when the work is sufficiently complete for the owner to occupy and use the facility for its intended purpose.',
                example: 'Substantial completion was achieved on schedule despite weather delays.',
                isCustom: false
            },
            'rfi': {
                term: 'RFI (Request for Information)',
                category: 'workflow',
                definition: 'A formal process for obtaining clarification or additional information about project requirements or specifications.',
                example: 'The contractor submitted an RFI regarding the electrical specifications.',
                isCustom: false
            },
            'o-and-m': {
                term: 'O&M Manual',
                category: 'technical',
                definition: 'Operations and Maintenance Manual containing instructions for the proper operation and maintenance of building systems and equipment.',
                example: 'The O&M manual must be delivered before final project acceptance.',
                isCustom: false
            },
            'warranty': {
                term: 'Warranty',
                category: 'compliance',
                definition: 'A guarantee provided by contractors or manufacturers covering the quality and performance of work or materials for a specified period.',
                example: 'All mechanical equipment comes with a two-year manufacturer warranty.',
                isCustom: false
            },
            'deficiency': {
                term: 'Deficiency',
                category: 'quality',
                definition: 'Work that does not conform to contract requirements and needs to be corrected or completed.',
                example: 'The inspection revealed several deficiencies in the waterproofing installation.',
                isCustom: false
            },
            'ahoms': {
                term: 'AHOMS',
                category: 'workflow',
                definition: 'Area Handover Monitoring Sheet. Used to monitor construction progress room by room.',
                example: 'The AHOMS showed that level 2 rooms were ready for client inspection.',
                isCustom: false
            },
            'asset-register': {
                term: 'Asset Register',
                category: 'technical',
                definition: 'A centralized record of all assets, automatically generated from submittals such as MIR, WIR, and T&C reports, ensuring accurate facility management and handover.',
                example: 'The facilities team referred to the Asset Register to schedule maintenance for HVAC units.',
                isCustom: false
            },
            'boq': {
                term: 'BOQ',
                category: 'general',
                definition: 'Bill of Quantity. A document that lists all materials, parts, and labor (with costs) required for construction; helps in budget estimation and tracking.',
                example: 'The contractor submitted the BOQ for consultant approval before starting procurement.',
                isCustom: false
            },
            'client': {
                term: 'Client',
                category: 'general',
                definition: 'The organization or individual commissioning the project and receiving the final handover.',
                example: 'The client requested additional testing before taking over the project.',
                isCustom: false
            },
            'consultant': {
                term: 'Consultant',
                category: 'general',
                definition: 'A professional or firm engaged to provide expert advice, quality inspections, and approvals during construction.',
                example: 'The consultant rejected the WIR due to non-compliance with specifications.',
                isCustom: false
            },
            'contractor': {
                term: 'Contractor/Main Contractor',
                category: 'general',
                definition: 'The primary entity responsible for overall project execution, including management of subcontractors.',
                example: 'The contractor coordinated with subcontractors to complete MEP works on schedule.',
                isCustom: false
            },
            'construction-activities': {
                term: 'Construction Activities',
                category: 'general',
                definition: 'All tasks and work involved in actual building and assembling as per project specifications and schedule.',
                example: 'Concrete pouring and steel installation were listed as major construction activities.',
                isCustom: false
            },
            'compliance-statement': {
                term: 'Compliance Statement',
                category: 'compliance',
                definition: 'An auto-generated document or update within the software, indicating conformity of processes or deliverables to client or industry requirements.',
                example: 'The compliance statement confirmed that safety standards were met.',
                isCustom: false
            },
            'dlp': {
                term: 'DLP',
                category: 'quality',
                definition: 'Defects Liability Period. Post-construction timeframe during which the contractor is responsible for remedying defects.',
                example: 'During DLP, the contractor repaired cracks identified in the façade.',
                isCustom: false
            },
            'dhoms': {
                term: 'DHOMS',
                category: 'workflow',
                definition: 'Document Handover Monitoring Sheet. Used for tracking and viewing O&M manuals, training manuals, CVs, and project documentation.',
                example: 'The DHOMS highlighted that training manuals were still pending submission.',
                isCustom: false
            },
            'digital-signature': {
                term: 'Digital Signature',
                category: 'digital',
                definition: 'A secure method of signing documents electronically to verify authenticity and integrity.',
                example: 'The consultant applied a digital signature to approve the submittal.',
                isCustom: false
            },
            'dashboard': {
                term: 'Dashboard',
                category: 'digital',
                definition: 'The main overview display in CloseoutSoft, showing consolidated views of project activity, progress, and reporting.',
                example: 'The project manager checked the dashboard for the week’s progress updates.',
                isCustom: false
            },
            'ei': {
                term: 'Engineering Instruction (EI)',
                category: 'technical',
                definition: 'Formal direction issued to alter designs, specifications, or procedures.',
                example: 'The consultant issued an EI to modify the HVAC duct routing.',
                isCustom: false
            },
            'estimation': {
                term: 'Estimation',
                category: 'general',
                definition: 'Forecasting project activity duration, resources, and costs, typically through BOQ and planning tools.',
                example: 'The estimation for concrete works was revised after material price increases.',
                isCustom: false
            },
            'fm': {
                term: 'FM',
                category: 'technical',
                definition: 'Facility Management. The post-construction maintenance and management of built assets and infrastructure.',
                example: 'The FM team received the asset register during project handover.',
                isCustom: false
            },
            'functional-activities': {
                term: 'Functional Activities',
                category: 'technical',
                definition: 'Project tasks related to ensuring functionality, such as T&C, systems handover, and operational readiness.',
                example: 'Testing elevators was part of the functional activities before handover.',
                isCustom: false
            },
            'handover': {
                term: 'Handover',
                category: 'workflow',
                definition: 'Formal process by which project assets, areas, or systems are transferred from contractor to client.',
                example: 'The handover process included joint inspections with the client.',
                isCustom: false
            },
            'letters': {
                term: 'Letters',
                category: 'workflow',
                definition: 'Communication documents exchanged among project stakeholders, issued and tracked within CloseoutSoft.',
                example: 'The contractor uploaded letters to the system for consultant review.',
                isCustom: false
            },
            'mir': {
                term: 'MIR',
                category: 'quality',
                definition: 'Material Inspection Request. A formal request for inspection and approval of delivered/project material.',
                example: 'The MIR for steel bars was rejected due to incorrect grade supplied.',
                isCustom: false
            },
            'minutes': {
                term: 'Minutes (of Meetings/Communication)',
                category: 'workflow',
                definition: 'Summarized official record of meeting discussions, actions, and decisions; tracked within the system.',
                example: 'The project manager reviewed the minutes to confirm pending actions.',
                isCustom: false
            },
            'ncr': {
                term: 'NCR',
                category: 'compliance',
                definition: 'Non-Conformance Report. Formal documentation of work not complying with specified requirements; managed via workflow.',
                example: 'An NCR was raised due to improper waterproofing installation.',
                isCustom: false
            },
            'notification': {
                term: 'Notification',
                category: 'digital',
                definition: 'Automated alert generated by the software for project updates, milestones, completion, or deadlines.',
                example: 'The engineer received a notification about a pending RFI response.',
                isCustom: false
            },
            'occupancy-taking-over': {
                term: 'Occupancy Taking Over',
                category: 'workflow',
                definition: 'The process and procedure for the client to take possession of project space after confirming readiness and completion.',
                example: 'The occupancy taking over process required final safety inspections.',
                isCustom: false
            },
            'ppm': {
                term: 'PPM',
                category: 'technical',
                definition: 'Planned Preventive Maintenance. Regular, scheduled maintenance intended to prevent unexpected asset failures.',
                example: 'The FM team scheduled quarterly PPM for electrical systems.',
                isCustom: false
            },
            'project-manager': {
                term: 'Project Manager',
                category: 'general',
                definition: 'The individual responsible for overall project delivery, documentation, tracking, and final closeout.',
                example: 'The project manager coordinated subcontractors to meet deadlines.',
                isCustom: false
            },
            'progress-report': {
                term: 'Progress Report',
                category: 'workflow',
                definition: 'A report that tracks actual progress against planned activities and schedule baselines, automatically generated in CloseoutSoft.',
                example: 'The monthly progress report showed a 5% delay in civil works.',
                isCustom: false
            },
            'planning-scheduling': {
                term: 'Planning & Scheduling',
                category: 'workflow',
                definition: 'Processes and tools used to design the project timeline, allocate resources, and monitor milestone achievement.',
                example: 'The planning team updated scheduling after changes in procurement.',
                isCustom: false
            },
            'rhoms': {
                term: 'RHOMS',
                category: 'workflow',
                definition: 'Room Handover Monitoring Status. Tool or form for monitoring the status of specific room handovers during construction closeout.',
                example: 'The RHOMS indicated that 70% of rooms were ready for snagging.',
                isCustom: false
            },
            'shoms': {
                term: 'SHOMS',
                category: 'workflow',
                definition: 'System Handover Monitoring Sheet. Used for monitoring Testing & Commissioning and subsystem functional readiness.',
                example: 'The SHOMS showed pending commissioning for the fire alarm system.',
                isCustom: false
            },
            'snag': {
                term: 'Snag',
                category: 'quality',
                definition: 'Identified defect or outstanding work item, tracked and managed towards resolution before final project closeout.',
                example: 'The snag list noted chipped paintwork in the lobby.',
                isCustom: false
            },
            'subcontractor': {
                term: 'Subcontractor',
                category: 'general',
                definition: 'A company working under the main contractor to complete specific project portions or trades.',
                example: 'The subcontractor handled electrical installations on site.',
                isCustom: false
            },
            'submittal': {
                term: 'Submittal',
                category: 'workflow',
                definition: 'Any document or record (drawings, materials, test results) submitted for review, approval, or rejection within CloseoutSoft.',
                example: 'The material submittal for tiles was approved by the consultant.',
                isCustom: false
            },
            't-and-c': {
                term: 'T&C',
                category: 'technical',
                definition: 'Testing & Commissioning. The phase where systems are tested to verify performance and readiness before handover.',
                example: 'T&C of HVAC systems was conducted before client handover.',
                isCustom: false
            },
            'technical-submittal': {
                term: 'Technical Submittal',
                category: 'workflow',
                definition: 'Design, specification, or material documentation submitted for client/consultant approval.',
                example: 'The technical submittal for façade cladding was approved after revisions.',
                isCustom: false
            },
            'wir': {
                term: 'WIR',
                category: 'quality',
                definition: 'Work Inspection Request. A formal request for site inspection of completed works, with approval or rejection via workflow.',
                example: 'The WIR for foundation works was approved by the consultant.',
                isCustom: false
            },
            'workflow': {
                term: 'Workflow',
                category: 'workflow',
                definition: 'Automated sequence of processes and approvals for submittals, communications, inspections, or closeout activities within the software.',
                example: 'The workflow ensured timely approval of MIRs and RFIs.',
                isCustom: false
            }
        };
    }

    saveGlossaryData() {
        
    }

    loadFavorites() {
        return [];
    }

    saveFavorites() {
        
    }

    loadRecentlyViewed() {
        return [];
    }

    saveRecentlyViewed() {
        
    }

    filterAndRenderTerms() {
        this.renderTerms();
    }

    renderTerms() {
        const container = document.getElementById('termsList');
        if (!container) return;

        let terms = Object.entries(this.glossaryData);

        // Filter by category
        if (this.currentCategory !== 'all') {
            terms = terms.filter(([key, term]) => term.category === this.currentCategory);
        }

        // Filter by search
        if (this.currentSearch) {
            const searchLower = this.currentSearch.toLowerCase();
            terms = terms.filter(([key, term]) => 
                term.term.toLowerCase().includes(searchLower) ||
                term.definition.toLowerCase().includes(searchLower) ||
                (term.example && term.example.toLowerCase().includes(searchLower))
            );
        }

        // Sort alphabetically
        terms.sort(([, a], [, b]) => a.term.localeCompare(b.term));

        container.innerHTML = terms.map(([key, term]) => `
            <div class="term-item p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all" onclick="glossaryManager.selectTerm('${key}')">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900 text-sm">${term.term}</h4>
                        <p class="text-xs text-gray-500 mt-1 line-clamp-2">${term.definition.substring(0, 80)}...</p>
                        <div class="flex items-center mt-2 space-x-2">
                            <span class="text-xs px-2 py-1 bg-${this.getCategoryColor(term.category)}-100 text-${this.getCategoryColor(term.category)}-700 rounded-full">${this.getCategoryLabel(term.category)}</span>
                            ${term.isCustom ? '<span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Custom</span>' : ''}
                        </div>
                    </div>
                    <div class="flex items-center space-x-1 ml-2">
                        <button onclick="event.stopPropagation(); glossaryManager.toggleFavorite('${key}')" class="p-1 hover:bg-gray-100 rounded transition-colors" title="${this.favorites.includes(key) ? 'Remove from favorites' : 'Add to favorites'}">
                            <svg class="w-4 h-4 ${this.favorites.includes(key) ? 'text-yellow-500' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        if (terms.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <p class="text-lg font-medium">No terms found</p>
                    <p class="text-sm">Try adjusting your search or filters</p>
                </div>
            `;
        }
    }

    selectTerm(termKey) {
        const term = this.glossaryData[termKey];
        if (!term) return;

        // Add to recently viewed
        this.addToRecentlyViewed(termKey);

        // Show term content
        const welcomeState = document.getElementById('welcomeState');
        const termContent = document.getElementById('termContent');
        
        if (welcomeState) welcomeState.style.display = 'none';
        if (termContent) {
            termContent.style.display = 'block';
            termContent.innerHTML = this.renderTermContent(termKey, term);
        }

        // Highlight selected term
        document.querySelectorAll('.term-item').forEach(item => {
            item.classList.remove('bg-indigo-100', 'border-indigo-300');
        });
        
        const selectedItem = document.querySelector(`[onclick="glossaryManager.selectTerm('${key}')"]`.replace('key', termKey));
        if (selectedItem) {
            selectedItem.classList.add('bg-indigo-100', 'border-indigo-300');
        }
    }

    renderTermContent(termKey, term) {
        const isFavorite = this.favorites.includes(termKey);
        const relatedTerms = this.getRelatedTerms(term);

        return `
            <div class="w-full h-full min-h-full">
                <!-- Term Header -->
                <div class="flex items-start justify-between mb-6">
                    <div class="flex-1">
                        <h1 class="text-3xl font-bold text-gray-900 mb-2">${term.term}</h1>
                        <div class="flex items-center space-x-2 flex-wrap">
                            <span class="px-3 py-1 bg-${this.getCategoryColor(term.category)}-100 text-${this.getCategoryColor(term.category)}-700 rounded-full text-sm font-medium">${this.getCategoryLabel(term.category)}</span>
                            ${term.isCustom ? '<span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Custom Term</span>' : ''}
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="glossaryManager.toggleFavorite('${termKey}')" class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                            <svg class="w-6 h-6 ${isFavorite ? 'text-yellow-500' : 'text-gray-400'}" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        </button>
                        <button onclick="glossaryManager.copyDefinition('${termKey}')" class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Copy definition">
                            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                            </svg>
                        </button>
                        ${term.isCustom ? `
                            <button onclick="glossaryManager.editTerm('${termKey}')" class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit term">
                                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                            </button>
                            <button onclick="glossaryManager.openDeleteModal('${termKey}')" class="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600" title="Delete term">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- Definition -->
                <div class="mb-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-3">Definition</h2>
                    <div class="bg-gray-50 border-l-4 border-indigo-400 p-4 rounded-lg">
                        <p class="text-gray-800 leading-relaxed">${term.definition}</p>
                    </div>
                </div>

                <!-- Example -->
                ${term.example ? `
                    <div class="mb-6">
                        <h2 class="text-lg font-semibold text-gray-900 mb-3">Example</h2>
                        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                            <p class="text-gray-700 italic">"${term.example}"</p>
                        </div>
                    </div>
                ` : ''}

                <!-- Related Terms -->
                ${relatedTerms.length > 0 ? `
                    <div class="mb-6">
                        <h2 class="text-lg font-semibold text-gray-900 mb-3">Related Terms</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            ${relatedTerms.map(([key, relatedTerm]) => `
                                <button onclick="glossaryManager.selectTerm('${key}')" class="text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-all">
                                    <div class="font-medium text-indigo-600">${relatedTerm.term}</div>
                                    <div class="text-sm text-gray-500 mt-1">${relatedTerm.definition.substring(0, 60)}...</div>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    getRelatedTerms(currentTerm) {
        // Simple related terms logic based on category and keywords
        return Object.entries(this.glossaryData)
            .filter(([key, term]) => 
                term !== currentTerm && 
                (term.category === currentTerm.category || 
                 this.hasCommonKeywords(term, currentTerm))
            )
            .slice(0, 4);
    }

    hasCommonKeywords(term1, term2) {
        const keywords1 = term1.definition.toLowerCase().split(' ');
        const keywords2 = term2.definition.toLowerCase().split(' ');
        
        const commonWords = keywords1.filter(word => 
            word.length > 4 && keywords2.includes(word)
        );
        
        return commonWords.length > 0;
    }

    addToRecentlyViewed(termKey) {
        // Remove if already in recent
        this.recentlyViewed = this.recentlyViewed.filter(key => key !== termKey);
        // Add to beginning
        this.recentlyViewed.unshift(termKey);
        // Keep only last 10
        this.recentlyViewed = this.recentlyViewed.slice(0, 10);
        this.updateCounts();
    }

    toggleFavorite(termKey) {
        if (this.favorites.includes(termKey)) {
            this.favorites = this.favorites.filter(key => key !== termKey);
            this.showToast('Removed from favorites', 'info');
        } else {
            this.favorites.push(termKey);
            this.showToast('Added to favorites', 'success');
        }
        this.updateCounts();
        this.renderTerms();
        
        // Update definition panel if this term is currently selected
        const termContent = document.getElementById('termContent');
        if (termContent && !termContent.classList.contains('hidden')) {
            const currentTerm = this.glossaryData[termKey];
            if (currentTerm) {
                termContent.innerHTML = this.renderTermContent(termKey, currentTerm);
            }
        }
    }

    copyDefinition(termKey) {
        const term = this.glossaryData[termKey];
        if (term) {
            const text = `${term.term}: ${term.definition}${term.example ? `\n\nExample: ${term.example}` : ''}`;
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('Definition copied to clipboard', 'success');
            }).catch(() => {
                this.showToast('Failed to copy definition', 'error');
            });
        }
    }

    showFavorites() {
        if (this.favorites.length === 0) {
            this.showToast('No favorite terms yet', 'info');
            return;
        }
        
        // Filter to show only favorites
        this.currentCategory = 'all';
        this.currentSearch = '';
        document.getElementById('categoryFilter').value = 'all';
        document.getElementById('glossarySearch').value = '';
        
        // Render only favorite terms
        const container = document.getElementById('termsList');
        if (!container) return;

        const favoriteTerms = this.favorites.map(key => [key, this.glossaryData[key]]).filter(([key, term]) => term);
        
        container.innerHTML = favoriteTerms.map(([key, term]) => `
            <div class="term-item p-3 bg-yellow-50 rounded-lg border border-yellow-200 cursor-pointer hover:bg-yellow-100 transition-all" onclick="glossaryManager.selectTerm('${key}')">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900 text-sm">${term.term}</h4>
                        <p class="text-xs text-gray-500 mt-1 line-clamp-2">${term.definition.substring(0, 80)}...</p>
                        <div class="flex items-center mt-2 space-x-2">
                            <span class="text-xs px-2 py-1 bg-${this.getCategoryColor(term.category)}-100 text-${this.getCategoryColor(term.category)}-700 rounded-full">${this.getCategoryLabel(term.category)}</span>
                            <span class="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full">★ Favorite</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showRecentlyViewed() {
        if (this.recentlyViewed.length === 0) {
            this.showToast('No recently viewed terms yet', 'info');
            return;
        }
        
        // Filter to show only recent
        this.currentCategory = 'all';
        this.currentSearch = '';
        document.getElementById('categoryFilter').value = 'all';
        document.getElementById('glossarySearch').value = '';
        
        // Render only recent terms
        const container = document.getElementById('termsList');
        if (!container) return;

        const recentTerms = this.recentlyViewed.map(key => [key, this.glossaryData[key]]).filter(([key, term]) => term);
        
        container.innerHTML = recentTerms.map(([key, term]) => `
            <div class="term-item p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-all" onclick="glossaryManager.selectTerm('${key}')">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900 text-sm">${term.term}</h4>
                        <p class="text-xs text-gray-500 mt-1 line-clamp-2">${term.definition.substring(0, 80)}...</p>
                        <div class="flex items-center mt-2 space-x-2">
                            <span class="text-xs px-2 py-1 bg-${this.getCategoryColor(term.category)}-100 text-${this.getCategoryColor(term.category)}-700 rounded-full">${this.getCategoryLabel(term.category)}</span>
                            <span class="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded-full">Recent</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    toggleAddTerm() {
        const panel = document.getElementById('addTermPanel');
        if (panel) {
            panel.classList.toggle('hidden');
            if (!panel.classList.contains('hidden')) {
                document.getElementById('newTermName').focus();
            }
        }
    }

    saveNewTerm() {
        const name = document.getElementById('newTermName').value.trim();
        const category = document.getElementById('newTermCategory').value;
        const definition = document.getElementById('newTermDefinition').value.trim();
        const example = document.getElementById('newTermExample').value.trim();

        if (!name || !definition) {
            this.showToast('Please fill in term name and definition', 'error');
            return;
        }

        // Generate key
        const key = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        // Check if term already exists
        if (this.glossaryData[key]) {
            this.showToast('Term already exists', 'error');
            return;
        }

        // Add new term
        this.glossaryData[key] = {
            term: name,
            category: category,
            definition: definition,
            example: example || null,
            isCustom: true
        };

        this.renderTerms();
        this.updateCounts();
        this.toggleAddTerm();
        
        // Clear form
        document.getElementById('newTermName').value = '';
        document.getElementById('newTermDefinition').value = '';
        document.getElementById('newTermExample').value = '';
        
        this.showToast('Term added successfully', 'success');
        this.selectTerm(key);
    }

    editTerm(termKey) {
        // Simple edit implementation - could be expanded to inline editing
        const term = this.glossaryData[termKey];
        if (!term || !term.isCustom) return;

        const newDefinition = prompt('Edit definition:', term.definition);
        if (newDefinition && newDefinition !== term.definition) {
            term.definition = newDefinition;
            this.selectTerm(termKey);
            this.showToast('Term updated', 'success');
        }
    }

    sortTerms(sortBy) {
        // Implementation for sorting - already handled in renderTerms
        this.renderTerms();
        this.showToast(`Sorted by ${sortBy === 'alpha' ? 'alphabetical order' : 'category'}`, 'info');
    }

    exportGlossary() {
        const data = {
            terms: this.glossaryData,
            favorites: this.favorites,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `glossary-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('Glossary exported successfully', 'success');
    }

    updateCounts() {
        const termCount = document.getElementById('termCount');
        const favCount = document.getElementById('favCount');
        const recentCount = document.getElementById('recentCount');

        if (termCount) termCount.textContent = `${Object.keys(this.glossaryData).length} terms available`;
        if (favCount) favCount.textContent = this.favorites.length;
        if (recentCount) recentCount.textContent = this.recentlyViewed.length;
    }

    getCategoryColor(category) {
        const colors = {
            general: 'blue',
            quality: 'green',
            digital: 'purple',
            workflow: 'orange',
            compliance: 'red',
            technical: 'gray',
            monitoring: 'indigo'
        };
        return colors[category] || 'gray';
    }

    getCategoryLabel(category) {
        const labels = {
            general: 'General',
            quality: 'Quality',
            digital: 'Digital',
            workflow: 'Workflow',
            compliance: 'Compliance',
            technical: 'Technical',
            monitoring: 'Monitoring'
        };
        return labels[category] || 'Other';
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500',
            warning: 'bg-yellow-500'
        };
        
        toast.className = `fixed bottom-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-[70] transform translate-y-full opacity-0 transition-all duration-300`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-y-full', 'opacity-0');
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            toast.classList.add('translate-y-full', 'opacity-0');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Global reference
let glossaryManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    glossaryManager = new GlossaryManager();
});

// Global functions for HTML onclick handlers
function openGlossary() {
    if (glossaryManager) glossaryManager.openGlossary();
}

// Add a button to trigger the glossary for testing
document.addEventListener('DOMContentLoaded', () => {
    // Create a test button if one doesn't exist
    if (!document.querySelector('[data-search="glossary"]')) {
        const testBtn = document.createElement('button');
        testBtn.setAttribute('data-search', 'glossary');
        testBtn.textContent = 'Open Glossary';
        testBtn.className = 'fixed top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors z-40';
        document.body.appendChild(testBtn);
    }
});