'use strict'

const request = require('request');

exports.sendErrorToSlack = function (error) {
    let errorText = {
        "text": error
    }
    request.post({
        headers: { 'content-type': 'application/json' },
        url: 'https://hooks.slack.com/services/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',
        body: JSON.stringify(errorText)
    }, function (err, res, body) {
        console.log(body);
    })
}