// Tense configuration
const TENSES = [
    { id: 'simple-present', name: 'Simple Present' },
    { id: 'simple-past', name: 'Simple Past' },
    { id: 'simple-future', name: 'Simple Future' },
    { id: 'present-continuous', name: 'Present Continuous' },
    { id: 'past-continuous', name: 'Past Continuous' },
    { id: 'future-continuous', name: 'Future Continuous' },
    { id: 'present-perfect', name: 'Present Perfect' },
    { id: 'past-perfect', name: 'Past Perfect' },
    { id: 'future-perfect', name: 'Future Perfect' },
    { id: 'present-perfect-continuous', name: 'Present Perfect Continuous' },
    { id: 'past-perfect-continuous', name: 'Past Perfect Continuous' },
    { id: 'future-perfect-continuous', name: 'Future Perfect Continuous' }
];

// State
let currentTenseData = null;
let currentExample = null;
let favorites = [];
let showingFavorites = false;
let dictionaryCache = {};

// DOM Elements
const tenseSelector = document.getElementById('tense-selector');
const randomBtn = document.getElementById('random-btn');
const favoritesBtn = document.getElementById('favorites-btn');
const favoritesCount = document.getElementById('favorites-count');
const tenseInfo = document.getElementById('tense-info');
const tenseName = document.getElementById('tense-name');
const tenseDescription = document.getElementById('tense-description');
const exampleContainer = document.getElementById('example-container');
const exampleSentence = document.getElementById('example-sentence');
const addFavoriteBtn = document.getElementById('add-favorite-btn');
const nextBtn = document.getElementById('next-btn');
const favoritesContainer = document.getElementById('favorites-container');
const favoritesList = document.getElementById('favorites-list');
const noFavorites = document.getElementById('no-favorites');
const tooltip = document.getElementById('tooltip');
const tooltipWord = document.getElementById('tooltip-word');
const tooltipPhonetic = document.getElementById('tooltip-phonetic');
const tooltipContent = document.getElementById('tooltip-content');

// Initialize
function init() {
    loadFavorites();
    populateTenseSelector();
    setupEventListeners();
    updateFavoritesCount();
}

function populateTenseSelector() {
    TENSES.forEach(tense => {
        const option = document.createElement('option');
        option.value = tense.id;
        option.textContent = tense.name;
        tenseSelector.appendChild(option);
    });
}

function setupEventListeners() {
    tenseSelector.addEventListener('change', handleTenseChange);
    randomBtn.addEventListener('click', showRandomExample);
    favoritesBtn.addEventListener('click', toggleFavorites);
    addFavoriteBtn.addEventListener('click', toggleCurrentFavorite);
    nextBtn.addEventListener('click', showRandomExample);
    
    // Close tooltip when clicking outside
    document.addEventListener('click', (e) => {
        if (!tooltip.contains(e.target) && !e.target.classList.contains('word')) {
            hideTooltip();
        }
    });
}

// Tense handling
async function handleTenseChange() {
    const tenseId = tenseSelector.value;
    
    if (!tenseId) {
        tenseInfo.classList.add('hidden');
        exampleContainer.classList.add('hidden');
        currentTenseData = null;
        return;
    }
    
    showingFavorites = false;
    favoritesContainer.classList.add('hidden');
    
    try {
        const response = await fetch(`data/${tenseId}.json`);
        currentTenseData = await response.json();
        
        tenseName.textContent = currentTenseData.tense;
        tenseDescription.textContent = currentTenseData.description;
        tenseInfo.classList.remove('hidden');
        
        showRandomExample();
    } catch (error) {
        console.error('Error loading tense data:', error);
        tenseInfo.classList.add('hidden');
        exampleContainer.classList.add('hidden');
    }
}

function showRandomExample() {
    if (!currentTenseData || !currentTenseData.examples.length) return;
    
    const randomIndex = Math.floor(Math.random() * currentTenseData.examples.length);
    currentExample = {
        ...currentTenseData.examples[randomIndex],
        tenseId: tenseSelector.value,
        tenseName: currentTenseData.tense
    };
    
    renderExample(currentExample);
    exampleContainer.classList.remove('hidden');
    updateFavoriteButton();
}

