// File: Page-Preview (Wikipedia Style) Injection - No Icons
const previewData = {
    "Architect": {
        title: "Architect",
        summary: "A licensed professional responsible for designing the project, preparing drawings, and ensuring the design meets client requirements, safety standards, and regulations.",
        meta: "Type: Role • Category: Project Design"
    },
    "AHOMS": {
        title: "AHOMS",
        summary: "Area Handover Monitoring Sheet. Used to monitor construction progress room by room.",
        meta: "Type: Monitoring Sheet • Category: Construction Progress"
    },
    "Asset Register": {
        title: "Asset Register",
        summary: "A centralized record of all assets, automatically generated from submittals such as MIR, WIR, and T&C reports, ensuring accurate facility management and handover.",
        meta: "Type: Documentation • Category: Asset Management"
    },
    "Asset": {
        title: "Asset",
        summary: "A resource, equipment, or material owned or used by the organization, tracked for management, maintenance, and utilization purposes within the software.",
        meta: "Type: Resource Management • Category: Project Management Feature"
    },
    "AssetHandling": {
        title: "Asset Handling",
        summary: "Processes and procedures for the safe movement, storage, and management of physical or digital assets throughout their lifecycle within the project or organization.",
        meta: "Type: Resource Management • Category: Project Management Feature"
    },
    "AssetData": {
        title: "Asset Data",
        summary: "Comprehensive information about assets, including specifications, ownership, status, location, and history, used to support tracking, maintenance, and decision-making.",
        meta: "Type: Resource Management • Category: Project Management Feature"
    },
    "BOQ": {
        title: "BOQ",
        summary: "Bill of Quantity. A document that lists all materials, parts, and labor (with costs) required for construction; helps in budget estimation and tracking.",
        meta: "Type: Financial Document • Category: Cost Management"
    },
    "Closeout": {
        title: "Closeout",
        summary: "The process of finalizing all project activities and documentation to enable project completion and handover.",
        meta: "Type: Process • Category: Project Management"
    },
    "Client": {
        title: "Client",
        summary: "The organization or individual commissioning the project and receiving the final handover.",
        meta: "Type: Stakeholder • Category: Project Roles"
    },
    "Consultant": {
        title: "Consultant",
        summary: "A professional or firm engaged to provide expert advice, quality inspections, and approvals during construction.",
        meta: "Type: Stakeholder • Category: Project Roles"
    },
    "Contractor": {
        title: "Contractor/Main Contractor",
        summary: "The primary entity responsible for overall project execution, including management of subcontractors.",
        meta: "Type: Stakeholder • Category: Project Roles"
    },
    "Construction Activities": {
        title: "Construction Activities",
        summary: "All tasks and work involved in actual building and assembling as per project specifications and schedule.",
        meta: "Type: Activities • Category: Construction"
    },
    "Compliance Statement": {
        title: "Compliance Statement",
        summary: "An auto-generated document or update within the software, indicating conformity of processes or deliverables to client or industry requirements.",
        meta: "Type: Documentation • Category: Quality Assurance"
    },
    "DLP": {
        title: "DLP",
        summary: "Defects Liability Period. Post-construction timeframe during which the contractor is responsible for remedying defects.",
        meta: "Type: Contract Period • Category: Quality Management"
    },
    "DHOMS": {
        title: "DHOMS",
        summary: "Document Handover Monitoring Sheet. Used for tracking and viewing O&M manuals, training manuals, CVs, and project documentation.",
        meta: "Type: Monitoring Sheet • Category: Document Management"
    },
    "Digital Signature": {
        title: "Digital Signature",
        summary: "A secure method of signing documents electronically within CloseoutSoft to verify authenticity and integrity.",
        meta: "Type: Technology • Category: Security"
    },
    "Dashboard": {
        title: "Dashboard",
        summary: "The main overview display in CloseoutSoft, showing consolidated views of project activity, progress, and reporting.",
        meta: "Type: Interface • Category: Software Feature"
    },
    "EI": {
        title: "EI",
        summary: "Engineering Instruction. Formal direction issued to alter designs, specifications, or procedures.",
        meta: "Type: Instruction • Category: Engineering"
    },
    "Estimation": {
        title: "Estimation",
        summary: "Forecasting project activity duration, resources, and costs, typically through BOQ and planning tools.",
        meta: "Type: Process • Category: Planning"
    },
    "FM": {
        title: "FM",
        summary: "Facility Management. The post-construction maintenance and management of built assets and infrastructure.",
        meta: "Type: Management • Category: Operations"
    },
    "Functional Activities": {
        title: "Functional Activities",
        summary: "Project tasks related to ensuring functionality, such as T&C, systems handover, and operational readiness.",
        meta: "Type: Activities • Category: Systems"
    },
    "GlobalCompliance": {
        title: "Global Compliance",
        summary: "Adheres to internationally recognized standards and regulations, ensuring that data, processes, and systems can be safely and easily transferred, shared, or used across different regions and platforms.",
        meta: "Type: Compliance • Category: Project Management Feature"
    },
    "Handover": {
        title: "Handover",
        summary: "Formal process by which project assets, areas, or systems are transferred from contractor to client.",
        meta: "Type: Process • Category: Project Completion"
    },
    "MinutesOfMeetings": {
        title: "Minutes of Meetings",
        summary: "A formal record of discussions, decisions, action items, and key points from project meetings, used to track progress, accountability, and follow-up actions.",
        meta: "Type: Documentation • Category: Project Management Feature"
    },
    "Letters": {
        title: "Letters",
        summary: "Communication documents exchanged among project stakeholders, issued and tracked within CloseoutSoft.",
        meta: "Type: Communication • Category: Documentation"
    },
    "MIR": {
        title: "MIR",
        summary: "Material Inspection Request. A formal request for inspection and approval of delivered/project material.",
        meta: "Type: Request • Category: Quality Control"
    },
    "Stakeholders": {
        title: "Stakeholders",
        summary: "Individuals, groups, or organizations that have an interest, influence, or role in the project, whose needs and expectations must be considered and managed throughout the project lifecycle.",
        meta: "Type: Project Oversight • Category: Project Management Feature"
    },
    "Minutes": {
        title: "Minutes (of Meetings/Communication)",
        summary: "Summarized official record of meeting discussions, actions, and decisions; tracked within the system.",
        meta: "Type: Documentation • Category: Communication"
    },
    "NCR": {
        title: "NCR",
        summary: "Non-Conformance Report. Formal documentation of work not complying with specified requirements; managed via workflow.",
        meta: "Type: Report • Category: Quality Control"
    },
    "Notification": {
        title: "Notification",
        summary: "Automated alert generated by the software for project updates, milestones, completion, or deadlines.",
        meta: "Type: Alert • Category: Software Feature"
    },
    "O&M": {
        title: "O&M",
        summary: "Operation and Maintenance. All documents, manuals, and procedures for the operation and maintenance of the facility and its systems.",
        meta: "Type: Documentation • Category: Operations"
    },
    "Occupancy-Taking Over": {
        title: "Occupancy Taking Over",
        summary: "The process and procedure for the client to take possession of project space after confirming readiness and completion.",
        meta: "Type: Process • Category: Handover"
    },
    "PPM": {
        title: "PPM",
        summary: "Planned Preventive Maintenance. Regular, scheduled maintenance intended to prevent unexpected asset failures.",
        meta: "Type: Maintenance • Category: Operations"
    },
    "Project Manager": {
        title: "Project Manager",
        summary: "The individual responsible for overall project delivery, documentation, tracking, and final closeout.",
        meta: "Type: Role • Category: Project Management"
    },
    "Punch List": {
        title: "Punch List",
        summary: "A running list of items needing completion or correction before project handover; managed and tracked digitally.",
        meta: "Type: List • Category: Quality Control"
    },
    "Progress Report": {
        title: "Progress Report",
        summary: "A report that tracks actual progress against planned activities and schedule baselines, automatically generated in CloseoutSoft.",
        meta: "Type: Report • Category: Project Tracking"
    },
    "Planning & Scheduling": {
        title: "Planning & Scheduling",
        summary: "Processes and tools used to design the project timeline, allocate resources, and monitor milestone achievement.",
        meta: "Type: Process • Category: Project Management"
    },
    "Persona": {
        title: "Persona",
        summary: "A representation of a typical user, client, or stakeholder, created to understand their needs, behaviors, and goals, and to guide project decisions and design strategies.",
        meta: "Type: User Analysis • Category: Project Management Feature"
    },
    "ReadinessChecklist": {
        title: "Readiness Checklist",
        summary: "A structured list of tasks, requirements, and approvals used to ensure that a project, system, or team is fully prepared before starting a phase or activity.",
        meta: "Type: Quality Assurance • Category: Project Management Feature"
    },
    "Repository": {
        title: "Repository",
        summary: "A centralized storage location for project documents, drawings, models, and other important data, enabling organized access, version control, and collaboration.",
        meta: "Type: Document Management • Category: Project Management Feature"
    },
    "QA/QC": {
        title: "QA/QC",
        summary: "Quality Assurance / Quality Control. Systems and processes to ensure that work meets quality standards and is compliant with all requirements.",
        meta: "Type: System • Category: Quality Management"
    },
    "RFI": {
        title: "RFI",
        summary: "Request for Information. A formal process of seeking clarification on plans, drawings, or specifications.",
        meta: "Type: Request • Category: Communication"
    },
    "RHOMS": {
        title: "RHOMS",
        summary: "Room Handover Monitoring Status. Tool or form for monitoring the status of specific room handovers during construction closeout.",
        meta: "Type: Monitoring Tool • Category: Room Management"
    },
    "SHOMS": {
        title: "SHOMS",
        summary: "System Handover Monitoring Sheet. Used for monitoring Testing & Commissioning and subsystem functional readiness.",
        meta: "Type: Monitoring Sheet • Category: Systems Management"
    },
    "Snag": {
        title: "Snag",
        summary: "Identified defect or outstanding work item, tracked and managed towards resolution before final project closeout.",
        meta: "Type: Defect • Category: Quality Control"
    },
    "Subcontractor": {
        title: "Subcontractor",
        summary: "A company working under the main contractor to complete specific project portions or trades.",
        meta: "Type: Stakeholder • Category: Project Roles"
    },
    "Submittal": {
        title: "Submittal",
        summary: "Any document or record (drawings, materials, test results) submitted for review, approval, or rejection within CloseoutSoft.",
        meta: "Type: Document • Category: Documentation"
    },
    "EI": {
        title: "Engineering Instruction",
        summary: "Formal direction issued to alter designs, specifications, or procedures.",
        meta: "Type: Directive • Category: Engineering"
    },
    "SOTO": {
        title: "Safe Operating Task Observation",
        summary: "A structured observation process to ensure tasks are performed safely and in compliance with required standards.",
        meta: "Type: Safety • Category: Compliance"
    },
    "T&C": {
        title: "T&C",
        summary: "Testing & Commissioning. The phase where systems are tested to verify performance and readiness before handover.",
        meta: "Type: Process • Category: Systems Testing"
    },
    "Technical Submittal": {
        title: "Technical Submittal",
        summary: "Design, specification, or material documentation submitted for client/consultant approval.",
        meta: "Type: Document • Category: Technical Documentation"
    },
    "Metadata": {
        title: "Metadata",
        summary: "Structured information that describes, categorizes, and provides context for documents, assets, or data within the system, improving searchability and management.",
        meta: "Type: Data Management • Category: Project Management Feature"
    },
    "Keywords": {
        title: "Keywords",
        summary: "Specific terms or tags assigned to documents, assets, or records to facilitate quick searching, filtering, and organization within the software.",
        meta: "Type: Data Management • Category: Project Management Feature"
    },
    "WIR": {
        title: "WIR",
        summary: "Work Inspection Request. A formal request for site inspection of completed works, with approval or rejection via workflow.",
        meta: "Type: Request • Category: Inspection"
    },
    "Workflow": {
        title: "Workflow",
        summary: "Automated sequence of processes and approvals for submittals, communications, inspections, or closeout activities within the software.",
        meta: "Type: Process • Category: Software Feature"
    },
    "CostControl": {
        title: "Cost Control",
        summary: "Monitoring, managing, and regulating project budgets, expenses, and financial performance to ensure the project stays within approved cost limits.",
        meta: "Type: Financial Management • Category: Project Management Feature"
    },
    "DelayedAnalysis": {
        title: "Delayed Analysis",
        summary: "Evaluation of tasks, milestones, or project activities that are behind schedule, identifying causes of delays and potential corrective actions.",
        meta: "Type: Schedule Monitoring • Category: Project Management Feature"
    }
};

