// Script to generate tense example JSON files
const fs = require('fs');
const path = require('path');

const tenses = [
    {
        id: 'simple-past',
        name: 'Simple Past',
        description: 'Used for completed actions at a specific time in the past',
        verbForm: 'past',
        subjects: ['I', 'You', 'He', 'She', 'It', 'We', 'They', 'The dog', 'My friend', 'The teacher', 'Sarah', 'Tom', 'The children', 'My parents', 'The company'],
        verbs: [
            { base: 'walk', past: 'walked', pp: 'walked', ing: 'walking', s: 'walks' },
            { base: 'talk', past: 'talked', pp: 'talked', ing: 'talking', s: 'talks' },
            { base: 'play', past: 'played', pp: 'played', ing: 'playing', s: 'plays' },
            { base: 'work', past: 'worked', pp: 'worked', ing: 'working', s: 'works' },
            { base: 'study', past: 'studied', pp: 'studied', ing: 'studying', s: 'studies' },
            { base: 'cook', past: 'cooked', pp: 'cooked', ing: 'cooking', s: 'cooks' },
            { base: 'clean', past: 'cleaned', pp: 'cleaned', ing: 'cleaning', s: 'cleans' },
            { base: 'watch', past: 'watched', pp: 'watched', ing: 'watching', s: 'watches' },
            { base: 'listen', past: 'listened', pp: 'listened', ing: 'listening', s: 'listens' },
            { base: 'visit', past: 'visited', pp: 'visited', ing: 'visiting', s: 'visits' },
            { base: 'call', past: 'called', pp: 'called', ing: 'calling', s: 'calls' },
            { base: 'help', past: 'helped', pp: 'helped', ing: 'helping', s: 'helps' },
            { base: 'open', past: 'opened', pp: 'opened', ing: 'opening', s: 'opens' },
            { base: 'close', past: 'closed', pp: 'closed', ing: 'closing', s: 'closes' },
            { base: 'start', past: 'started', pp: 'started', ing: 'starting', s: 'starts' },
            { base: 'finish', past: 'finished', pp: 'finished', ing: 'finishing', s: 'finishes' },
            { base: 'arrive', past: 'arrived', pp: 'arrived', ing: 'arriving', s: 'arrives' },
            { base: 'live', past: 'lived', pp: 'lived', ing: 'living', s: 'lives' },
            { base: 'love', past: 'loved', pp: 'loved', ing: 'loving', s: 'loves' },
            { base: 'like', past: 'liked', pp: 'liked', ing: 'liking', s: 'likes' },
            { base: 'need', past: 'needed', pp: 'needed', ing: 'needing', s: 'needs' },
            { base: 'want', past: 'wanted', pp: 'wanted', ing: 'wanting', s: 'wants' },
            { base: 'use', past: 'used', pp: 'used', ing: 'using', s: 'uses' },
            { base: 'try', past: 'tried', pp: 'tried', ing: 'trying', s: 'tries' },
            { base: 'ask', past: 'asked', pp: 'asked', ing: 'asking', s: 'asks' },
            { base: 'move', past: 'moved', pp: 'moved', ing: 'moving', s: 'moves' },
            { base: 'learn', past: 'learned', pp: 'learned', ing: 'learning', s: 'learns' },
            { base: 'change', past: 'changed', pp: 'changed', ing: 'changing', s: 'changes' },
            { base: 'follow', past: 'followed', pp: 'followed', ing: 'following', s: 'follows' },
            { base: 'create', past: 'created', pp: 'created', ing: 'creating', s: 'creates' },
            { base: 'go', past: 'went', pp: 'gone', ing: 'going', s: 'goes' },
            { base: 'come', past: 'came', pp: 'come', ing: 'coming', s: 'comes' },
            { base: 'see', past: 'saw', pp: 'seen', ing: 'seeing', s: 'sees' },
            { base: 'take', past: 'took', pp: 'taken', ing: 'taking', s: 'takes' },
            { base: 'make', past: 'made', pp: 'made', ing: 'making', s: 'makes' },
            { base: 'get', past: 'got', pp: 'gotten', ing: 'getting', s: 'gets' },
            { base: 'give', past: 'gave', pp: 'given', ing: 'giving', s: 'gives' },
            { base: 'find', past: 'found', pp: 'found', ing: 'finding', s: 'finds' },
            { base: 'think', past: 'thought', pp: 'thought', ing: 'thinking', s: 'thinks' },
            { base: 'say', past: 'said', pp: 'said', ing: 'saying', s: 'says' },
            { base: 'know', past: 'knew', pp: 'known', ing: 'knowing', s: 'knows' },
            { base: 'write', past: 'wrote', pp: 'written', ing: 'writing', s: 'writes' },
            { base: 'read', past: 'read', pp: 'read', ing: 'reading', s: 'reads' },
            { base: 'run', past: 'ran', pp: 'run', ing: 'running', s: 'runs' },
            { base: 'eat', past: 'ate', pp: 'eaten', ing: 'eating', s: 'eats' },
            { base: 'drink', past: 'drank', pp: 'drunk', ing: 'drinking', s: 'drinks' },
            { base: 'sleep', past: 'slept', pp: 'slept', ing: 'sleeping', s: 'sleeps' },
            { base: 'speak', past: 'spoke', pp: 'spoken', ing: 'speaking', s: 'speaks' },
            { base: 'buy', past: 'bought', pp: 'bought', ing: 'buying', s: 'buys' },
            { base: 'sell', past: 'sold', pp: 'sold', ing: 'selling', s: 'sells' },
            { base: 'bring', past: 'brought', pp: 'brought', ing: 'bringing', s: 'brings' },
            { base: 'send', past: 'sent', pp: 'sent', ing: 'sending', s: 'sends' },
            { base: 'leave', past: 'left', pp: 'left', ing: 'leaving', s: 'leaves' },
            { base: 'meet', past: 'met', pp: 'met', ing: 'meeting', s: 'meets' },
            { base: 'build', past: 'built', pp: 'built', ing: 'building', s: 'builds' },
            { base: 'draw', past: 'drew', pp: 'drawn', ing: 'drawing', s: 'draws' },
            { base: 'drive', past: 'drove', pp: 'driven', ing: 'driving', s: 'drives' },
            { base: 'fly', past: 'flew', pp: 'flown', ing: 'flying', s: 'flies' },
            { base: 'grow', past: 'grew', pp: 'grown', ing: 'growing', s: 'grows' },
            { base: 'swim', past: 'swam', pp: 'swum', ing: 'swimming', s: 'swims' }
        ],
        timeExpressions: ['yesterday', 'last week', 'last month', 'last year', 'two days ago', 'an hour ago', 'this morning', 'last night', 'in 2020', 'when I was young'],
        objects: ['the book', 'the car', 'dinner', 'a letter', 'the project', 'the game', 'music', 'a movie', 'the door', 'the window', 'breakfast', 'lunch', 'the report', 'the presentation', 'a cake', 'the homework', 'the laundry', 'the dishes', 'the floor', 'the garden']
    },
    {
        id: 'simple-future',
        name: 'Simple Future',
        description: 'Used for actions that will happen in the future',
        verbForm: 'future'
    },
    {
        id: 'present-continuous',
        name: 'Present Continuous',
        description: 'Used for actions happening right now or around now',
        verbForm: 'continuous'
    },
    {
        id: 'past-continuous',
        name: 'Past Continuous',
        description: 'Used for actions that were in progress at a specific time in the past',
        verbForm: 'pastContinuous'
    },
    {
        id: 'future-continuous',
        name: 'Future Continuous',
        description: 'Used for actions that will be in progress at a specific time in the future',
        verbForm: 'futureContinuous'
    },
    {
        id: 'present-perfect',
        name: 'Present Perfect',
        description: 'Used for actions that happened at an unspecified time or have relevance to the present',
        verbForm: 'presentPerfect'
    },
    {
        id: 'past-perfect',
        name: 'Past Perfect',
        description: 'Used for actions that were completed before another past action',
        verbForm: 'pastPerfect'
    },
    {
        id: 'future-perfect',
        name: 'Future Perfect',
        description: 'Used for actions that will be completed before a specific future time',
        verbForm: 'futurePerfect'
    },
    {
        id: 'present-perfect-continuous',
        name: 'Present Perfect Continuous',
        description: 'Used for actions that started in the past and continue to the present',
        verbForm: 'presentPerfectContinuous'
    },
    {
        id: 'past-perfect-continuous',
        name: 'Past Perfect Continuous',
        description: 'Used for actions that were ongoing before another past action',
        verbForm: 'pastPerfectContinuous'
    },
    {
        id: 'future-perfect-continuous',
        name: 'Future Perfect Continuous',
        description: 'Used for actions that will have been ongoing until a future point',
        verbForm: 'futurePerfectContinuous'
    }
];

