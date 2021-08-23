exports.handler = function(context, event, callback) {

    const MonkeyLearn = require('monkeylearn');
    
    var Airtable = require('airtable');
    var base = new Airtable({apiKey: process.env.AIRTABLEKEY}).base(process.env.AIRTABLEBASE);

    var inboundmessage = event.body.toLowerCase();

    console.log(inboundmessage);

    const ml = new MonkeyLearn(process.env.MLKEY)
    let model_id = process.env.MLMODEL
    let data = [inboundmessage];

    ml.classifiers.classify(model_id, data).then(res => {

        console.log(res.body[0].classifications[0].tag_name);

        base('feedback').create([
            {
                "fields": {
                    "phonenumber": event.from,
                    "feedback": event.body,
                    "feedback_score" : [res.body[0].classifications[0].tag_name],
                    "store": event.store,
                    "campaign": event.campaign
                }
            }
            ], function(err, records) {
            if (err) {
                console.error(err);
                callback(null, err);
            }
            records.forEach(function (record) {
                
                var response = {};

                response.id = record.getId();
                response.sentiment = res.body[0].classifications[0].tag_name;

                callback(null, response);

            });
        });
    });

};