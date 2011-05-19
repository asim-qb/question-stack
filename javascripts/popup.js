// request questions array

var appid = 'igaghfhadhbopihianlkncjlglafkgaf';

chrome.extension.sendRequest(appid, { 'initialize': true }, function() {});

chrome.extension.onRequest.addListener(function(request) { 
    if (request.questions) {
        displayQuestions(request.questions); 
    }
    if (request.tags) {
        $('.currentTags').html(request.tags);
    }
});

// handle filter tags

$('.settings').submit(function() {
    chrome.extension.sendRequest(appid, { 'tags': $('input', this).val() }, function() {});
    $('input', this).val('');
    return false;
});

// display and format each question

function displayQuestions(questions)
{
    var i, j, question, template;
    var stackoverflow = 'http://stackoverflow.com';

    for (i = 0; i < questions.length; i++) {
        question = questions[i];
        template = $('#template').clone();
        template.removeAttr('id');
        $('.title', template).html(question.title).attr('href', stackoverflow + question.question_answers_url);
        $('.user a', template).html(question.owner.display_name).attr('href', stackoverflow + '/users/' + question.owner.user_id + '/' + question.owner.display_name);
        $('.user .karma', template).html(question.owner.reputation);
        $('.votes', template).html(question.score + ' vote' + pluralize(question.score));
        $('.answers', template).html(question.answer_count + ' answer' + pluralize(question.answer_count));
        $('.views', template).html(question.view_count + ' view' + pluralize(question.view_count));
        for (j = 0; j < question.tags.length && j < 3; j++) {
            $('.tags', template).append('<a target="blank" href="' + stackoverflow + '/questions/tagged/' + question.tags[j] + '">' + question.tags[j] + '</a>');
        }
        $('#container').prepend(template);
    }
}

function pluralize(count)
{
    return (parseInt(count) === 1 ? '' : 's');
}

