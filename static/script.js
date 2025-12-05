// Entry/Exit Tracker - Main JavaScript

const API_BASE = '/api';

// DOM Elements
const entryBtn = document.getElementById('entryBtn');
const exitBtn = document.getElementById('exitBtn');
const clearBtn = document.getElementById('clearBtn');
const entriesList = document.getElementById('entriesList');
const totalEntries = document.getElementById('totalEntries');
const totalExits = document.getElementById('totalExits');
const totalHours = document.getElementById('totalHours');

// Event Listeners
entryBtn.addEventListener('click', () => recordEntry('entry'));
exitBtn.addEventListener('click', () => recordEntry('exit'));
clearBtn.addEventListener('click', clearAllEntries);

// Family quick-select
const familyToggle = document.getElementById('familyToggle');
const familyList = document.getElementById('familyList');

if (familyToggle) {
    familyToggle.addEventListener('click', () => {
        familyList.classList.toggle('hidden');
    });

    // Wire up family buttons
    document.querySelectorAll('.family-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.textContent.trim();
            document.getElementById('personName').value = name;
            familyList.classList.add('hidden');
            showNotification(`${name} selected`, 'success');
        });
    });
}

// Place toggle (From / To)
const placeToggle = document.getElementById('placeToggle');
const placeForm = document.getElementById('placeForm');

if (placeToggle) {
    placeToggle.addEventListener('click', () => {
        placeForm.classList.toggle('hidden');
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadEntries();
    loadStats();
    // Refresh every 30 seconds
    setInterval(() => {
        loadEntries();
        loadStats();
    }, 30000);
});

/**
 * Record an entry or exit
 */
async function recordEntry(type) {
    const personName = document.getElementById('personName').value.trim();
    
    if (!personName) {
        showNotification('முதலில் உங்கள் பெயரை உள்ளிடவும்', 'error');
        return;
    }
    
    try {
        const placeFrom = document.getElementById('placeFrom') ? document.getElementById('placeFrom').value.trim() : '';
        const placeTo = document.getElementById('placeTo') ? document.getElementById('placeTo').value.trim() : '';

        const payload = { type: type, person_name: personName };
        if (placeFrom) payload.place_from = placeFrom;
        if (placeTo) payload.place_to = placeTo;

        const response = await fetch(`${API_BASE}/entry`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success) {
            // server now returns Tamil messages
            showNotification(data.message, 'success');
            loadEntries();
            loadStats();
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        showNotification('பதிவு செய்யும் போது பிழை: ' + error.message, 'error');
    }
}

/**
 * Load and display all entries
 */
async function loadEntries() {
    try {
        const response = await fetch(`${API_BASE}/entries`);
        const data = await response.json();

        if (data.success) {
            displayEntries(data.entries);
        } else {
            showNotification('Error loading entries', 'error');
        }
    } catch (error) {
        showNotification('Error loading entries: ' + error.message, 'error');
    }
}

/**
 * Display entries in the list
 */
function displayEntries(entries) {
    if (entries.length === 0) {
        entriesList.innerHTML = '<p class="empty-message">No entries yet. Click Entry or Exit to start tracking!</p>';
        return;
    }

    // Reverse to show newest first
    entries.reverse();

    entriesList.innerHTML = entries.map(entry => `
        <div class="entry-item entry-type-${entry.type}">
            <div class="entry-info">
                <div class="entry-type ${entry.type}">
                    ${entry.type === 'entry' ? '🔓 நுழைவு' : '🔒 வெளியேறு'}
                </div>
                <div class="entry-person">👤 ${entry.person_name}</div>
                ${entry.place_from ? `<div class="entry-place">📍 From: ${entry.place_from}</div>` : ''}
                ${entry.place_to ? `<div class="entry-place">🏁 To: ${entry.place_to}</div>` : ''}
                <div class="entry-time">${formatTime(entry.time_display)}</div>
            </div>
            <button class="entry-delete" onclick="deleteEntry(${entry.id})">Delete</button>
        </div>
    `).join('');
}

/**
 * Delete an entry
 */
async function deleteEntry(id) {
    if (!confirm('Are you sure you want to delete this entry?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/entries/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            showNotification(data.message, 'success');
            loadEntries();
            loadStats();
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        showNotification('Error deleting entry: ' + error.message, 'error');
    }
}

/**
 * Load and display statistics
 */
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/stats`);
        const data = await response.json();

        if (data.success) {
            totalEntries.textContent = data.stats.total_entries;
            totalExits.textContent = data.stats.total_exits;
            totalHours.textContent = data.stats.total_hours + 'h';
        } else {
            showNotification('Error loading stats', 'error');
        }
    } catch (error) {
        showNotification('Error loading stats: ' + error.message, 'error');
    }
}

/**
 * Clear all entries
 */
async function clearAllEntries() {
    if (!confirm('Are you sure you want to delete ALL entries? This cannot be undone!')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/clear`, {
            method: 'POST'
        });

        const data = await response.json();

        if (data.success) {
            showNotification(data.message, 'success');
            loadEntries();
            loadStats();
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        showNotification('Error clearing entries: ' + error.message, 'error');
    }
}

/**
 * Show notification
 */
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Format time display
 */
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}