function renderExample(example) {
    const sentence = example.sentence;
    const verb = example.verb;
    
    // Split sentence into words while preserving punctuation
    const words = sentence.match(/[\w']+|[^\w\s]/g) || [];
    
    exampleSentence.innerHTML = words.map(word => {
        const cleanWord = word.replace(/[^\w']/g, '');
        const isVerb = cleanWord.toLowerCase() === verb.toLowerCase();
        const isPunctuation = /^[^\w]+$/.test(word);
        
        if (isPunctuation) {
            return word;
        }
        
        return `<span class="word${isVerb ? ' verb' : ''}" data-word="${cleanWord}">${word}</span>`;
    }).join(' ');
    
    // Add click listeners to words
    exampleSentence.querySelectorAll('.word').forEach(wordEl => {
        wordEl.addEventListener('click', (e) => {
            e.stopPropagation();
            showTooltip(wordEl);
        });
    });
}

// Dictionary tooltip
async function showTooltip(wordEl) {
    const word = wordEl.dataset.word.toLowerCase();
    const rect = wordEl.getBoundingClientRect();
    
    // Position tooltip
    tooltip.classList.remove('hidden');
    
    const tooltipRect = tooltip.getBoundingClientRect();
    let left = rect.left;
    let top = rect.bottom + 8;
    
    // Adjust if tooltip goes off screen
    if (left + tooltipRect.width > window.innerWidth - 16) {
        left = window.innerWidth - tooltipRect.width - 16;
    }
    if (left < 16) {
        left = 16;
    }
    if (top + tooltipRect.height > window.innerHeight - 16) {
        top = rect.top - tooltipRect.height - 8;
    }
    
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    
    tooltipWord.textContent = word;
    tooltipPhonetic.textContent = '';
    tooltipContent.innerHTML = '<div class="tooltip-loading">Loading...</div>';
    
    // Check cache first
    if (dictionaryCache[word]) {
        renderTooltipContent(dictionaryCache[word]);
        return;
    }
    
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        
        if (!response.ok) {
            tooltipContent.innerHTML = '<div class="tooltip-error">Definition not found</div>';
            return;
        }
        
        const data = await response.json();
        dictionaryCache[word] = data[0];
        renderTooltipContent(data[0]);
    } catch (error) {
        tooltipContent.innerHTML = '<div class="tooltip-error">Failed to load definition</div>';
    }
}

function renderTooltipContent(data) {
    if (data.phonetic) {
        tooltipPhonetic.textContent = data.phonetic;
    } else if (data.phonetics && data.phonetics.length > 0) {
        const phonetic = data.phonetics.find(p => p.text) || data.phonetics[0];
        if (phonetic.text) {
            tooltipPhonetic.textContent = phonetic.text;
        }
    }
    
    const meanings = data.meanings.slice(0, 3); // Limit to 3 meanings
    
    tooltipContent.innerHTML = meanings.map(meaning => {
        const definition = meaning.definitions[0];
        return `
            <div class="tooltip-meaning">
                <div class="tooltip-pos">${meaning.partOfSpeech}</div>
                <div class="tooltip-definition">${definition.definition}</div>
                ${definition.example ? `<div class="tooltip-example">"${definition.example}"</div>` : ''}
            </div>
        `;
    }).join('');
}

function hideTooltip() {
    tooltip.classList.add('hidden');
}

// Favorites
function loadFavorites() {
    const stored = localStorage.getItem('english-tenses-favorites');
    favorites = stored ? JSON.parse(stored) : [];
}

function saveFavorites() {
    localStorage.setItem('english-tenses-favorites', JSON.stringify(favorites));
    updateFavoritesCount();
}

function updateFavoritesCount() {
    favoritesCount.textContent = favorites.length;
}

function isFavorite(example) {
    return favorites.some(fav => 
        fav.sentence === example.sentence && fav.tenseId === example.tenseId
    );
}

function toggleCurrentFavorite() {
    if (!currentExample) return;
    
    if (isFavorite(currentExample)) {
        favorites = favorites.filter(fav => 
            !(fav.sentence === currentExample.sentence && fav.tenseId === currentExample.tenseId)
        );
    } else {
        favorites.push({ ...currentExample });
    }
    
    saveFavorites();
    updateFavoriteButton();
    
    if (showingFavorites) {
        renderFavorites();
    }
}

function updateFavoriteButton() {
    if (!currentExample) return;
    
    if (isFavorite(currentExample)) {
        addFavoriteBtn.textContent = '★ Remove from Favorites';
    } else {
        addFavoriteBtn.textContent = '☆ Add to Favorites';
    }
}

function toggleFavorites() {
    showingFavorites = !showingFavorites;
    
    if (showingFavorites) {
        tenseSelector.value = '';
        tenseInfo.classList.add('hidden');
        exampleContainer.classList.add('hidden');
        currentTenseData = null;
        currentExample = null;
        
        favoritesContainer.classList.remove('hidden');
        renderFavorites();
    } else {
        favoritesContainer.classList.add('hidden');
    }
}

function renderFavorites() {
    if (favorites.length === 0) {
        favoritesList.classList.add('hidden');
        noFavorites.classList.remove('hidden');
        return;
    }
    
    noFavorites.classList.add('hidden');
    favoritesList.classList.remove('hidden');
    
    favoritesList.innerHTML = favorites.map((fav, index) => {
        const words = fav.sentence.match(/[\w']+|[^\w\s]/g) || [];
        const sentenceHtml = words.map(word => {
            const cleanWord = word.replace(/[^\w']/g, '');
            const isVerb = cleanWord.toLowerCase() === fav.verb.toLowerCase();
            const isPunctuation = /^[^\w]+$/.test(word);
            
            if (isPunctuation) {
                return word;
            }
            
            return `<span class="word${isVerb ? ' verb' : ''}" data-word="${cleanWord}">${word}</span>`;
        }).join(' ');
        
        return `
            <div class="favorite-item" data-index="${index}">
                <p class="sentence">${sentenceHtml}</p>
                <span class="tense-label">${fav.tenseName}</span>
                <button class="remove-btn" data-index="${index}">✕</button>
            </div>
        `;
    }).join('');
    
    // Add event listeners
    favoritesList.querySelectorAll('.word').forEach(wordEl => {
        wordEl.addEventListener('click', (e) => {
            e.stopPropagation();
            showTooltip(wordEl);
        });
    });
    
    favoritesList.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            favorites.splice(index, 1);
            saveFavorites();
            renderFavorites();
        });
    });
}

// Start the app
init();
