var db = window.localStorage;
var storage = 'questions';
var maxStore = 24;
var tags = db.getItem('tags');

// whenever a popup opens, provide it with questions

chrome.extension.onRequest.addListener(function(request) { 
    if (request.initialize) {
        sendQuestions();
        sendTags();
    }
    if (request.tags) {
        tags = request.tags;
        db.setItem('tags', tags);
        sendTags();
    }
});

// get questions from the StackOverflow API and store away in localStorage

function requestData()
{
    var url = 'http://api.stackoverflow.com/1.1/questions/unanswered?pagesize=' + maxStore + '&tagged=' + (tags ? tags : '');
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'jsonp',
        jsonp: 'jsonp',
        success: storeResults,
        error: function() { console.log('Error'); }
    });
}

function storeResults(data)
{
    var newQuestions = data.questions;

    try {
        var questions = JSON.parse(db.getItem(storage));
        if (!questions) { questions = []; }
    } catch(e) {
        console.log('questions not found');
        var questions = [];
    }

    // we want questions to be an array of question objects of length < maxStore
    questions = newQuestions.concat(questions).splice(0, maxStore);
    db.setItem(storage, JSON.stringify(questions));
}

function sendQuestions()
{
    var questions = JSON.parse(db.getItem(storage));
    chrome.extension.sendRequest({ 'questions': questions });
}

function sendTags()
{ 
    chrome.extension.sendRequest({ 'tags': tags });
}

setInterval(requestData, 60e3);