class WikiPreview {
    constructor() {
        this.previewCard = null;
        this.previewTitle = null;
        this.previewSummary = null;
        this.previewMeta = null;
        this.currentTween = null;
        this.showTimeout = null;
        this.hideTimeout = null;
        
        this.init();
    }

    init() {
        this.getElements();
        this.setupGSAP();
        this.setupCustomElements();
        this.bindEvents();
    }

    getElements() {
        this.previewCard = document.getElementById('preview-card');
        this.previewTitle = document.getElementById('preview-title');
        this.previewSummary = document.getElementById('preview-summary');
        this.previewMeta = document.getElementById('preview-meta');
    }

    setupGSAP() {
        // Check if GSAP is available
        if (typeof gsap !== 'undefined') {
            gsap.set(this.previewCard, {
                opacity: 0,
                y: 10,
                scale: 0.95
            });
        }
    }

    setupCustomElements() {
        // Style all wiki-preview elements
        document.querySelectorAll('wiki-preview').forEach(el => {
            el.style.cssText = `
                color: #0051ffff;
                cursor: pointer;
                transition: color 0.2s ease;
            `;
            
            el.addEventListener('mouseenter', () => {
                el.style.color = '#1d4ed8';
            });
            el.addEventListener('mouseleave', () => {
                if (!this.previewCard || this.previewCard.classList.contains('invisible')) {
                    el.style.color = '#2563eb';
                }
            });
        });
    }

