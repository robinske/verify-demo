/**
 *  Start Verification
 *
 *  This Function shows you how to send a verification token for Twilio Verify.
 *
 *  Pre-requisites
 *  - Create a Verify Service (https://www.twilio.com/console/verify/services)
 *  - Add VERIFY_SERVICE_SID from above to your Environment Variables (https://www.twilio.com/console/functions/configure)
 *  - Enable ACCOUNT_SID and AUTH_TOKEN in your functions configuration (https://www.twilio.com/console/functions/configure)
 *
 *
 *  Returns JSON
 *  {
 *    "success": boolean
 *    "error": {                // not present if success is true
 *      "message": string,
 *      "moreInfo": url string
 *    }
 *  }
 */

exports.handler = function(context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader('Content-Type', 'application/json');
  
  // uncomment to support CORS
  // response.appendHeader('Access-Control-Allow-Origin', '*');
  // response.appendHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  // response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const client = context.getTwilioClient();
  const service = context.VERIFY_SERVICE_SID;
  const channel = (typeof event.channel === 'undefined') ? "sms" : event.channel;
  const to = (channel === 'email') ? event.email : event.phone_number;
  const language = (typeof event.language === 'undefined') ? "en" : event.language;

  console.log(channel);
  console.log(to);
  console.log(language);

  client.verify.services(service)
    .verifications
    .create({
      to: to,
      channel: channel,
      locale: language
    })
    .then(verification => {
      console.log(verification);
      response.setStatusCode(200);
      response.setBody({"success": true});
      callback(null, response);
    })
    .catch(error => {
      console.log(error);
      response.setStatusCode(error.status);
      response.setBody({
        "success": false,
        "error": {
          "message": error.message,
          "moreInfo": error.moreInfo
        } 
      })
      callback(null, response)
    })
};
