// Lesson Sharing System
// Comprehensive sharing functionality for lessons and study materials

class LessonShareManager {
    constructor() {
        this.currentLesson = this.loadCurrentLessonData();
        this.sharedLessons = this.loadSharedLessons();
        this.shareHistory = this.loadShareHistory();
        
        this.init();
    }

    init() {
        this.createShareModal();
        this.bindShareButton();
    }

    bindShareButton() {
        const shareBtn = document.querySelector('[data-search="share lesson"]');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.openShareModal());
        }
    }

    loadCurrentLessonData() {
        // Mock lesson data - in real app, this would come from the current lesson context
        return {
            id: 'closeout-intro-lesson-1',
            title: 'CloseoutSoft Introduction - Lesson 1',
            course: 'CloseoutSoft Fundamentals',
            instructor: 'Sarah Johnson',
            duration: '45 minutes',
            progress: 75,
            description: 'Learn the fundamental concepts of CloseoutSoft, including digital submittal processes, QA/QC procedures, and project closeout workflows.',
            objectives: [
                'Understand the core features of CloseoutSoft',
                'Learn digital submittal workflows',
                'Master QA/QC procedures',
                'Apply best practices for project closeout'
            ],
            keyTopics: [
                'Digital Document Management',
                'Quality Assurance Procedures',
                'Automated Workflows',
                'Compliance Tracking',
                'Project Handover Process'
            ],
            completionDate: new Date().toISOString(),
            certificateEligible: true,
            difficulty: 'Beginner',
            category: 'Construction Management'
        };
    }

    loadSharedLessons() {
        const saved = localStorage.getItem('sharedLessons');
        return saved ? JSON.parse(saved) : [];
    }

    saveSharedLessons() {
        localStorage.setItem('sharedLessons', JSON.stringify(this.sharedLessons));
    }

    loadShareHistory() {
        const saved = localStorage.getItem('shareHistory');
        return saved ? JSON.parse(saved) : [];
    }

    saveShareHistory() {
        localStorage.setItem('shareHistory', JSON.stringify(this.shareHistory));
    }

    createShareModal() {
        if (document.getElementById('shareModal')) return;

        const modal = document.createElement('div');
        modal.id = 'shareModal';
        modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 opacity-0 invisible transition-all duration-300';
        modal.innerHTML = `
            <div class="flex items-start justify-center min-h-screen p-4 pt-8">
                <div id="shareModalContent" class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col transform scale-95 transition-transform duration-300">
                    
                    <!-- Header -->
                    <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                        <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                                </svg>
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold text-gray-900">Share Lesson</h2>
                                <p class="text-sm text-gray-500">${this.currentLesson.title}</p>
                                <div class="flex items-center mt-1 space-x-2">
                                    <span class="text-xs text-gray-500">${this.currentLesson.progress}% completed</span>
                                    <div class="w-1 h-1 bg-gray-300 rounded-full"></div>
                                    <span class="text-xs text-gray-500">${this.currentLesson.duration}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button onclick="lessonShareManager.viewShareHistory()" class="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all" title="Share History">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </button>
                            <button onclick="lessonShareManager.closeShareModal()" class="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all duration-200">
                                <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Share Options Tabs -->
                    <div class="border-b border-gray-200 bg-white">
                        <div class="flex px-6">
                            <button onclick="lessonShareManager.switchShareTab('quick')" id="quickShareTab" class="px-4 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600 bg-white">
                                <div class="flex items-center space-x-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                    <span>Quick Share</span>
                                </div>
                            </button>
                            <button onclick="lessonShareManager.switchShareTab('custom')" id="customShareTab" class="px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300">
                                <div class="flex items-center space-x-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                                    </svg>
                                    <span>Custom Share</span>
                                </div>
                            </button>
                            <button onclick="lessonShareManager.switchShareTab('social')" id="socialShareTab" class="px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300">
                                <div class="flex items-center space-x-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2V4a2 2 0 012-2h4a2 2 0 012 2v4z"/>
                                    </svg>
                                    <span>Social Media</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Tab Content -->
                    <div class="flex-1 overflow-hidden">
                        <!-- Quick Share Tab -->
                        <div id="quickShareContent" class="h-full p-6 overflow-y-auto">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Direct Share Options -->
                                <div class="space-y-4">
                                    <h3 class="font-semibold text-gray-900 mb-4">Direct Share</h3>
                                    
                                    <button onclick="lessonShareManager.copyLessonLink()" class="w-full flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group">
                                        <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                                            </svg>
                                        </div>
                                        <div class="flex-1 text-left">
                                            <div class="font-medium text-gray-900">Copy Link</div>
                                            <div class="text-sm text-gray-500">Get a shareable link to this lesson</div>
                                        </div>
                                    </button>

                                    <button onclick="lessonShareManager.shareViaEmail()" class="w-full flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group">
                                        <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                            </svg>
                                        </div>
                                        <div class="flex-1 text-left">
                                            <div class="font-medium text-gray-900">Email Share</div>
                                            <div class="text-sm text-gray-500">Send lesson details via email</div>
                                        </div>
                                    </button>

                                    <button onclick="lessonShareManager.generateQRCode()" class="w-full flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group">
                                        <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                                            </svg>
                                        </div>
                                        <div class="flex-1 text-left">
                                            <div class="font-medium text-gray-900">QR Code</div>
                                            <div class="text-sm text-gray-500">Generate QR code for mobile access</div>
                                        </div>
                                    </button>
                                </div>

                                <!-- Export Options -->
                                <div class="space-y-4">
                                    <h3 class="font-semibold text-gray-900 mb-4">Export Options</h3>
                                    
                                    <button onclick="lessonShareManager.exportAsPDF()" class="w-full flex items-center p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors group">
                                        <div class="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mr-4">
                                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                            </svg>
                                        </div>
                                        <div class="flex-1 text-left">
                                            <div class="font-medium text-gray-900">Export as PDF</div>
                                            <div class="text-sm text-gray-500">Download lesson summary as PDF</div>
                                        </div>
                                    </button>

                                    <button onclick="lessonShareManager.exportAsSlides()" class="w-full flex items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors group">
                                        <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V2a1 1 0 011-1h2a1 1 0 011 1v2m-4 0h4m0 0v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4m4 0V2a1 1 0 011-1h8a1 1 0 011 1v2"/>
                                            </svg>
                                        </div>
                                        <div class="flex-1 text-left">
                                            <div class="font-medium text-gray-900">Export as Slides</div>
                                            <div class="text-sm text-gray-500">Create presentation slides</div>
                                        </div>
                                    </button>

                                    <button onclick="lessonShareManager.exportStudyGuide()" class="w-full flex items-center p-4 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors group">
                                        <div class="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mr-4">
                                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                            </svg>
                                        </div>
                                        <div class="flex-1 text-left">
                                            <div class="font-medium text-gray-900">Study Guide</div>
                                            <div class="text-sm text-gray-500">Generate printable study guide</div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <!-- Lesson Preview Card -->
                            <div class="mt-8">
                                <h3 class="font-semibold text-gray-900 mb-4">Share Preview</h3>
                                <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                                    <div class="flex items-start justify-between">
                                        <div class="flex-1">
                                            <h4 class="text-xl font-bold text-gray-900 mb-2">${this.currentLesson.title}</h4>
                                            <p class="text-gray-600 mb-3">${this.currentLesson.description}</p>
                                            <div class="flex items-center space-x-4 text-sm text-gray-500">
                                                <span>${this.currentLesson.course}</span>
                                                <span>•</span>
                                                <span>${this.currentLesson.duration}</span>
                                                <span>•</span>
                                                <span>${this.currentLesson.difficulty}</span>
                                            </div>
                                            <div class="flex items-center mt-3">
                                                <div class="w-32 h-2 bg-gray-200 rounded-full mr-3">
                                                    <div class="w-24 h-2 bg-blue-500 rounded-full"></div>
                                                </div>
                                                <span class="text-sm text-gray-600">${this.currentLesson.progress}% complete</span>
                                            </div>
                                        </div>
                                        <div class="ml-4">
                                            <div class="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
                                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Custom Share Tab -->
                        <div id="customShareContent" class="h-full p-6 overflow-y-auto hidden">
                            <div class="max-w-2xl mx-auto">
                                <h3 class="font-semibold text-gray-900 mb-6">Customize Share Content</h3>
                                
                                <!-- Content Selection -->
                                <div class="space-y-6">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-3">Include in Share</label>
                                        <div class="space-y-2">
                                            <label class="flex items-center">
                                                <input type="checkbox" checked class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" id="includeTitle">
                                                <span class="ml-2 text-sm text-gray-700">Lesson title and description</span>
                                            </label>
                                            <label class="flex items-center">
                                                <input type="checkbox" checked class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" id="includeObjectives">
                                                <span class="ml-2 text-sm text-gray-700">Learning objectives</span>
                                            </label>
                                            <label class="flex items-center">
                                                <input type="checkbox" checked class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" id="includeProgress">
                                                <span class="ml-2 text-sm text-gray-700">My progress</span>
                                            </label>
                                            <label class="flex items-center">
                                                <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" id="includeNotes">
                                                <span class="ml-2 text-sm text-gray-700">My study notes</span>
                                            </label>
                                            <label class="flex items-center">
                                                <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" id="includeCertificate">
                                                <span class="ml-2 text-sm text-gray-700">Certificate eligibility</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Personal Message (Optional)</label>
                                        <textarea id="personalMessage" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Add a personal note to share with others..."></textarea>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Share Format</label>
                                        <select id="shareFormat" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                                            <option value="summary">Summary Card</option>
                                            <option value="detailed">Detailed Report</option>
                                            <option value="minimal">Minimal Link</option>
                                            <option value="infographic">Visual Infographic</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Privacy Level</label>
                                        <div class="space-y-2">
                                            <label class="flex items-center">
                                                <input type="radio" name="privacy" value="public" checked class="border-gray-300 text-blue-600 focus:ring-blue-500">
                                                <span class="ml-2 text-sm text-gray-700">Public - Anyone with the link can view</span>
                                            </label>
                                            <label class="flex items-center">
                                                <input type="radio" name="privacy" value="restricted" class="border-gray-300 text-blue-600 focus:ring-blue-500">
                                                <span class="ml-2 text-sm text-gray-700">Restricted - Require login to view</span>
                                            </label>
                                            <label class="flex items-center">
                                                <input type="radio" name="privacy" value="private" class="border-gray-300 text-blue-600 focus:ring-blue-500">
                                                <span class="ml-2 text-sm text-gray-700">Private - Only specific people can view</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div class="border-t border-gray-200 pt-6">
                                        <button onclick="lessonShareManager.generateCustomShare()" class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                            Generate Custom Share
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Social Media Tab -->
                        <div id="socialShareContent" class="h-full p-6 overflow-y-auto hidden">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Social Platforms -->
                                <div class="space-y-4">
                                    <h3 class="font-semibold text-gray-900 mb-4">Share on Social Media</h3>
                                    
                                    <button onclick="lessonShareManager.shareOnLinkedIn()" class="w-full flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                                        <div class="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center mr-4">
                                            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                            </svg>
                                        </div>
                                        <div class="flex-1 text-left">
                                            <div class="font-medium text-gray-900">LinkedIn</div>
                                            <div class="text-sm text-gray-500">Share professional achievement</div>
                                        </div>
                                    </button>

                                    <button onclick="lessonShareManager.shareOnTwitter()" class="w-full flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                                        <div class="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center mr-4">
                                            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                            </svg>
                                        </div>
                                        <div class="flex-1 text-left">
                                            <div class="font-medium text-gray-900">Twitter</div>
                                            <div class="text-sm text-gray-500">Tweet your progress</div>
                                        </div>
                                    </button>

                                    <button onclick="lessonShareManager.shareOnFacebook()" class="w-full flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                                        <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                                            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                            </svg>
                                        </div>
                                        <div class="flex-1 text-left">
                                            <div class="font-medium text-gray-900">Facebook</div>
                                            <div class="text-sm text-gray-500">Share with friends</div>
                                        </div>
                                    </button>
                                </div>

                                <!-- Share Templates -->
                                <div class="space-y-4">
                                    <h3 class="font-semibold text-gray-900 mb-4">Share Templates</h3>
                                    
                                    <div class="bg-gray-50 rounded-xl p-4">
                                        <h4 class="font-medium text-gray-900 mb-2">Achievement Post</h4>
                                        <p class="text-sm text-gray-600 mb-3">🎓 Just completed "${this.currentLesson.title}" with ${this.currentLesson.progress}% progress! Learning about ${this.currentLesson.keyTopics[0]} and more. #CloseoutSoft #LearningAndDevelopment</p>
                                        <button onclick="lessonShareManager.copyTemplate('achievement')" class="text-blue-600 text-sm font-medium hover:text-blue-700">
                                            Copy Template
                                        </button>
                                    </div>

                                    <div class="bg-gray-50 rounded-xl p-4">
                                        <h4 class="font-medium text-gray-900 mb-2">Recommendation</h4>
                                        <p class="text-sm text-gray-600 mb-3">📚 Highly recommend this course: "${this.currentLesson.course}" - ${this.currentLesson.description.substring(0, 100)}... Great for anyone in construction management!</p>
                                        <button onclick="lessonShareManager.copyTemplate('recommendation')" class="text-blue-600 text-sm font-medium hover:text-blue-700">
                                            Copy Template
                                        </button>
                                    </div>

                                    <div class="bg-gray-50 rounded-xl p-4">
                                        <h4 class="font-medium text-gray-900 mb-2">Learning Journey</h4>
                                        <p class="text-sm text-gray-600 mb-3">🚀 Expanding my skills in construction technology! Currently learning about ${this.currentLesson.keyTopics.slice(0, 2).join(' and ')} through CloseoutSoft training. #SkillDevelopment #ConstructionTech</p>
                                        <button onclick="lessonShareManager.copyTemplate('journey')" class="text-blue-600 text-sm font-medium hover:text-blue-700">
                                            Copy Template
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.bindShareEvents();
    }

    bindShareEvents() {
        // Close modal on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeShareModal();
            }
        });
    }

    openShareModal() {
        const modal = document.getElementById('shareModal');
        if (modal) {
            modal.classList.remove('opacity-0', 'invisible');
            modal.classList.add('opacity-100');
            const content = document.getElementById('shareModalContent');
            if (content) {
                content.classList.remove('scale-95');
                content.classList.add('scale-100');
            }
            document.body.style.overflow = 'hidden';
        }
    }

    closeShareModal() {
        const modal = document.getElementById('shareModal');
        if (modal) {
            modal.classList.add('opacity-0', 'invisible');
            modal.classList.remove('opacity-100');
            const content = document.getElementById('shareModalContent');
            if (content) {
                content.classList.add('scale-95');
                content.classList.remove('scale-100');
            }
            document.body.style.overflow = '';
        }
    }

    switchShareTab(tabName) {
        // Hide all tabs
        const tabs = ['quick', 'custom', 'social'];
        tabs.forEach(tab => {
            const content = document.getElementById(`${tab}ShareContent`);
            const button = document.getElementById(`${tab}ShareTab`);
            if (content) content.classList.add('hidden');
            if (button) {
                button.classList.remove('text-blue-600', 'border-blue-600');
                button.classList.add('text-gray-500', 'border-transparent');
            }
        });

        // Show active tab
        const activeContent = document.getElementById(`${tabName}ShareContent`);
        const activeButton = document.getElementById(`${tabName}ShareTab`);
        if (activeContent) activeContent.classList.remove('hidden');
        if (activeButton) {
            activeButton.classList.add('text-blue-600', 'border-blue-600');
            activeButton.classList.remove('text-gray-500', 'border-transparent');
        }
    }

    // Quick Share Functions
    copyLessonLink() {
        const link = `https://learning.closeoutsoft.com/lessons/${this.currentLesson.id}`;
        navigator.clipboard.writeText(link).then(() => {
            this.showToast('Lesson link copied to clipboard!', 'success');
            this.trackShare('copy-link');
        }).catch(() => {
            this.showToast('Failed to copy link', 'error');
        });
    }

    shareViaEmail() {
        const subject = encodeURIComponent(`Check out this lesson: ${this.currentLesson.title}`);
        const body = encodeURIComponent(`Hi!\n\nI wanted to share this CloseoutSoft lesson with you:\n\n${this.currentLesson.title}\n${this.currentLesson.description}\n\nLesson Link: https://learning.closeoutsoft.com/lessons/${this.currentLesson.id}\n\nBest regards!`);
        
        window.open(`mailto:?subject=${subject}&body=${body}`);
        this.trackShare('email');
        this.showToast('Email client opened', 'success');
    }

    generateQRCode() {
        // Simulate QR code generation
        const qrModal = this.createQRModal();
        document.body.appendChild(qrModal);
        this.showQRModal();
        this.trackShare('qr-code');
    }

    createQRModal() {
        const modal = document.createElement('div');
        modal.id = 'qrModal';
        modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] opacity-0 invisible transition-all duration-300';
        modal.innerHTML = `
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full transform scale-95 transition-transform duration-300">
                    <div class="p-6 text-center">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">QR Code for Lesson</h3>
                        <div class="w-48 h-48 mx-auto mb-4 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                            <!-- Simulated QR Code -->
                            <div class="grid grid-cols-8 gap-1">
                                ${Array.from({length: 64}, () => `<div class="w-2 h-2 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}"></div>`).join('')}
                            </div>
                        </div>
                        <p class="text-sm text-gray-600 mb-4">Scan with your mobile device to access this lesson</p>
                        <div class="flex space-x-3">
                            <button onclick="lessonShareManager.downloadQR()" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Download QR
                            </button>
                            <button onclick="lessonShareManager.closeQRModal()" class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return modal;
    }

    showQRModal() {
        const modal = document.getElementById('qrModal');
        if (modal) {
            modal.classList.remove('opacity-0', 'invisible');
            modal.classList.add('opacity-100');
            modal.querySelector('.bg-white').classList.remove('scale-95');
            modal.querySelector('.bg-white').classList.add('scale-100');
        }
    }

    closeQRModal() {
        const modal = document.getElementById('qrModal');
        if (modal) {
            modal.classList.add('opacity-0', 'invisible');
            modal.classList.remove('opacity-100');
            modal.querySelector('.bg-white').classList.add('scale-95');
            modal.querySelector('.bg-white').classList.remove('scale-100');
            setTimeout(() => {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
            }, 300);
        }
    }

    downloadQR() {
        this.showToast('QR Code downloaded!', 'success');
        this.closeQRModal();
    }

    // Export Functions
    exportAsPDF() {
        // Simulate PDF generation
        const content = this.generateShareContent('detailed');
        this.simulateFileDownload(`${this.currentLesson.title}-summary.pdf`, 'PDF');
        this.trackShare('export-pdf');
    }

    exportAsSlides() {
        // Simulate slide generation
        this.simulateFileDownload(`${this.currentLesson.title}-slides.pptx`, 'PowerPoint Presentation');
        this.trackShare('export-slides');
    }

    exportStudyGuide() {
        // Simulate study guide generation
        this.simulateFileDownload(`${this.currentLesson.title}-study-guide.pdf`, 'Study Guide');
        this.trackShare('export-study-guide');
    }

    // Custom Share Functions
    generateCustomShare() {
        const options = this.getCustomShareOptions();
        const content = this.generateShareContent(options.format, options);
        
        // Simulate custom share generation
        this.showToast('Custom share generated!', 'success');
        this.trackShare('custom-share');
        
        // Could show preview modal or copy to clipboard
        this.copyLessonLink();
    }

    getCustomShareOptions() {
        return {
            includeTitle: document.getElementById('includeTitle')?.checked ?? true,
            includeObjectives: document.getElementById('includeObjectives')?.checked ?? true,
            includeProgress: document.getElementById('includeProgress')?.checked ?? true,
            includeNotes: document.getElementById('includeNotes')?.checked ?? false,
            includeCertificate: document.getElementById('includeCertificate')?.checked ?? false,
            personalMessage: document.getElementById('personalMessage')?.value ?? '',
            format: document.getElementById('shareFormat')?.value ?? 'summary',
            privacy: document.querySelector('input[name="privacy"]:checked')?.value ?? 'public'
        };
    }

    generateShareContent(format, options = {}) {
        // Generate different types of shareable content based on format
        let content = '';
        
        switch (format) {
            case 'summary':
                content = `${this.currentLesson.title}\n${this.currentLesson.description}`;
                break;
            case 'detailed':
                content = this.generateDetailedContent(options);
                break;
            case 'minimal':
                content = `Check out: ${this.currentLesson.title}`;
                break;
            default:
                content = this.generateDetailedContent(options);
        }
        
        return content;
    }

    generateDetailedContent(options) {
        let content = `# ${this.currentLesson.title}\n\n`;
        content += `**Course:** ${this.currentLesson.course}\n`;
        content += `**Duration:** ${this.currentLesson.duration}\n`;
        content += `**Difficulty:** ${this.currentLesson.difficulty}\n\n`;
        
        if (options.includeObjectives) {
            content += `## Learning Objectives\n`;
            this.currentLesson.objectives.forEach(obj => {
                content += `- ${obj}\n`;
            });
            content += '\n';
        }
        
        if (options.includeProgress) {
            content += `**Progress:** ${this.currentLesson.progress}% completed\n\n`;
        }
        
        if (options.personalMessage) {
            content += `## Personal Note\n${options.personalMessage}\n\n`;
        }
        
        return content;
    }

    // Social Media Functions
    shareOnLinkedIn() {
        const text = `🎓 Just completed "${this.currentLesson.title}" - ${this.currentLesson.description}`;
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://learning.closeoutsoft.com/lessons/' + this.currentLesson.id)}&summary=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        this.trackShare('linkedin');
    }

    shareOnTwitter() {
        const text = `📚 Learning "${this.currentLesson.title}" - ${this.currentLesson.progress}% complete! #CloseoutSoft #Learning`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://learning.closeoutsoft.com/lessons/' + this.currentLesson.id)}`;
        window.open(url, '_blank');
        this.trackShare('twitter');
    }

    shareOnFacebook() {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://learning.closeoutsoft.com/lessons/' + this.currentLesson.id)}`;
        window.open(url, '_blank');
        this.trackShare('facebook');
    }

    copyTemplate(templateType) {
        const templates = {
            achievement: `🎓 Just completed "${this.currentLesson.title}" with ${this.currentLesson.progress}% progress! Learning about ${this.currentLesson.keyTopics[0]} and more. #CloseoutSoft #LearningAndDevelopment`,
            recommendation: `📚 Highly recommend this course: "${this.currentLesson.course}" - ${this.currentLesson.description.substring(0, 100)}... Great for anyone in construction management!`,
            journey: `🚀 Expanding my skills in construction technology! Currently learning about ${this.currentLesson.keyTopics.slice(0, 2).join(' and ')} through CloseoutSoft training. #SkillDevelopment #ConstructionTech`
        };

        const template = templates[templateType] || '';
        navigator.clipboard.writeText(template).then(() => {
            this.showToast('Template copied to clipboard!', 'success');
        }).catch(() => {
            this.showToast('Failed to copy template', 'error');
        });
    }

    // Share History
    viewShareHistory() {
        this.showToast('Share history feature coming soon!', 'info');
    }

    trackShare(method) {
        const shareRecord = {
            lessonId: this.currentLesson.id,
            method: method,
            timestamp: new Date().toISOString()
        };
        
        this.shareHistory.unshift(shareRecord);
        this.shareHistory = this.shareHistory.slice(0, 50); // Keep last 50
        this.saveShareHistory();
    }

    // Utility Functions
    simulateFileDownload(filename, type) {
        // Simulate file download
        this.showToast(`${type} file "${filename}" downloaded!`, 'success');
        
        // In a real implementation, you would generate and trigger actual file download
        const blob = new Blob([this.generateShareContent('detailed')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
let lessonShareManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    lessonShareManager = new LessonShareManager();
});

// Global functions for HTML onclick handlers
function openShareModal() {
    if (lessonShareManager) lessonShareManager.openShareModal();
}