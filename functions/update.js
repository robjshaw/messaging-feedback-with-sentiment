exports.handler = function(context, event, callback) {

    var Airtable = require('airtable');
    var base = new Airtable({apiKey: process.env.AIRTABLEKEY}).base(process.env.AIRTABLEBASE);

    base('feedback').update([
        {
          "id": event.id,
          "fields": {
            "feedback_reason": event.body
          }
        },
      ], function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
        
        var response = {};

        response.status = 'done'

        callback(null, response);
    });
}