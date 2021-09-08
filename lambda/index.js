/* *
 * This sample demonstrates handling intents for an Alexa skill implementing the AudioPlayer interface using the Alexa Skills Kit SDK (v2).
 * This sample works using the default DynamoDB table associated with an Alexa-hosted skill - you will need to use this with a hosted skill,
 * or you use your own DynamoDB table in the request and response interceptors.
 * Please visit https://github.com/alexa-samples for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const AWS = require('aws-sdk');
const ddbAdapter = require('ask-sdk-dynamodb-persistence-adapter');
const Util = require('./util.js');
const STREAMS = [
  {
    'token': 'maruti-stotra-1',
    'url': 'https://marutistotra.s3.ap-south-1.amazonaws.com/maruti-stotra.mp3',
    'metadata': {
      'title': 'मारुती स्तोत्र',
      'subtitle': 'भीमरूपी महारुद्रा, वज्रहनुमान मारुती | वनारी अंजनीसूता रामदूता प्रभंजना',
      'art': {
        'sources': [
          {
            'contentDescription': 'मारुती स्तोत्र',
            'url': 'https://marutistotra.s3.ap-south-1.amazonaws.com/MarutiStotra512.png',
            'widthPixels': 512,
            'heightPixels': 512,
          },
        ],
      },
      'backgroundImage': {
        'sources': [
          {
            'contentDescription': 'मारुती स्तोत्र',
            'url': 'https://marutistotra.s3.ap-south-1.amazonaws.com/MarutiStotra1200x800.png',
            'widthPixels': 1200,
            'heightPixels': 800,
          },
        ],
      },
    },
  },
];

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const playbackInfo = await getPlaybackInfo(handlerInput);

        //var speakOutput = 'रिधिमा सगदेव द्वारा प्रस्तुत, मारुती स्तोत्र';
        var speakOutput = '';
        const playBehavior = 'REPLACE_ALL';
        const podcastUrl = STREAMS[0].url;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addAudioPlayerPlayDirective(
                playBehavior,
                podcastUrl,
                STREAMS[0].token,
                0,
                null,
                STREAMS[0].metadata)
            .getResponse();
    }
};

/**
 * Intent handler to start playing an audio file.
 * By default, it will play a specific audio stream.
 * */
const PlayAudioIntentHandler = {
    canHandle(handlerInput) {
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' )
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlayAudioIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.ResumeIntent');
    },
    async handle(handlerInput) {
        const playbackInfo = await getPlaybackInfo(handlerInput);

        var speakOutput = 'रिधिमा सगदेव द्वारा प्रस्तुत, मारुती स्तोत्र';
        
        const playBehavior = 'REPLACE_ALL';
        const podcastUrl = STREAMS[0].url;
        
        if(playbackInfo.offsetInMilliseconds > 0) { speakOutput = ""; }
        /**
         * If your audio file is located on the S3 bucket in a hosted skill, you can use the line below to retrieve a presigned URL for the audio file.
         * https://developer.amazon.com/docs/alexa/hosted-skills/alexa-hosted-skills-media-files.html
         * 
         * const podcastUrl = Util.getS3PreSignedUrl("Media/audio.mp3").replace(/&/g,'&amp;');
         * 
         * If you cannot play your own audio in place of the sample URL, make sure your audio file adheres to the guidelines:
         * https://developer.amazon.com/docs/alexa/custom-skills/audioplayer-interface-reference.html#audio-stream-requirements
        */

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addAudioPlayerPlayDirective(
                playBehavior,
                podcastUrl,
                STREAMS[0].token,
                playbackInfo.offsetInMilliseconds,
                null,
                STREAMS[0].metadata)
            .getResponse();
    }
};

/**
 * Intent handler to start playing an audio file.
 * By default, it will play a specific audio stream.
 * */
const PauseAudioIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.PauseIntent';
    },
    async handle(handlerInput) {
        return handlerInput.responseBuilder
            .addAudioPlayerStopDirective()
            .getResponse();
    }
};
/**
 * Intent handler for built-in intents that aren't supported in this sample skill.
 * As this is a sample skill for a single stream, these intents are irrelevant to this skill.
 * Regardless, the skill needs to handle this gracefully, which is why this handler exists.
 * */
const UnsupportedAudioIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.LoopOffIntent'
                    || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.LoopOnIntent'
                    || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NextIntent'
                    || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.PreviousIntent'
                    || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.RepeatIntent'
                    || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.ShuffleOffIntent'
                    || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.ShuffleOnIntent'
                    || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StartOverIntent'
                );
    },
    async handle(handlerInput) {
        //const speakOutput = 'Kshamaa karaa, mee he ajoon support karat naahi.';
        const speakOutput = 'क्षमा कीजिए, मैं अभी यह support नहीं करती।';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'आप बोल सकते हो, अलेक्सा, open मारुती स्तोत्र। आप क्या करना चाहते है?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        //const speakOutput = 'Jai Hanumaan!';
        const speakOutput = 'जय हनुमान।';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addAudioPlayerStopDirective()
            .getResponse();
    }
};
/* *
 * AudioPlayer events can be triggered when users interact with your audio playback, such as stopping and 
 * starting the audio, as well as when playback is about to finish playing or playback fails.
 * This handler will save the appropriate details for each event and log the details of the exception,
 * which can help troubleshoot issues with audio playback.
 * */
const AudioPlayerEventHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type.startsWith('AudioPlayer.');
  },
  async handle(handlerInput) {
    const playbackInfo = await getPlaybackInfo(handlerInput);
    
    const audioPlayerEventName = handlerInput.requestEnvelope.request.type.split('.')[1];
    console.log(`AudioPlayer event encountered: ${handlerInput.requestEnvelope.request.type}`);
    let returnResponseFlag = false;
    switch (audioPlayerEventName) {
      case 'PlaybackStarted':
        playbackInfo.token = handlerInput.requestEnvelope.request.token;
        if(playbackInfo.token === null) {playbackInfo.token =  STREAMS[0].token;}
        playbackInfo.inPlaybackSession = true;
        playbackInfo.hasPreviousPlaybackSession = true;
        returnResponseFlag = true;
        break;
      case 'PlaybackFinished':
        playbackInfo.inPlaybackSession = false;
        playbackInfo.hasPreviousPlaybackSession = false;
        playbackInfo.nextStreamEnqueued = false;
        returnResponseFlag = true;
        break;
      case 'PlaybackStopped':
        playbackInfo.token = handlerInput.requestEnvelope.request.token;
        if(playbackInfo.token === null) {playbackInfo.token =  STREAMS[0].token;}
        playbackInfo.inPlaybackSession = true;
        playbackInfo.offsetInMilliseconds = handlerInput.requestEnvelope.request.offsetInMilliseconds;
        break;
      case 'PlaybackNearlyFinished':
        break;
      case 'PlaybackFailed':
        playbackInfo.inPlaybackSession = false;
        console.log('Playback Failed : %j', handlerInput.requestEnvelope.request.error);
        break;
      default:
        break;
    }
    setPlaybackInfo(handlerInput, playbackInfo);
    return handlerInput.responseBuilder.getResponse();
  },
};


/* *
 * PlaybackController events can be triggered when users interact with the audio controls on a device screen.
 * starting the audio, as well as when playback is about to finish playing or playback fails.
 * This handler will save the appropriate details for each event and log the details of the exception,
 * which can help troubleshoot issues with audio playback.
 * */
const PlaybackControllerHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type.startsWith('PlaybackController.');
  },
  async handle(handlerInput) {
    const playbackInfo = await getPlaybackInfo(handlerInput);
    const playBehavior = 'REPLACE_ALL';
    const podcastUrl = STREAMS[0].url;
    const playbackControllerEventName = handlerInput.requestEnvelope.request.type.split('.')[1];
    let response;
            
    switch (playbackControllerEventName) {
      case 'PlayCommandIssued':
        response = handlerInput.responseBuilder
            .addAudioPlayerPlayDirective(
                playBehavior,
                podcastUrl,
                STREAMS[0].token,
                playbackInfo.offsetInMilliseconds,
                null,
                STREAMS[0].metadata)
            .getResponse();
        break;
      case 'PauseCommandIssued':
        response = handlerInput.responseBuilder
            .addAudioPlayerStopDirective()
            .getResponse();
        break;
      default:
        break;
    }
    setPlaybackInfo(handlerInput, playbackInfo);

    console.log(`PlayCommandIssued event encountered: ${handlerInput.requestEnvelope.request.type}`);
    return response;
  },
};
/* *
 * SystemExceptions can be triggered if there is a problem with the audio that is trying to be played.
 * This handler will log the details of the exception and can help troubleshoot issues with audio playback.
 * */
const SystemExceptionHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'System.ExceptionEncountered';
  },
  handle(handlerInput) {
    console.log(`System exception encountered: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
  },
};

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        //const speakOutput = 'Kshamaa karaa, malaa ya baddal mahit naahi. Krupayaa punha prayatna karaa';
        const speakOutput = 'क्षमा कीजिए, मुझे इसके बारेमे पता नहीं, कृपया फिर से प्रयास कीजिए।';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `आपने अभी बोला  ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        //const speakOutput = 'Kshamaa karaa, kaahi tari problem zalaa aahe. Tumhala punha prayatna karaayacha aahe?';
        const speakOutput = 'क्षमा कीजिए, कुछ गड़बड़ी हुई है। क्या आप फिर से प्रयास करना चाहते है?';
        
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse(); 
    }
};

/* HELPER FUNCTIONS */

async function getPlaybackInfo(handlerInput) {
  const attributes = await handlerInput.attributesManager.getPersistentAttributes();
  return attributes.playbackInfo;
}

async function setPlaybackInfo(handlerInput, playbackInfoObject) {
  await handlerInput.attributesManager.setPersistentAttributes({
      playbackInfo: playbackInfoObject
      });
}

// Request and response interceptors using the DynamoDB table associated with Alexa-hosted skills

const LoadPersistentAttributesRequestInterceptor = {
  async process(handlerInput) {
    const persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();

    /**
     * Check if user is invoking the skill the first time and initialize preset values
        playbackInfo: {
              offsetInMilliseconds - this is used to set the offset of the audio file 
                        to save the position between sessions
              token - save an audio token for this play session
              inPlaybackSession - used to record the playback state of the session
              hasPreviousPlaybackSession - used to help confirm previous playback state
            }
    */
    if (Object.keys(persistentAttributes).length === 0) {
      handlerInput.attributesManager.setPersistentAttributes({
        playbackInfo: {
          offsetInMilliseconds: 0,
          token: STREAMS[0].token,
          inPlaybackSession: false,
          hasPreviousPlaybackSession: false,
        },
      });
    }
  },
};

const SavePersistentAttributesResponseInterceptor = {
  async process(handlerInput) {
    await handlerInput.attributesManager.savePersistentAttributes();
  },
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        PlayAudioIntentHandler,
        PauseAudioIntentHandler,
        UnsupportedAudioIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        AudioPlayerEventHandler,
        PlaybackControllerHandler,
        SystemExceptionHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(LoadPersistentAttributesRequestInterceptor)
    .addResponseInterceptors(SavePersistentAttributesResponseInterceptor)
    .withCustomUserAgent('sample/audioplayer-nodejs/v2.0')
    .withPersistenceAdapter(
        new ddbAdapter.DynamoDbPersistenceAdapter({
            tableName: process.env.DYNAMODB_PERSISTENCE_TABLE_NAME,
            createTable: false,
            dynamoDBClient: new AWS.DynamoDB({apiVersion: 'latest', region: process.env.DYNAMODB_PERSISTENCE_REGION})
        })
    )
    .lambda();
