// Improved example generator with truly random sentences and semantic verb-object matching
const fs = require('fs');
const path = require('path');

// Subjects with different categories for variety
const subjects = {
    people: ['I', 'You', 'He', 'She', 'We', 'They', 'John', 'Sarah', 'Tom', 'Emma', 'My friend', 'The teacher', 'My parents', 'The children', 'The students', 'My brother', 'Her sister', 'Our neighbors', 'The manager'],
    animals: ['The dog', 'The cat', 'The bird'],
    things: ['The company', 'The team']
};

// Verb categories with semantically compatible objects
const verbCategories = {
    movement: {
        verbs: [
            { base: 'walk', past: 'walked', pp: 'walked', ing: 'walking', s: 'walks' },
            { base: 'run', past: 'ran', pp: 'run', ing: 'running', s: 'runs' },
            { base: 'go', past: 'went', pp: 'gone', ing: 'going', s: 'goes' },
            { base: 'come', past: 'came', pp: 'come', ing: 'coming', s: 'comes' },
            { base: 'drive', past: 'drove', pp: 'driven', ing: 'driving', s: 'drives' },
            { base: 'fly', past: 'flew', pp: 'flown', ing: 'flying', s: 'flies' },
            { base: 'arrive', past: 'arrived', pp: 'arrived', ing: 'arriving', s: 'arrives' },
            { base: 'leave', past: 'left', pp: 'left', ing: 'leaving', s: 'leaves' },
            { base: 'return', past: 'returned', pp: 'returned', ing: 'returning', s: 'returns' }
        ],
        objects: ['to the park', 'to school', 'to work', 'to the store', 'to the gym', 'to the library', 'to the beach', 'to the office', 'to the market', 'home', 'to the airport', 'downtown']
    },
    study: {
        verbs: [
            { base: 'study', past: 'studied', pp: 'studied', ing: 'studying', s: 'studies' },
            { base: 'learn', past: 'learned', pp: 'learned', ing: 'learning', s: 'learns' },
            { base: 'teach', past: 'taught', pp: 'taught', ing: 'teaching', s: 'teaches' },
            { base: 'read', past: 'read', pp: 'read', ing: 'reading', s: 'reads' },
            { base: 'understand', past: 'understood', pp: 'understood', ing: 'understanding', s: 'understands' },
            { base: 'practice', past: 'practiced', pp: 'practiced', ing: 'practicing', s: 'practices' },
            { base: 'review', past: 'reviewed', pp: 'reviewed', ing: 'reviewing', s: 'reviews' }
        ],
        objects: ['English', 'French', 'Spanish', 'mathematics', 'history', 'science', 'the lesson', 'the chapter', 'grammar', 'vocabulary', 'the textbook', 'for the exam']
    },
    consume: {
        verbs: [
            { base: 'eat', past: 'ate', pp: 'eaten', ing: 'eating', s: 'eats' },
            { base: 'drink', past: 'drank', pp: 'drunk', ing: 'drinking', s: 'drinks' },
            { base: 'cook', past: 'cooked', pp: 'cooked', ing: 'cooking', s: 'cooks' },
            { base: 'prepare', past: 'prepared', pp: 'prepared', ing: 'preparing', s: 'prepares' },
            { base: 'make', past: 'made', pp: 'made', ing: 'making', s: 'makes' },
            { base: 'enjoy', past: 'enjoyed', pp: 'enjoyed', ing: 'enjoying', s: 'enjoys' },
            { base: 'order', past: 'ordered', pp: 'ordered', ing: 'ordering', s: 'orders' }
        ],
        objects: ['breakfast', 'lunch', 'dinner', 'a sandwich', 'pasta', 'coffee', 'tea', 'juice', 'a salad', 'soup', 'pizza', 'a snack']
    },
    entertainment: {
        verbs: [
            { base: 'watch', past: 'watched', pp: 'watched', ing: 'watching', s: 'watches' },
            { base: 'listen to', past: 'listened to', pp: 'listened to', ing: 'listening to', s: 'listens to' },
            { base: 'play', past: 'played', pp: 'played', ing: 'playing', s: 'plays' },
            { base: 'enjoy', past: 'enjoyed', pp: 'enjoyed', ing: 'enjoying', s: 'enjoys' }
        ],
        objects: ['a movie', 'the news', 'music', 'a song', 'football', 'tennis', 'basketball', 'the game', 'a video', 'a podcast', 'TV', 'a documentary']
    },
    work: {
        verbs: [
            { base: 'finish', past: 'finished', pp: 'finished', ing: 'finishing', s: 'finishes' },
            { base: 'start', past: 'started', pp: 'started', ing: 'starting', s: 'starts' },
            { base: 'complete', past: 'completed', pp: 'completed', ing: 'completing', s: 'completes' },
            { base: 'write', past: 'wrote', pp: 'written', ing: 'writing', s: 'writes' },
            { base: 'send', past: 'sent', pp: 'sent', ing: 'sending', s: 'sends' },
            { base: 'receive', past: 'received', pp: 'received', ing: 'receiving', s: 'receives' },
            { base: 'submit', past: 'submitted', pp: 'submitted', ing: 'submitting', s: 'submits' }
        ],
        objects: ['the report', 'the project', 'the email', 'the document', 'the presentation', 'the proposal', 'the assignment', 'the letter', 'the contract', 'the application', 'the task']
    },
    communication: {
        verbs: [
            { base: 'talk', past: 'talked', pp: 'talked', ing: 'talking', s: 'talks' },
            { base: 'speak', past: 'spoke', pp: 'spoken', ing: 'speaking', s: 'speaks' },
            { base: 'call', past: 'called', pp: 'called', ing: 'calling', s: 'calls' },
            { base: 'meet', past: 'met', pp: 'met', ing: 'meeting', s: 'meets' },
            { base: 'visit', past: 'visited', pp: 'visited', ing: 'visiting', s: 'visits' },
            { base: 'contact', past: 'contacted', pp: 'contacted', ing: 'contacting', s: 'contacts' }
        ],
        objects: ['the teacher', 'the manager', 'my friend', 'the team', 'the client', 'my family', 'the doctor', 'the neighbors', 'my parents', 'the boss']
    },
    creation: {
        verbs: [
            { base: 'build', past: 'built', pp: 'built', ing: 'building', s: 'builds' },
            { base: 'draw', past: 'drew', pp: 'drawn', ing: 'drawing', s: 'draws' },
            { base: 'paint', past: 'painted', pp: 'painted', ing: 'painting', s: 'paints' },
            { base: 'fix', past: 'fixed', pp: 'fixed', ing: 'fixing', s: 'fixes' },
            { base: 'clean', past: 'cleaned', pp: 'cleaned', ing: 'cleaning', s: 'cleans' },
            { base: 'repair', past: 'repaired', pp: 'repaired', ing: 'repairing', s: 'repairs' },
            { base: 'design', past: 'designed', pp: 'designed', ing: 'designing', s: 'designs' }
        ],
        objects: ['the house', 'the car', 'the room', 'the computer', 'the furniture', 'the garden', 'a website', 'a picture', 'the kitchen', 'the bathroom']
    },
    acquisition: {
        verbs: [
            { base: 'buy', past: 'bought', pp: 'bought', ing: 'buying', s: 'buys' },
            { base: 'sell', past: 'sold', pp: 'sold', ing: 'selling', s: 'sells' },
            { base: 'find', past: 'found', pp: 'found', ing: 'finding', s: 'finds' },
            { base: 'get', past: 'got', pp: 'gotten', ing: 'getting', s: 'gets' },
            { base: 'give', past: 'gave', pp: 'given', ing: 'giving', s: 'gives' },
            { base: 'choose', past: 'chose', pp: 'chosen', ing: 'choosing', s: 'chooses' }
        ],
        objects: ['a new car', 'a book', 'a gift', 'the phone', 'the ticket', 'the keys', 'groceries', 'clothes', 'a present', 'a laptop', 'flowers']
    },
    mental: {
        verbs: [
            { base: 'think about', past: 'thought about', pp: 'thought about', ing: 'thinking about', s: 'thinks about' },
            { base: 'remember', past: 'remembered', pp: 'remembered', ing: 'remembering', s: 'remembers' },
            { base: 'forget', past: 'forgot', pp: 'forgotten', ing: 'forgetting', s: 'forgets' },
            { base: 'plan', past: 'planned', pp: 'planned', ing: 'planning', s: 'plans' },
            { base: 'consider', past: 'considered', pp: 'considered', ing: 'considering', s: 'considers' }
        ],
        objects: ['the future', 'the problem', 'the trip', 'the meeting', 'the decision', 'the situation', 'the birthday', 'the event', 'the vacation', 'the options']
    }
};