const subjects = ['I', 'You', 'He', 'She', 'It', 'We', 'They', 'The dog', 'My friend', 'The teacher', 'Sarah', 'Tom', 'The children', 'My parents', 'The company', 'The cat', 'John', 'Mary', 'The team', 'Everyone'];

const verbs = [
    { base: 'walk', past: 'walked', pp: 'walked', ing: 'walking', s: 'walks' },
    { base: 'talk', past: 'talked', pp: 'talked', ing: 'talking', s: 'talks' },
    { base: 'play', past: 'played', pp: 'played', ing: 'playing', s: 'plays' },
    { base: 'work', past: 'worked', pp: 'worked', ing: 'working', s: 'works' },
    { base: 'study', past: 'studied', pp: 'studied', ing: 'studying', s: 'studies' },
    { base: 'cook', past: 'cooked', pp: 'cooked', ing: 'cooking', s: 'cooks' },
    { base: 'clean', past: 'cleaned', pp: 'cleaned', ing: 'cleaning', s: 'cleans' },
    { base: 'watch', past: 'watched', pp: 'watched', ing: 'watching', s: 'watches' },
    { base: 'listen', past: 'listened', pp: 'listened', ing: 'listening', s: 'listens' },
    { base: 'visit', past: 'visited', pp: 'visited', ing: 'visiting', s: 'visits' },
    { base: 'call', past: 'called', pp: 'called', ing: 'calling', s: 'calls' },
    { base: 'help', past: 'helped', pp: 'helped', ing: 'helping', s: 'helps' },
    { base: 'open', past: 'opened', pp: 'opened', ing: 'opening', s: 'opens' },
    { base: 'close', past: 'closed', pp: 'closed', ing: 'closing', s: 'closes' },
    { base: 'start', past: 'started', pp: 'started', ing: 'starting', s: 'starts' },
    { base: 'finish', past: 'finished', pp: 'finished', ing: 'finishing', s: 'finishes' },
    { base: 'arrive', past: 'arrived', pp: 'arrived', ing: 'arriving', s: 'arrives' },
    { base: 'live', past: 'lived', pp: 'lived', ing: 'living', s: 'lives' },
    { base: 'love', past: 'loved', pp: 'loved', ing: 'loving', s: 'loves' },
    { base: 'like', past: 'liked', pp: 'liked', ing: 'liking', s: 'likes' },
    { base: 'need', past: 'needed', pp: 'needed', ing: 'needing', s: 'needs' },
    { base: 'want', past: 'wanted', pp: 'wanted', ing: 'wanting', s: 'wants' },
    { base: 'use', past: 'used', pp: 'used', ing: 'using', s: 'uses' },
    { base: 'try', past: 'tried', pp: 'tried', ing: 'trying', s: 'tries' },
    { base: 'ask', past: 'asked', pp: 'asked', ing: 'asking', s: 'asks' },
    { base: 'move', past: 'moved', pp: 'moved', ing: 'moving', s: 'moves' },
    { base: 'learn', past: 'learned', pp: 'learned', ing: 'learning', s: 'learns' },
    { base: 'change', past: 'changed', pp: 'changed', ing: 'changing', s: 'changes' },
    { base: 'follow', past: 'followed', pp: 'followed', ing: 'following', s: 'follows' },
    { base: 'create', past: 'created', pp: 'created', ing: 'creating', s: 'creates' },
    { base: 'go', past: 'went', pp: 'gone', ing: 'going', s: 'goes' },
    { base: 'come', past: 'came', pp: 'come', ing: 'coming', s: 'comes' },
    { base: 'see', past: 'saw', pp: 'seen', ing: 'seeing', s: 'sees' },
    { base: 'take', past: 'took', pp: 'taken', ing: 'taking', s: 'takes' },
    { base: 'make', past: 'made', pp: 'made', ing: 'making', s: 'makes' },
    { base: 'get', past: 'got', pp: 'gotten', ing: 'getting', s: 'gets' },
    { base: 'give', past: 'gave', pp: 'given', ing: 'giving', s: 'gives' },
    { base: 'find', past: 'found', pp: 'found', ing: 'finding', s: 'finds' },
    { base: 'think', past: 'thought', pp: 'thought', ing: 'thinking', s: 'thinks' },
    { base: 'say', past: 'said', pp: 'said', ing: 'saying', s: 'says' },
    { base: 'know', past: 'knew', pp: 'known', ing: 'knowing', s: 'knows' },
    { base: 'write', past: 'wrote', pp: 'written', ing: 'writing', s: 'writes' },
    { base: 'read', past: 'read', pp: 'read', ing: 'reading', s: 'reads' },
    { base: 'run', past: 'ran', pp: 'run', ing: 'running', s: 'runs' },
    { base: 'eat', past: 'ate', pp: 'eaten', ing: 'eating', s: 'eats' },
    { base: 'drink', past: 'drank', pp: 'drunk', ing: 'drinking', s: 'drinks' },
    { base: 'sleep', past: 'slept', pp: 'slept', ing: 'sleeping', s: 'sleeps' },
    { base: 'speak', past: 'spoke', pp: 'spoken', ing: 'speaking', s: 'speaks' },
    { base: 'buy', past: 'bought', pp: 'bought', ing: 'buying', s: 'buys' },
    { base: 'sell', past: 'sold', pp: 'sold', ing: 'selling', s: 'sells' },
    { base: 'bring', past: 'brought', pp: 'brought', ing: 'bringing', s: 'brings' },
    { base: 'send', past: 'sent', pp: 'sent', ing: 'sending', s: 'sends' },
    { base: 'leave', past: 'left', pp: 'left', ing: 'leaving', s: 'leaves' },
    { base: 'meet', past: 'met', pp: 'met', ing: 'meeting', s: 'meets' },
    { base: 'build', past: 'built', pp: 'built', ing: 'building', s: 'builds' },
    { base: 'draw', past: 'drew', pp: 'drawn', ing: 'drawing', s: 'draws' },
    { base: 'drive', past: 'drove', pp: 'driven', ing: 'driving', s: 'drives' },
    { base: 'fly', past: 'flew', pp: 'flown', ing: 'flying', s: 'flies' },
    { base: 'grow', past: 'grew', pp: 'grown', ing: 'growing', s: 'grows' },
    { base: 'swim', past: 'swam', pp: 'swum', ing: 'swimming', s: 'swims' },
    { base: 'teach', past: 'taught', pp: 'taught', ing: 'teaching', s: 'teaches' },
    { base: 'catch', past: 'caught', pp: 'caught', ing: 'catching', s: 'catches' },
    { base: 'pay', past: 'paid', pp: 'paid', ing: 'paying', s: 'pays' },
    { base: 'feel', past: 'felt', pp: 'felt', ing: 'feeling', s: 'feels' },
    { base: 'hold', past: 'held', pp: 'held', ing: 'holding', s: 'holds' },
    { base: 'stand', past: 'stood', pp: 'stood', ing: 'standing', s: 'stands' },
    { base: 'sit', past: 'sat', pp: 'sat', ing: 'sitting', s: 'sits' },
    { base: 'lose', past: 'lost', pp: 'lost', ing: 'losing', s: 'loses' },
    { base: 'win', past: 'won', pp: 'won', ing: 'winning', s: 'wins' },
    { base: 'break', past: 'broke', pp: 'broken', ing: 'breaking', s: 'breaks' },
    { base: 'spend', past: 'spent', pp: 'spent', ing: 'spending', s: 'spends' },
    { base: 'begin', past: 'began', pp: 'begun', ing: 'beginning', s: 'begins' },
    { base: 'choose', past: 'chose', pp: 'chosen', ing: 'choosing', s: 'chooses' },
    { base: 'fall', past: 'fell', pp: 'fallen', ing: 'falling', s: 'falls' },
    { base: 'keep', past: 'kept', pp: 'kept', ing: 'keeping', s: 'keeps' },
    { base: 'set', past: 'set', pp: 'set', ing: 'setting', s: 'sets' },
    { base: 'show', past: 'showed', pp: 'shown', ing: 'showing', s: 'shows' },
    { base: 'tell', past: 'told', pp: 'told', ing: 'telling', s: 'tells' },
    { base: 'understand', past: 'understood', pp: 'understood', ing: 'understanding', s: 'understands' },
    { base: 'wear', past: 'wore', pp: 'worn', ing: 'wearing', s: 'wears' }
];

