/**
 * TaskFlow - Lightweight Particle Confetti Engine
 * Zero external dependencies, high performance HTML5 canvas particle system.
 */
class ConfettiEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationFrame = null;
        this.colors = ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
        this.initCanvas();
    }

    initCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'taskflow-confetti-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '99999';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth * window.devicePixelRatio;
        this.canvas.height = window.innerHeight * window.devicePixelRatio;
        if (this.ctx) {
            this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
    }

    fire(options = {}) {
        const count = options.count || 45;
        const originX = options.x !== undefined ? options.x : window.innerWidth / 2;
        const originY = options.y !== undefined ? options.y : window.innerHeight / 2;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 4;
            this.particles.push({
                x: originX,
                y: originY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 3,
                size: Math.random() * 6 + 4,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 12,
                opacity: 1,
                decay: Math.random() * 0.02 + 0.015,
                gravity: 0.22,
                shape: Math.random() > 0.5 ? 'rect' : 'circle'
            });
        }

        if (!this.animationFrame) {
            this.render();
        }
    }

    render() {
        if (!this.ctx || !this.canvas) return;
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= 0.98;
            p.rotation += p.rotationSpeed;
            p.opacity -= p.decay;

            if (p.opacity <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, p.opacity);
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.fillStyle = p.color;

            if (p.shape === 'rect') {
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.restore();
        }

        if (this.particles.length > 0) {
            this.animationFrame = requestAnimationFrame(() => this.render());
        } else {
            this.animationFrame = null;
            this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
    }
}

window.confetti = new ConfettiEngine();


/**
 * TaskFlow â€” Modern Vanilla JavaScript Application
 * Production-ready state management, reactive rendering, and UX interactions.
 */