// Time expressions for each tense type
const timeExpressions = {
    past: ['yesterday', 'last week', 'last month', 'last year', 'two days ago', 'this morning', 'last night', 'on Monday', 'in 2020', 'earlier today'],
    future: ['tomorrow', 'next week', 'next month', 'next year', 'in two days', 'tonight', 'this weekend', 'soon', 'later', 'this evening'],
    present: ['now', 'right now', 'at the moment', 'currently', 'today', 'this week'],
    duration: ['for two hours', 'for three days', 'for a week', 'for a month', 'for years', 'since morning', 'since yesterday', 'since Monday', 'all day', 'all week']
};

// Locations
const locations = ['at home', 'at work', 'in the park', 'at school', 'in the office', 'at the restaurant', 'in the library', 'at the gym', 'in the kitchen'];

// Helper functions
function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getAllSubjects() {
    return [...subjects.people, ...subjects.animals, ...subjects.things];
}

// Pick a random category and return a verb with its compatible object
function getVerbAndObject() {
    const categories = Object.keys(verbCategories);
    const category = random(categories);
    const cat = verbCategories[category];
    return {
        verb: random(cat.verbs),
        obj: random(cat.objects)
    };
}

function isThirdPersonSingular(subject) {
    const thirdPerson = ['He', 'She', 'It', 'The dog', 'The cat', 'The bird', 'The company', 'The team', 'John', 'Sarah', 'Tom', 'Emma', 'My friend', 'The teacher', 'My brother', 'Her sister', 'The manager'];
    return thirdPerson.includes(subject);
}

