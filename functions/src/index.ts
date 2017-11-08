import * as functions from 'firebase-functions'

// if you need to use the Firebase Admin SDK, uncomment the following:
import * as admin from 'firebase-admin'
import * as requestPromise from 'request-promise'

// Create and Deploy Cloud Function with TypeScript using script that is
// defined in functions/package.json:
//    cd functions
//    npm run deploy
admin.initializeApp(functions.config().firebase);
const LANGUAGE_API_KEY = functions.config().language.key;


export let syntax = functions.https.onRequest((request, response) => {
  const text = request.query.text || "I ate a delicious breakfast.";
  console.log('text:', text);
  return requestPromise({
    method: 'POST',
    uri: `https://language.googleapis.com/v1/documents:analyzeSyntax?key=${LANGUAGE_API_KEY}`,
    body: {
      "encodingType":"UTF8",
      "document":{
        "type": "PLAIN_TEXT",
        "content": text
      }
    },
    json: true
  }).then((result) => {
    console.log('result:', result);
    response.send(result);
  })
});