    bindEvents() {
        document.querySelectorAll('wiki-preview').forEach(el => {
            el.addEventListener('mouseenter', (e) => this.handleMouseEnter(e));
            el.addEventListener('mouseleave', () => this.handleMouseLeave());
            el.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        });
    }

    handleMouseEnter(e) {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }

        const term = e.target.getAttribute('term');
        const data = previewData[term];
        
        if (!data) return;

        this.showTimeout = setTimeout(() => {
            this.showPreview(data, e);
        }, 300);
    }

    handleMouseLeave() {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }

        this.hideTimeout = setTimeout(() => {
            this.hidePreview();
        }, 100);
    }

    handleMouseMove(e) {
        if (this.previewCard.classList.contains('invisible')) return;
        this.positionPreview(e);
    }

    showPreview(data, e) {
        this.previewTitle.textContent = data.title;
        this.previewSummary.textContent = data.summary;
        this.previewMeta.textContent = data.meta;

        this.previewCard.classList.remove('invisible');
        this.positionPreview(e);

        // Use GSAP if available, otherwise use CSS
        if (typeof gsap !== 'undefined') {
            if (this.currentTween) this.currentTween.kill();

            this.currentTween = gsap.to(this.previewCard, { 
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        } else {
            this.previewCard.style.opacity = '1';
            this.previewCard.style.transform = 'translateY(0) scale(1)';
        }
    }

    hidePreview() {
        // Use GSAP if available, otherwise use CSS
        if (typeof gsap !== 'undefined') {
            if (this.currentTween) this.currentTween.kill();

            this.currentTween = gsap.to(this.previewCard, {
                opacity: 0,
                y: 10,
                scale: 0.95,
                duration: 0.2,
                ease: "power2.in",
                onComplete: () => {
                    this.previewCard.classList.add('invisible');
                }
            });
        } else {
            this.previewCard.style.opacity = '0';
            this.previewCard.style.transform = 'translateY(10px) scale(0.95)';
            setTimeout(() => {
                this.previewCard.classList.add('invisible');
            }, 200);
        }
    }

    positionPreview(e) {
        const cardRect = this.previewCard.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let left = e.clientX + 15;
        let top = e.clientY - cardRect.height / 2;

        if (left + cardRect.width > viewportWidth - 20) {
            left = e.clientX - cardRect.width - 15;
        }

        if (top < 20) {
            top = 20;
        } else if (top + cardRect.height > viewportHeight - 20) {
            top = viewportHeight - cardRect.height - 20;
        }

        // Use GSAP if available, otherwise use CSS
        if (typeof gsap !== 'undefined') {
            gsap.set(this.previewCard, {
                left: `${left}px`,
                top: `${top}px`
            });
        } else {
            this.previewCard.style.left = `${left}px`;
            this.previewCard.style.top = `${top}px`;
        }
    }
}

class WikiPreviewInjector {
    constructor() {
        this.injected = false;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.injectAndStart());
        } else {
            this.injectAndStart();
        }
    }

    injectAndStart() {
        this.injectHTML();
        this.injectCSS();
        this.startPreviewSystem();
    }

    injectHTML() {
        if (this.injected || document.getElementById('preview-card')) return;
        
        // Updated HTML without icon div
        const previewHTML = `
            <div id="preview-card" class="fixed invisible bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-sm z-50 pointer-events-none">
                <div class="mb-3 pb-2 border-b border-gray-200">
                    <h3 id="preview-title" class="font-bold text-gray-900 text-lg"></h3>
                </div>
                <p id="preview-summary" class="text-gray-600 text-sm mb-3 leading-relaxed"></p>
                <div id="preview-meta" class="text-gray-500 text-xs border-t border-gray-200 pt-2"></div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', previewHTML);
        this.injected = true;
    }

    injectCSS() {
        if (document.getElementById('wiki-preview-styles')) return;
        
        const styles = `
            <style id="wiki-preview-styles">
                /* Fallback styles if Tailwind isn't available */
                .fixed { position: fixed; }
                .invisible { visibility: hidden; }
                .bg-white { background-color: white; }
                .border { border-width: 1px; }
                .border-gray-300 { border-color: #d1d5db; }
                .rounded-lg { border-radius: 0.5rem; }
                .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
                .p-4 { padding: 1rem; }
                .max-w-sm { max-width: 24rem; }
                .z-50 { z-index: 50; }
                .pointer-events-none { pointer-events: none; }
                .mb-3 { margin-bottom: 0.75rem; }
                .pb-2 { padding-bottom: 0.5rem; }
                .border-gray-200 { border-color: #e5e7eb; }
                .font-bold { font-weight: 700; }
                .text-gray-900 { color: #111827; }
                .text-lg { font-size: 1.125rem; }
                .text-gray-600 { color: #4b5563; }
                .text-sm { font-size: 0.875rem; }
                .leading-relaxed { line-height: 1.625; }
                .text-gray-500 { color: #6b7280; }
                .text-xs { font-size: 0.75rem; }
                .border-t { border-top-width: 1px; }
                .pt-2 { padding-top: 0.5rem; }
                
                /* Wiki preview styles */
                wiki-preview {
                    color: #001a53ff;
                    cursor: pointer;
                    transition: color 0.2s ease;
                }
                wiki-preview:hover {
                    color: #1d4ed8;
                }
                
                /* Animation styles */
                #preview-card {
                    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
                    opacity: 0;
                    transform: translateY(10px) scale(0.95);
                }
                
                #preview-card.show {
                    visibility: visible !important;
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    startPreviewSystem() {
        new WikiPreview();
    }
}

// Auto-inject when script loads
new WikiPreviewInjector();