const objects = [
    'the book', 'the car', 'dinner', 'a letter', 'the project', 'the game', 'music',
    'a movie', 'the door', 'the window', 'breakfast', 'lunch', 'the report',
    'the presentation', 'a cake', 'the homework', 'the laundry', 'the dishes',
    'the floor', 'the garden', 'the house', 'the office', 'the phone', 'the computer',
    'a song', 'the newspaper', 'the email', 'the message', 'the package', 'the ticket',
    'coffee', 'tea', 'water', 'a sandwich', 'pizza', 'the piano', 'guitar',
    'the meeting', 'the interview', 'the exam', 'the test', 'the lesson', 'the class',
    'English', 'French', 'Spanish', 'the document', 'the contract', 'the proposal'
];

const pastTimeExpressions = ['yesterday', 'last week', 'last month', 'last year', 'two days ago', 'an hour ago', 'this morning', 'last night', 'in 2020', 'when I was young', 'three years ago', 'a while ago'];
const futureTimeExpressions = ['tomorrow', 'next week', 'next month', 'next year', 'in two days', 'in an hour', 'tonight', 'this weekend', 'soon', 'later today', 'in the future', 'someday'];
const presentTimeExpressions = ['now', 'right now', 'at the moment', 'currently', 'today', 'this week', 'these days', 'at present'];
const durationExpressions = ['for two hours', 'for three days', 'for a week', 'for a month', 'for years', 'since morning', 'since yesterday', 'since 2020', 'all day', 'all week'];
const locations = ['at home', 'at work', 'in the park', 'at school', 'in the office', 'at the restaurant', 'in the library', 'at the gym', 'in the kitchen', 'at the store'];