function getBeVerb(subject, tense) {
    const isThird = isThirdPersonSingular(subject);
    const isPlural = ['We', 'They', 'My parents', 'The children', 'The students', 'Our neighbors'].includes(subject);

    if (tense === 'present') {
        if (subject === 'I') return 'am';
        if (isThird && !isPlural) return 'is';
        return 'are';
    }
    if (tense === 'past') {
        if (subject === 'I' || (isThird && !isPlural)) return 'was';
        return 'were';
    }
    return 'be';
}

function getHaveVerb(subject) {
    return isThirdPersonSingular(subject) ? 'has' : 'have';
}

// Generate a sentence based on tense
function generateSentence(tenseId) {
    const subject = random(getAllSubjects());
    const { verb, obj } = getVerbAndObject();
    const location = random(locations);
    const isThird = isThirdPersonSingular(subject);

    let sentence, verbUsed;
    const pattern = Math.floor(Math.random() * 3);

    switch (tenseId) {
        case 'simple-present': {
            const verbForm = isThird ? verb.s : verb.base;
            const time = random([...timeExpressions.present, '']);
            verbUsed = verbForm.split(' ')[0]; // Get main verb for highlighting
            if (pattern === 0) sentence = `${subject} ${verbForm} ${obj}${time ? ' ' + time : ''}.`;
            else if (pattern === 1) sentence = `${subject} often ${verbForm} ${obj}.`;
            else sentence = `${subject} usually ${verbForm} ${obj}.`;
            break;
        }

        case 'simple-past': {
            const time = random(timeExpressions.past);
            verbUsed = verb.past.split(' ')[0];
            if (pattern === 0) sentence = `${subject} ${verb.past} ${obj} ${time}.`;
            else if (pattern === 1) sentence = `${time.charAt(0).toUpperCase() + time.slice(1)}, ${subject.toLowerCase()} ${verb.past} ${obj}.`;
            else sentence = `${subject} ${verb.past} ${obj} ${location}.`;
            break;
        }

        case 'simple-future': {
            const time = random(timeExpressions.future);
            verbUsed = verb.base.split(' ')[0];
            if (pattern === 0) sentence = `${subject} will ${verb.base} ${obj} ${time}.`;
            else if (pattern === 1) sentence = `${time.charAt(0).toUpperCase() + time.slice(1)}, ${subject.toLowerCase()} will ${verb.base} ${obj}.`;
            else sentence = `${subject} will ${verb.base} ${obj}.`;
            break;
        }

        case 'present-continuous': {
            const be = getBeVerb(subject, 'present');
            const time = random(timeExpressions.present);
            verbUsed = verb.ing.split(' ')[0];
            if (pattern === 0) sentence = `${subject} ${be} ${verb.ing} ${obj} ${time}.`;
            else if (pattern === 1) sentence = `${time.charAt(0).toUpperCase() + time.slice(1)}, ${subject.toLowerCase()} ${be} ${verb.ing} ${obj}.`;
            else sentence = `${subject} ${be} ${verb.ing} ${obj}.`;
            break;
        }

        case 'past-continuous': {
            const be = getBeVerb(subject, 'past');
            const time = random(timeExpressions.past);
            verbUsed = verb.ing.split(' ')[0];
            if (pattern === 0) sentence = `${subject} ${be} ${verb.ing} ${obj} ${time}.`;
            else if (pattern === 1) sentence = `${time.charAt(0).toUpperCase() + time.slice(1)}, ${subject.toLowerCase()} ${be} ${verb.ing} ${obj}.`;
            else sentence = `${subject} ${be} ${verb.ing} ${obj} when the phone rang.`;
            break;
        }

        case 'future-continuous': {
            const time = random(timeExpressions.future);
            verbUsed = verb.ing.split(' ')[0];
            if (pattern === 0) sentence = `${subject} will be ${verb.ing} ${obj} ${time}.`;
            else if (pattern === 1) sentence = `${time.charAt(0).toUpperCase() + time.slice(1)}, ${subject.toLowerCase()} will be ${verb.ing} ${obj}.`;
            else sentence = `At this time ${time}, ${subject.toLowerCase()} will be ${verb.ing} ${obj}.`;
            break;
        }

        case 'present-perfect': {
            const have = getHaveVerb(subject);
            const adverb = random(['already', 'just', 'recently', 'finally', '']);
            verbUsed = verb.pp.split(' ')[0];
            if (pattern === 0) sentence = `${subject} ${have} ${verb.pp} ${obj}.`;
            else if (pattern === 1 && adverb) sentence = `${subject} ${have} ${adverb} ${verb.pp} ${obj}.`;
            else sentence = `${subject} ${have} never ${verb.pp} ${obj} before.`;
            break;
        }

        case 'past-perfect': {
            const time = random(timeExpressions.past);
            verbUsed = verb.pp.split(' ')[0];
            if (pattern === 0) sentence = `${subject} had ${verb.pp} ${obj} before ${time}.`;
            else if (pattern === 1) sentence = `By the time I arrived, ${subject.toLowerCase()} had ${verb.pp} ${obj}.`;
            else sentence = `${subject} had already ${verb.pp} ${obj}.`;
            break;
        }

        case 'future-perfect': {
            const time = random(timeExpressions.future);
            verbUsed = verb.pp.split(' ')[0];
            if (pattern === 0) sentence = `${subject} will have ${verb.pp} ${obj} by ${time}.`;
            else if (pattern === 1) sentence = `By ${time}, ${subject.toLowerCase()} will have ${verb.pp} ${obj}.`;
            else sentence = `${subject} will have ${verb.pp} ${obj} by then.`;
            break;
        }

        case 'present-perfect-continuous': {
            const have = getHaveVerb(subject);
            const time = random(timeExpressions.duration);
            verbUsed = verb.ing.split(' ')[0];
            if (pattern === 0) sentence = `${subject} ${have} been ${verb.ing} ${obj} ${time}.`;
            else if (pattern === 1) sentence = `${subject} ${have} been ${verb.ing} ${obj} lately.`;
            else sentence = `${subject} ${have} been ${verb.ing} ${obj} recently.`;
            break;
        }

        case 'past-perfect-continuous': {
            const time = random(timeExpressions.duration);
            verbUsed = verb.ing.split(' ')[0];
            if (pattern === 0) sentence = `${subject} had been ${verb.ing} ${obj} ${time}.`;
            else if (pattern === 1) sentence = `${subject} had been ${verb.ing} ${obj} before the meeting.`;
            else sentence = `By noon, ${subject.toLowerCase()} had been ${verb.ing} ${obj} ${time}.`;
            break;
        }

        case 'future-perfect-continuous': {
            const time = random(timeExpressions.future);
            const duration = random(timeExpressions.duration);
            verbUsed = verb.ing.split(' ')[0];
            if (pattern === 0) sentence = `${subject} will have been ${verb.ing} ${obj} ${duration} by ${time}.`;
            else if (pattern === 1) sentence = `By ${time}, ${subject.toLowerCase()} will have been ${verb.ing} ${obj}.`;
            else sentence = `Next month, ${subject.toLowerCase()} will have been ${verb.ing} ${obj} ${duration}.`;
            break;
        }

        default:
            verbUsed = verb.base.split(' ')[0];
            sentence = `${subject} ${verb.base} ${obj}.`;
    }

    // Clean up double spaces
    sentence = sentence.replace(/\s+/g, ' ').trim();

    return { sentence, verb: verbUsed };
}

