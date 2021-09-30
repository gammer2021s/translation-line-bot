// Get webhook from LINE messagingAPI
function doPost(e) {
    // LINE MessagingAPI Channel Token
    var LINE_CHANNEL_ACCESS_TOKEN_ID = '';
    // URL of 'reply' MessagingAPI
    var LINE_API_URL = 'https://api.line.me/v2/bot/message/reply';
    // Get reply token
    var reply_token = JSON.parse(e.postData.contents).events[0].replyToken;
    // If you don't get reply token
    if (typeof reply_token === 'undefined') {
        return;
    }
    // Is it English or Japanese
    var isJa = false;
    // Translated text
    var translatedText = '';
    // Get message from LINE user
    var user_message = JSON.parse(e.postData.contents).events[0].message.text;
    var reply_messages = '';

    // Check the text is Language
    isJa = user_message.match(/[^A-Za-z.,!?\s]/gi);

    // Translate method
    if (isJa) {
        translatedText = LanguageApp.translate(user_message, 'in', 'tch');
    }
    else {
        translatedText = LanguageApp.translate(user_message, 'tch', 'in');
    }
    reply_messages = translatedText;

    // POST the message by constructure of JSON
    var option = {
        'headers': {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN_ID,
        },
        'method': 'post',
        'payload': JSON.stringify({
            'replyToken': reply_token,
            'messages': [{
                'type': 'text',
                'text': reply_messages,
            }],
        }),
    };
    UrlFetchApp.fetch(LINE_API_URL, option);

    return ContentService.createTextOutput(JSON.stringify({ 'content': 'post ok' })).setMimeType(ContentService.MimeType.JSON);
}