(function () {
    'use strict';

    // --- State Constants & Keys ---
    const STORAGE_KEY = 'taskflow_tasks';
    const THEME_KEY = 'taskflow_theme';

    // Initial Sample Tasks (Populated on first visit)
    const DEFAULT_TASKS = [
        {
            id: 'tf-sample-1',
            title: 'Explore TaskFlow features & workflow',
            completed: false,
            priority: 'high',
            category: 'Project',
            dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            notes: 'Try adding new tasks, setting priorities, using search, and testing dark mode!',
            createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
            id: 'tf-sample-2',
            title: 'Review design system specifications in Stitch',
            completed: true,
            priority: 'medium',
            category: 'Work',
            dueDate: new Date().toISOString().split('T')[0],
            notes: 'Refactored CSS color tokens, typography scales, and custom checkboxes.',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            completedAt: new Date(Date.now() - 1800000).toISOString()
        },
        {
            id: 'tf-sample-3',
            title: 'Try keyboard shortcuts: "/" to search, "N" for new task',
            completed: false,
            priority: 'low',
            category: 'Ideas',
            dueDate: '',
            notes: 'Quick navigation makes power users much faster.',
            createdAt: new Date(Date.now() - 10800000).toISOString()
        },
        {
            id: 'tf-sample-4',
            title: 'Export backup data to JSON',
            completed: false,
            priority: 'medium',
            category: 'Work',
            dueDate: '',
            notes: 'Keep local backups or transfer your tasks between browsers easily.',
            createdAt: new Date(Date.now() - 14400000).toISOString()
        }
    ];

    // --- Application State ---
    let state = {
        tasks: [],
        currentFilter: 'all', // 'all' | 'active' | 'completed'
        categoryFilter: 'all',
        searchQuery: '',
        sortBy: 'newest',
        theme: 'light',
        editingTaskId: null,
        lastDeletedTask: null,
        undoTimeoutId: null
    };

    // --- DOM Element References ---
    const elements = {
        themeToggleBtn: document.getElementById('theme-toggle-btn'),
        themeIconLight: document.getElementById('theme-icon-light'),
        themeIconDark: document.getElementById('theme-icon-dark'),
        
        statTotal: document.getElementById('stat-total'),
        statActive: document.getElementById('stat-active'),
        statCompleted: document.getElementById('stat-completed'),
        statRateText: document.getElementById('stat-rate-text'),
        statProgressBar: document.getElementById('stat-progress-bar'),

        addTaskForm: document.getElementById('add-task-form'),
        taskTitleInput: document.getElementById('task-title-input'),
        taskPrioritySelect: document.getElementById('task-priority-select'),
        taskCategorySelect: document.getElementById('task-category-select'),
        taskDueDate: document.getElementById('task-due-date'),

        searchInput: document.getElementById('search-input'),
        searchClearBtn: document.getElementById('search-clear-btn'),
        statusFilters: document.getElementById('status-filters'),
        filterCategorySelect: document.getElementById('filter-category-select'),
        sortSelect: document.getElementById('sort-select'),

        taskList: document.getElementById('task-list'),
        emptyState: document.getElementById('empty-state'),
        emptyTitle: document.getElementById('empty-title'),
        emptyDesc: document.getElementById('empty-desc'),
        taskCountSummary: document.getElementById('task-count-summary'),

        btnClearCompleted: document.getElementById('btn-clear-completed'),
        btnMarkAllDone: document.getElementById('btn-mark-all-done'),
        btnExportJson: document.getElementById('btn-export-json'),
        importFileInput: document.getElementById('import-file-input'),

        taskModal: document.getElementById('task-modal'),
        modalCloseBtn: document.getElementById('modal-close-btn'),
        modalCancelBtn: document.getElementById('modal-cancel-btn'),
        modalEditForm: document.getElementById('modal-edit-form'),
        modalTaskId: document.getElementById('modal-task-id'),
        modalTaskTitle: document.getElementById('modal-task-title'),
        modalTaskNotes: document.getElementById('modal-task-notes'),
        modalTaskPriority: document.getElementById('modal-task-priority'),
        modalTaskCategory: document.getElementById('modal-task-category'),
        modalTaskDue: document.getElementById('modal-task-due'),

        toastContainer: document.getElementById('toast-container')
    };

    // --- Helpers ---
    const escapeHTML = (str) => {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

    const formatDateBadge = (dateStr) => {
        if (!dateStr) return null;
        const targetDate = new Date(dateStr + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedDate = `${monthNames[targetDate.getMonth()]} ${targetDate.getDate()}`;

        if (diffDays < 0) {
            return { text: `Overdue (${formattedDate})`, class: 'overdue' };
        } else if (diffDays === 0) {
            return { text: 'Due Today', class: 'today' };
        } else if (diffDays === 1) {
            return { text: 'Due Tomorrow', class: '' };
        } else {
            return { text: `Due ${formattedDate}`, class: '' };
        }
    };

    // --- State Persistence ---
    const loadState = () => {
        // Theme
        const storedTheme = localStorage.getItem(THEME_KEY);
        if (storedTheme) {
            state.theme = storedTheme;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            state.theme = 'dark';
        }
        applyTheme(state.theme);

        // Tasks
        const storedTasks = localStorage.getItem(STORAGE_KEY);
        if (storedTasks) {
            try {
                const parsed = JSON.parse(storedTasks);
                state.tasks = Array.isArray(parsed) ? parsed : DEFAULT_TASKS;
            } catch (e) {
                console.error('Failed to parse tasks from localStorage', e);
                state.tasks = DEFAULT_TASKS;
            }
        } else {
            state.tasks = DEFAULT_TASKS;
            saveTasks();
        }
    };

    const saveTasks = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
    };

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            elements.themeIconLight.style.display = 'block';
            elements.themeIconDark.style.display = 'none';
        } else {
            elements.themeIconLight.style.display = 'none';
            elements.themeIconDark.style.display = 'block';
        }
        localStorage.setItem(THEME_KEY, theme);
    };

    // --- Toast Notifications ---
    const showToast = (message, undoCallback = null) => {
        elements.toastContainer.innerHTML = '';
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>${escapeHTML(message)}</span>`;

        if (undoCallback) {
            const undoBtn = document.createElement('button');
            undoBtn.className = 'toast-undo-btn';
            undoBtn.textContent = 'Undo';
            undoBtn.onclick = () => {
                undoCallback();
                toast.remove();
            };
            toast.appendChild(undoBtn);
        }

        elements.toastContainer.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(10px)';
                toast.style.transition = 'all 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4500);
    };

    // --- Task Actions ---
    const addTask = (title, priority, category, dueDate) => {
        const trimmed = title.trim();
        if (!trimmed) return;

        const newTask = {
            id: 'tf-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            title: trimmed,
            completed: false,
            priority: priority || 'medium',
            category: category || 'Work',
            dueDate: dueDate || '',
            notes: '',
            createdAt: new Date().toISOString()
        };

        state.tasks.unshift(newTask);
        saveTasks();
        render();
        showToast(`Task added: "${newTask.title}"`);
    };

    const toggleTask = (id, event) => {
        const task = state.tasks.find(t => t.id === id);
        if (!task) return;

        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;

        saveTasks();
        render();

        if (task.completed) {
            // Trigger Confetti Celebration!
            if (window.confetti) {
                const rect = event ? event.target.getBoundingClientRect() : null;
                window.confetti.fire({
                    x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
                    y: rect ? rect.top + rect.height / 2 : window.innerHeight / 2,
                    count: 35
                });
            }

            // Check if all tasks are complete
            const allDone = state.tasks.length > 0 && state.tasks.every(t => t.completed);
            if (allDone && window.confetti) {
                setTimeout(() => {
                    window.confetti.fire({ count: 80 });
                    showToast('ðŸŽ‰ Outstanding! All tasks completed!');
                }, 300);
            }
        }
    };

    const deleteTask = (id) => {
        const index = state.tasks.findIndex(t => t.id === id);
        if (index === -1) return;

        const deleted = state.tasks.splice(index, 1)[0];
        state.lastDeletedTask = { task: deleted, index: index };
        saveTasks();
        render();

        showToast(`Deleted "${deleted.title}"`, () => {
            if (state.lastDeletedTask) {
                state.tasks.splice(state.lastDeletedTask.index, 0, state.lastDeletedTask.task);
                state.lastDeletedTask = null;
                saveTasks();
                render();
                showToast('Task restored');
            }
        });
    };

    const duplicateTask = (id) => {
        const task = state.tasks.find(t => t.id === id);
        if (!task) return;

        const copy = {
            ...task,
            id: 'tf-' + Date.now(),
            title: task.title + ' (Copy)',
            completed: false,
            createdAt: new Date().toISOString()
        };

        const index = state.tasks.findIndex(t => t.id === id);
        state.tasks.splice(index + 1, 0, copy);
        saveTasks();
        render();
        showToast(`Duplicated task`);
    };

    const saveInlineEdit = (id, newTitle) => {
        const trimmed = newTitle.trim();
        if (!trimmed) {
            deleteTask(id);
            return;
        }

        const task = state.tasks.find(t => t.id === id);
        if (task) {
            task.title = trimmed;
            saveTasks();
        }
        state.editingTaskId = null;
        render();
    };

    // --- Modal Editing ---
    const openModal = (id) => {
        const task = state.tasks.find(t => t.id === id);
        if (!task) return;

        elements.modalTaskId.value = task.id;
        elements.modalTaskTitle.value = task.title;
        elements.modalTaskNotes.value = task.notes || '';
        elements.modalTaskPriority.value = task.priority || 'medium';
        elements.modalTaskCategory.value = task.category || 'Work';
        elements.modalTaskDue.value = task.dueDate || '';

        elements.taskModal.classList.add('active');
        elements.taskModal.setAttribute('aria-hidden', 'false');
        elements.modalTaskTitle.focus();
    };

    const closeModal = () => {
        elements.taskModal.classList.remove('active');
        elements.taskModal.setAttribute('aria-hidden', 'true');
    };

    // --- Filtering & Sorting ---
    const getFilteredTasks = () => {
        return state.tasks.filter(task => {
            // Status Filter
            if (state.currentFilter === 'active' && task.completed) return false;
            if (state.currentFilter === 'completed' && !task.completed) return false;

            // Category Filter
            if (state.categoryFilter !== 'all' && task.category !== state.categoryFilter) return false;

            // Search Query Filter
            if (state.searchQuery) {
                const query = state.searchQuery.toLowerCase();
                const matchTitle = task.title.toLowerCase().includes(query);
                const matchNotes = (task.notes || '').toLowerCase().includes(query);
                const matchCategory = (task.category || '').toLowerCase().includes(query);
                if (!matchTitle && !matchNotes && !matchCategory) return false;
            }

            return true;
        }).sort((a, b) => {
            if (state.sortBy === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (state.sortBy === 'oldest') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            } else if (state.sortBy === 'priority') {
                const pWeights = { high: 3, medium: 2, low: 1 };
                return (pWeights[b.priority] || 0) - (pWeights[a.priority] || 0);
            } else if (state.sortBy === 'due-date') {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            } else if (state.sortBy === 'alphabetical') {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });
    };

    // --- Rendering ---
    const updateStats = () => {
        const total = state.tasks.length;
        const completed = state.tasks.filter(t => t.completed).length;
        const active = total - completed;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        elements.statTotal.textContent = total;
        elements.statActive.textContent = active;
        elements.statCompleted.textContent = completed;
        elements.statRateText.textContent = `${rate}%`;
        elements.statProgressBar.style.width = `${rate}%`;
    };

    const render = () => {
        updateStats();

        const filteredTasks = getFilteredTasks();
        elements.taskCountSummary.textContent = `Showing ${filteredTasks.length} of ${state.tasks.length} task${state.tasks.length === 1 ? '' : 's'}`;

        elements.taskList.innerHTML = '';

        if (filteredTasks.length === 0) {
            elements.taskList.style.display = 'none';
            elements.emptyState.style.display = 'flex';

            if (state.tasks.length === 0) {
                elements.emptyTitle.textContent = 'No tasks in your flow';
                elements.emptyDesc.textContent = 'Add your first task using the input form above to begin.';
            } else if (state.searchQuery) {
                elements.emptyTitle.textContent = 'No matching tasks';
                elements.emptyDesc.textContent = `No tasks found matching "${state.searchQuery}". Try clearing search.`;
            } else if (state.currentFilter === 'active') {
                elements.emptyTitle.textContent = 'All clear!';
                elements.emptyDesc.textContent = 'You have completed all active tasks.';
            } else if (state.currentFilter === 'completed') {
                elements.emptyTitle.textContent = 'No completed tasks';
                elements.emptyDesc.textContent = 'Check off some tasks to see your completed work here.';
            }
        } else {
            elements.taskList.style.display = 'flex';
            elements.emptyState.style.display = 'none';

            filteredTasks.forEach(task => {
                const taskEl = document.createElement('div');
                taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;
                taskEl.dataset.id = task.id;

                if (state.editingTaskId === task.id) {
                    // Inline Edit Mode
                    taskEl.innerHTML = `
                        <div class="edit-mode-container">
                            <input type="text" class="inline-edit-input" value="${escapeHTML(task.title)}">
                            <button class="inline-save-btn">Save</button>
                            <button class="inline-cancel-btn">Cancel</button>
                        </div>
                    `;

                    const input = taskEl.querySelector('.inline-edit-input');
                    const saveBtn = taskEl.querySelector('.inline-save-btn');
                    const cancelBtn = taskEl.querySelector('.inline-cancel-btn');

                    setTimeout(() => {
                        input.focus();
                        input.select();
                    }, 0);

                    const doSave = () => saveInlineEdit(task.id, input.value);
                    const doCancel = () => {
                        state.editingTaskId = null;
                        render();
                    };

                    saveBtn.addEventListener('click', doSave);
                    cancelBtn.addEventListener('click', doCancel);
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') doSave();
                        if (e.key === 'Escape') doCancel();
                    });
                } else {
                    // Normal Task View
                    const dateBadge = formatDateBadge(task.dueDate);
                    const dateHTML = dateBadge 
                        ? `<span class="badge badge-due ${dateBadge.class}">ðŸ“… ${dateBadge.text}</span>` 
                        : '';

                    const notesIndicator = task.notes 
                        ? `<span class="badge" style="background: var(--surface-secondary); color: var(--text-muted);" title="${escapeHTML(task.notes)}">ðŸ“ Notes</span>`
                        : '';

                    taskEl.innerHTML = `
                        <div class="task-left">
                            <button class="custom-checkbox ${task.completed ? 'checked' : ''}" title="${task.completed ? 'Mark active' : 'Mark completed'}" aria-label="Toggle task status">
                                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </button>
                            <div class="task-details">
                                <span class="task-title">${escapeHTML(task.title)}</span>
                                <div class="task-badges">
                                    <span class="badge badge-p-${task.priority || 'medium'}">${task.priority || 'medium'}</span>
                                    <span class="badge badge-cat">${escapeHTML(task.category || 'General')}</span>
                                    ${dateHTML}
                                    ${notesIndicator}
                                </div>
                            </div>
                        </div>
                        <div class="task-actions">
                            <button class="action-btn btn-modal" title="View details & edit" aria-label="Details">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                            </button>
                            <button class="action-btn btn-duplicate" title="Duplicate task" aria-label="Duplicate">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                            </button>
                            <button class="action-btn btn-delete" title="Delete task" aria-label="Delete">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                        </div>
                    `;

                    // Event Listeners for Task Elements
                    const cb = taskEl.querySelector('.custom-checkbox');
                    cb.addEventListener('click', (e) => {
                        e.stopPropagation();
                        toggleTask(task.id, e);
                    });

                    const details = taskEl.querySelector('.task-details');
                    details.addEventListener('dblclick', () => {
                        state.editingTaskId = task.id;
                        render();
                    });

                    const btnModal = taskEl.querySelector('.btn-modal');
                    btnModal.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openModal(task.id);
                    });

                    const btnDup = taskEl.querySelector('.btn-duplicate');
                    btnDup.addEventListener('click', (e) => {
                        e.stopPropagation();
                        duplicateTask(task.id);
                    });

                    const btnDel = taskEl.querySelector('.btn-delete');
                    btnDel.addEventListener('click', (e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                    });
                }

                elements.taskList.appendChild(taskEl);
            });
        }
    };

    // --- Bulk & Import/Export Utilities ---
    const clearCompletedTasks = () => {
        const completedCount = state.tasks.filter(t => t.completed).length;
        if (completedCount === 0) {
            showToast('No completed tasks to clear.');
            return;
        }

        if (confirm(`Are you sure you want to remove ${completedCount} completed task${completedCount === 1 ? '' : 's'}?`)) {
            state.tasks = state.tasks.filter(t => !t.completed);
            saveTasks();
            render();
            showToast(`Cleared ${completedCount} completed task${completedCount === 1 ? '' : 's'}`);
        }
    };

    const markAllTasksDone = () => {
        const activeCount = state.tasks.filter(t => !t.completed).length;
        if (activeCount === 0) {
            showToast('All tasks are already marked complete.');
            return;
        }

        state.tasks.forEach(t => {
            t.completed = true;
            t.completedAt = new Date().toISOString();
        });
        saveTasks();
        render();

        if (window.confetti) {
            window.confetti.fire({ count: 70 });
        }
        showToast('All tasks marked as completed!');
    };

    const exportTasksToJSON = () => {
        const dataStr = JSON.stringify(state.tasks, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Tasks exported successfully!');
    };

    const importTasksFromJSON = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (Array.isArray(imported)) {
                    state.tasks = imported;
                    saveTasks();
                    render();
                    showToast(`Imported ${imported.length} tasks successfully!`);
                } else {
                    showToast('Invalid backup file format.');
                }
            } catch (err) {
                console.error('Failed to import JSON', err);
                showToast('Failed to parse backup JSON file.');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    // --- Setup Event Listeners ---
    const initEventListeners = () => {
        // Theme toggle
        elements.themeToggleBtn.addEventListener('click', () => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            applyTheme(state.theme);
        });

        // Add task form submit
        elements.addTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = elements.taskTitleInput.value;
            const priority = elements.taskPrioritySelect.value;
            const category = elements.taskCategorySelect.value;
            const dueDate = elements.taskDueDate.value;

            addTask(title, priority, category, dueDate);

            elements.taskTitleInput.value = '';
            elements.taskDueDate.value = '';
            elements.taskTitleInput.focus();
        });

        // Search input
        elements.searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            elements.searchClearBtn.classList.toggle('visible', state.searchQuery.length > 0);
            render();
        });

        elements.searchClearBtn.addEventListener('click', () => {
            state.searchQuery = '';
            elements.searchInput.value = '';
            elements.searchClearBtn.classList.remove('visible');
            elements.searchInput.focus();
            render();
        });

        // Status filters (All, Active, Completed)
        elements.statusFilters.querySelectorAll('.filter-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                elements.statusFilters.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.currentFilter = btn.dataset.filter;
                render();
            });
        });

        // Category filter dropdown
        elements.filterCategorySelect.addEventListener('change', (e) => {
            state.categoryFilter = e.target.value;
            render();
        });

        // Sort dropdown
        elements.sortSelect.addEventListener('change', (e) => {
            state.sortBy = e.target.value;
            render();
        });

        // Bulk buttons
        elements.btnClearCompleted.addEventListener('click', clearCompletedTasks);
        elements.btnMarkAllDone.addEventListener('click', markAllTasksDone);
        elements.btnExportJson.addEventListener('click', exportTasksToJSON);
        elements.importFileInput.addEventListener('change', importTasksFromJSON);

        // Modal Form Submit
        elements.modalEditForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = elements.modalTaskId.value;
            const task = state.tasks.find(t => t.id === id);
            if (task) {
                task.title = elements.modalTaskTitle.value.trim();
                task.notes = elements.modalTaskNotes.value.trim();
                task.priority = elements.modalTaskPriority.value;
                task.category = elements.modalTaskCategory.value;
                task.dueDate = elements.modalTaskDue.value;
                saveTasks();
                render();
                showToast('Task details updated');
            }
            closeModal();
        });

        elements.modalCloseBtn.addEventListener('click', closeModal);
        elements.modalCancelBtn.addEventListener('click', closeModal);
        elements.taskModal.addEventListener('click', (e) => {
            if (e.target === elements.taskModal) closeModal();
        });

        // Global Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
            const isTyping = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

            if (e.key === 'Escape') {
                if (elements.taskModal.classList.contains('active')) {
                    closeModal();
                } else if (state.editingTaskId) {
                    state.editingTaskId = null;
                    render();
                } else if (elements.searchInput === document.activeElement) {
                    elements.searchInput.blur();
                }
            }

            if (!isTyping) {
                if (e.key === '/') {
                    e.preventDefault();
                    elements.searchInput.focus();
                } else if (e.key === 'n' || e.key === 'N') {
                    e.preventDefault();
                    elements.taskTitleInput.focus();
                }
            }
        });
    };

    // --- Initialize Application ---
    const init = () => {
        loadState();
        initEventListeners();
        render();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

