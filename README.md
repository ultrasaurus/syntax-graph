
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

which returns this:
```
{
  "sentences": [
    {
      "text": {
        "content": "red book",
        "beginOffset": 0
      }
    }
  ],
  "tokens": [
    {
      "text": {
        "content": "red",
        "beginOffset": 0
      },
      "partOfSpeech": {
        "tag": "ADJ",
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "PROPER_UNKNOWN",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "dependencyEdge": {
        "headTokenIndex": 1,
        "label": "AMOD"
      },
      "lemma": "red"
    },
    {
      "text": {
        "content": "book",
        "beginOffset": 4
      },
      "partOfSpeech": {
        "tag": "NOUN",
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "SINGULAR",
        "person": "PERSON_UNKNOWN",
        "proper": "PROPER_UNKNOWN",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "dependencyEdge": {
        "headTokenIndex": 1,
        "label": "ROOT"
      },
      "lemma": "book"
    }
  ],
  "language": "en"
}
```