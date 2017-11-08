
Note: we need to turn on billing to use external API with Cloud Functions

curl example:

```
KEY=YOURKEYHERE
curl -H "Content-Type: application/json" -X POST -d '{"encodingType":"UTF8","document":{"type": "PLAIN_TEXT","content": "I ate a delicious breakfast."}}' https://language.googleapis.com/v1/documents:analyzeSyntax?key=$KEY
```


Build and deploy function
```
cd functions
firebase functions:config:set language.key=$KEY
firebase deploy --only functions
```

now we can call the http function from the command line
```
curl -G https://us-central1-syntax-graph.cloudfunctions.net/syntax --data-urlencode 'text=red book'
```