// Generate examples for a tense
function generateExamples(tenseId, tenseName, description, count = 500) {
    const examples = new Set();
    const result = [];

    while (result.length < count) {
        const { sentence, verb } = generateSentence(tenseId);

        if (!examples.has(sentence)) {
            examples.add(sentence);
            result.push({ sentence, verb });
        }
    }

    // Shuffle the results
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return {
        tense: tenseName,
        description,
        examples: result
    };
}

// Tense configurations
const tensesToGenerate = [
    { id: 'simple-present', name: 'Simple Present', desc: 'Used for habits, routines, general truths, and facts' },
    { id: 'simple-past', name: 'Simple Past', desc: 'Used for completed actions at a specific time in the past' },
    { id: 'simple-future', name: 'Simple Future', desc: 'Used for actions that will happen in the future' },
    { id: 'present-continuous', name: 'Present Continuous', desc: 'Used for actions happening right now or around now' },
    { id: 'past-continuous', name: 'Past Continuous', desc: 'Used for actions that were in progress at a specific time in the past' },
    { id: 'future-continuous', name: 'Future Continuous', desc: 'Used for actions that will be in progress at a specific time in the future' },
    { id: 'present-perfect', name: 'Present Perfect', desc: 'Used for actions that happened at an unspecified time or have relevance to the present' },
    { id: 'past-perfect', name: 'Past Perfect', desc: 'Used for actions that were completed before another past action' },
    { id: 'future-perfect', name: 'Future Perfect', desc: 'Used for actions that will be completed before a specific future time' },
    { id: 'present-perfect-continuous', name: 'Present Perfect Continuous', desc: 'Used for actions that started in the past and continue to the present' },
    { id: 'past-perfect-continuous', name: 'Past Perfect Continuous', desc: 'Used for actions that were ongoing before another past action' },
    { id: 'future-perfect-continuous', name: 'Future Perfect Continuous', desc: 'Used for actions that will have been ongoing until a future point' }
];

const dataDir = path.join(__dirname, '..', 'public', 'data');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Generate all files
for (const tense of tensesToGenerate) {
    console.log(`Generating ${tense.name}...`);
    const data = generateExamples(tense.id, tense.name, tense.desc, 2000);
    const filePath = path.join(dataDir, `${tense.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`  Created ${tense.id}.json with ${data.examples.length} examples`);
}

console.log('\nDone! Generated 24000 examples across 12 tenses.');