function isThirdPerson(subject) {
    return ['He', 'She', 'It', 'The dog', 'My friend', 'The teacher', 'Sarah', 'Tom', 'The cat', 'John', 'Mary', 'The company', 'Everyone'].includes(subject);
}

function getBeVerb(subject, tense) {
    const isThird = isThirdPerson(subject);
    const isPlural = ['We', 'They', 'The children', 'My parents', 'The team'].includes(subject);

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
    return isThirdPerson(subject) ? 'has' : 'have';
}

function generateSentence(subject, verb, tenseType, timeExpr, obj, location) {
    const isThird = isThirdPerson(subject);
    let sentence, verbUsed;

    switch (tenseType) {
        case 'simple-past':
            sentence = `${subject} ${verb.past} ${obj} ${timeExpr}.`;
            verbUsed = verb.past;
            break;
        case 'simple-future':
            sentence = `${subject} will ${verb.base} ${obj} ${timeExpr}.`;
            verbUsed = 'will ' + verb.base;
            break;
        case 'present-continuous':
            sentence = `${subject} ${getBeVerb(subject, 'present')} ${verb.ing} ${obj} ${timeExpr}.`;
            verbUsed = verb.ing;
            break;
        case 'past-continuous':
            sentence = `${subject} ${getBeVerb(subject, 'past')} ${verb.ing} ${obj} ${timeExpr}.`;
            verbUsed = verb.ing;
            break;
        case 'future-continuous':
            sentence = `${subject} will be ${verb.ing} ${obj} ${timeExpr}.`;
            verbUsed = verb.ing;
            break;
        case 'present-perfect':
            sentence = `${subject} ${getHaveVerb(subject)} ${verb.pp} ${obj}.`;
            verbUsed = verb.pp;
            break;
        case 'past-perfect':
            sentence = `${subject} had ${verb.pp} ${obj} ${timeExpr}.`;
            verbUsed = verb.pp;
            break;
        case 'future-perfect':
            sentence = `${subject} will have ${verb.pp} ${obj} by ${timeExpr}.`;
            verbUsed = verb.pp;
            break;
        case 'present-perfect-continuous':
            sentence = `${subject} ${getHaveVerb(subject)} been ${verb.ing} ${obj} ${timeExpr}.`;
            verbUsed = verb.ing;
            break;
        case 'past-perfect-continuous':
            sentence = `${subject} had been ${verb.ing} ${obj} ${timeExpr}.`;
            verbUsed = verb.ing;
            break;
        case 'future-perfect-continuous':
            sentence = `${subject} will have been ${verb.ing} ${obj} ${timeExpr}.`;
            verbUsed = verb.ing;
            break;
        default:
            sentence = `${subject} ${verb.base} ${obj}.`;
            verbUsed = verb.base;
    }

    return { sentence: sentence.replace(/\s+/g, ' ').trim(), verb: verbUsed };
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateExamplesForTense(tenseId, tenseName, description, count = 500) {
    const examples = new Set();
    const exampleList = [];

    let timeExprs;
    switch (tenseId) {
        case 'simple-past':
        case 'past-continuous':
        case 'past-perfect':
        case 'past-perfect-continuous':
            timeExprs = pastTimeExpressions;
            break;
        case 'simple-future':
        case 'future-continuous':
        case 'future-perfect':
        case 'future-perfect-continuous':
            timeExprs = futureTimeExpressions;
            break;
        case 'present-continuous':
            timeExprs = presentTimeExpressions;
            break;
        case 'present-perfect':
        case 'present-perfect-continuous':
            timeExprs = durationExpressions;
            break;
        default:
            timeExprs = [''];
    }

    while (exampleList.length < count) {
        for (const subject of shuffle([...subjects])) {
            for (const verb of shuffle([...verbs])) {
                for (const obj of shuffle([...objects])) {
                    for (const timeExpr of shuffle([...timeExprs])) {
                        if (exampleList.length >= count) break;

                        const example = generateSentence(subject, verb, tenseId, timeExpr, obj, '');

                        if (!examples.has(example.sentence)) {
                            examples.add(example.sentence);
                            exampleList.push(example);
                        }
                    }
                    if (exampleList.length >= count) break;
                }
                if (exampleList.length >= count) break;
            }
            if (exampleList.length >= count) break;
        }
    }

    return {
        tense: tenseName,
        description: description,
        examples: exampleList.slice(0, count)
    };
}

// Generate all tense files
const tensesToGenerate = [
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

const dataDir = path.join(__dirname, 'data');

for (const tense of tensesToGenerate) {
    console.log(`Generating ${tense.name}...`);
    const data = generateExamplesForTense(tense.id, tense.name, tense.desc, 500);
    const filePath = path.join(dataDir, `${tense.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`  Created ${filePath} with ${data.examples.length} examples`);
}

console.log('Done!');
