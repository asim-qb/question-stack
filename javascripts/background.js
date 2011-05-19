var db = window.localStorage;
var storage = 'questions';
var appid = 'igaghfhadhbopihianlkncjlglafkgaf';
var maxLength = 6;
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
    var url = 'http://api.stackoverflow.com/1.1/questions/unanswered?pagesize=6&tagged=' + (tags ? tags : '');
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

    // we want questions to be an array of question objects of length < maxLength
    questions = newQuestions.concat(questions).splice(0, maxLength);
    db.setItem(storage, JSON.stringify(questions));
    sendQuestions();
}

function sendQuestions()
{
    var questions = JSON.parse(db.getItem(storage));
    chrome.extension.sendRequest(appid, { 'questions': questions }, function() {});
}

function sendTags()
{ 
    chrome.extension.sendRequest(appid, { 'tags': tags }, function() {});
}

setInterval(requestData, 60e3);
