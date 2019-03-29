

[![npm](https://img.shields.io/npm/v/sendbird.svg?style=popout&colorB=red)](https://www.npmjs.com/package/sendbird-videochat)
[![Platform](https://img.shields.io/badge/language-JavaScript-yellow.svg)](https://github.com/smilefam/sendbird-videochat-javascript)
[![Commercial License](https://img.shields.io/badge/license-Commercial-brightgreen.svg)](https://github.com/smilefam/sendbird-videochat-javascript/blob/master/LICENSE.md)


# SendBird VideoChat

SendBird `VideoChat` is an add-on to your application that enables users to make video and audio chats. SendBird `VideoChat` is available through [WebRTC](https://webrtc.org/). 

Note: This is a beta version and is not yet open to all users. If you would like to try SendBird `VideoChat`, contact our sales support for more information. 

## Contents

- [Supported browsers](#supported-browswers)
- [Installation](#installation)
- [Restriction](#restriction)
- [Making video and audio calls](#making-video-and-audio-calls)
  - [`startCall()`](#startcall())
  - [Registering/unregistering an event handler](#registering/unregistering-an-event-handler)
  - [Timeout for `startCall()`](#timeout-for-startcall())
  - [Getting a `Call` instance](#getting-a-call-instance)
  - [Identifying the type of a message](#identifying-the-type-of-a-message)
- [Classes](#classes)
  - [`VideoChatHandler`](#videochathandler)
  - [`CallOptions`](#calloptions)
  - [`CallUser`](#calluser)
  - [`Call`](#call)
  - [`VideoChatException`](#videochatexception)
  - [`VideoChatType`](#videochattype)
- [Change Log](https://github.com/smilefam/sendbird-videochat-javascript/blob/master/CHANGELOG.md)
- [License](https://github.com/smilefam/sendbird-videochat-javascript/blob/master/LICENSE.md)


## Supported browsers

We recommend using the latest version of supported browsers for the best experience. [WebRTC](https://webrtc.org/) supports the following browsers:

- Chrome 56 and later 
- Firefox 44 and later
- Safari 11 and later


## Installation

Download and install the SendBird `VideoChat` package from [`npm`](https://www.npmjs.com/)

```
npm install sendbird-videochat
```

## Restrictions

There are a few restrictions that apply to the beta version of SendBird `VideoChat`.  

- It is only available in a `normal`, `private` group channel settings. (non-super and non-public)
- It only supports video and audio calls between two users.   
- To start video and audio calls, the two users must be connected to SendBird server.  
- In the same channel, you can't start a new, separate video or audio call.  

```javascript
// GroupChannel
channel.isGroupChannel() === true;

// Member Count
groupChannel.members.length === 2; 
groupChannel.memberCount === 2;

// non-super, non-public
groupChannel.isSuper === false;
groupChannel.isPublic === false;

// Connection
sendbird.currentUser != null;
sendbird.getConnectionState() !== 'CLOSED';
```

> Warning: Don't call the `removeAllChannelHandlers()` of SendBird JavaScript SDK. It will not only remove handlers already added, but also remove handlers managed by `SendBirdVideoChat`.  

## Initialization

You should instantiate `SendBirdVideoChat` after a SendBird instance is initialized. In this initialization process, you don't need to `connect()` a user to SendBird server. But make sure that a user should be connected to the server before the `startCall()` is called.   

```javascript
import SendBird from 'sendbird';
import SendBirdVideoChat from 'sendbird-videochat';

const sb = new SendBird({ appId: 'YOUR_APP_ID' });

SendBirdVideoChat.init({ sendBird: sb });
```

## Making video and audio calls

You can make video and audio calls between two users using the `SendBirdVideoChat`'s functions.   

### `startCall()`  

The `startCall()` sends a video or audio call request to SendBird server with specified options. This function requires the `isAudioCall` and `callOptions` parameters.   

- **isAudioCall**: determines whether to enable an audio only in the call or both a video and an audio. 
- **callOptions**: specifies the call settings with a `CallOptions` instance. For more information on the settings, see the [CallOptions](#-CallOptions). 

```javascript
import SendBirdVideoChat from 'sendbird-videochat';

const isAudioCall = false;
const callOptions = new SendBirdVideoChat.CallOptions({ channelUrl: 'TARGET_CHANNEL_URL' });
SendBirdVideoChat.startCall(isAudioCall, callOptions)
.then(call => { /* do something... */ })
.catch(e => { /* do something... */ });

//// If you want to implement with a callback
//SendBirdVideoChat.startCall(isAudioCall, callOptions, (err, call) => {
//  /* do something... */
//});
```

If the server accepts the request and notify a callee of it, a caller receives a success callback through the `VideoChatHandler`'s `onStartSent()`. And the callee also receives a notification about the request through the `VideoChatHandler`'s `onStartReceived()`.  

### Registering/unregistering an event handler

Like the SendBird SDKs, the `SendBirdVideoChat` has its own event handler. The `VideoChatHandler` supports various methods which receive events callbacks from SendBird server. You can create, register, and implement the handler in your application. Then your application will be notified of events happening in video and audio calls. 

```javascript
import SendBirdVideoChat from 'sendbird-videochat';

const videoChatHandler = new SendBirdVideoChat.VideoChatHandler();
videoChatHandler.onStartReceived = (call) => {
/* do something... */
};
SendBirdVideoChat.addVideoChatHandler('IDENTIFIER', videoChatHandler);

// If you unregister VideoChatHandler, use as follows.  
// SendBirdVideoChat.removeVideoChatHandler('IDENTIFIER');
// SendBirdVideoChat.removeAllVideoChatHandlers();
```

### Timeout for `startCall()`

If a callee doesn't respond to a call request from a caller during 30 seconds (by default), the `SendBirdVideoChat` automatically closes the call. A timeout value can be set between 30 and 60 seconds.  

```javascript
import SendBirdVideoChat from 'sendbird-videochat';

SendBirdVideoChat.setStartCallTimeout(40);
const setTime = SendBirdVideoChat.getStartCallTimeout();
```

### Getting a `Call` instance  

The `SendBirdVideoChat` provides a `Call` class which has its own properties and methods that represent a specific video or audio call. For more information on the object, see the [`Call`](#-Call). 
With the following, you can create and retrieve a `Call` instance.  

- **getActiveCall()**: retrieves the current `Call` instance in progress.  
- **getCall()**: retrieves the `Call` instance by a passed call ID.  
- **buildCall()**: with a passed `UserMessage` object which requests a video or audio call, creates and returns a new `Call` instance.  

```javascript
import SendBirdVideoChat from 'sendbird-videochat';

const activeCall = SendBirdVideoChat.getActiveCall();
const call = SendBirdVideoChat.getCall('CALL_ID');
const buildCall = SendBirdVideoChat.buildCall(userMessage); 
```

#### Identifying the type of a message

Using the `getRenderingMessageType()`, you can identify the type of a passed message and determine how to render your chat view based on the message. The method returns one of the following four values:  

- **chat**: returned if a message is one of `UserMessage`, `FileMessage`, and `AdminMessage` as the SendBird SDK's `BaseMessage`.    
- **start**: the call request message.   
- **end**: the call close message.   
- **not_render**: a message that does not need to be rendered on the chat view.  

```javascript
import SendBirdVideoChat from 'sendbird-videochat';

const renderingType = SendBirdVideoChat.getRenderingMessageType(message);
``` 

## Classes

### `VideoChatHandler`   

The `VideoChatHandler` supports various methods which receive events callbacks from SendBird server. If the handler is registered and implemented in your application, events happening in video and audio calls are notified to the application through the methods.
The following are provided with the `VideoChatHandler`:

1. **onStartSent(call, message)**
- Called when a caller's video or audio call request is successfully accepted by SendBird server from the `startCall()`. (At the caller's application) 
- **call**: a `Call` instance which contains the current call status.  
- **message**: a `UserMessage` instance which contains the text sent with the call request.  
2. **onStartReceived(call)**
- Called when a callee receives a video or audio call request. (At the callee's application)  
- **call**: a `Call` instance which contains the current call status.  
3. **onAcceptSent(call)**
- Called when a callee has accepted a video or audio call request using the `accept()` and SendBird server confirms the acceptance. (At the callee's application)      
- **call**: a `Call` instance which contains the current call status.  
4. **onAcceptReceived(call)**
- Called when TURN server starts a video or audio call delivery between a caller and callee. (At the caller's application)    
- **call**: a `Call` instance which contains the current call status.  
5. **onEndSent(call, message)**
- Called when a call close request has been sent to SendBird server using the `end()` and the server successfully accepts the request. (At the application which sent the close request)  
- **call**: a `Call` instance which contains the current call status.  
- **message**: a `UserMessage` instance which contains the text sent with the call close request.  
6. **onEndReceived(call)**
- Called when a call has been closed from the opponent's request. (At the application which receives the close request)    
- **call**: a `Call` instance which contains the current call status.  
7. **onConnected(call)**
- Called when caller and callee are connected via SendBird server and can communicate with each other. (at both applications)   
- **call**: a `Call` instance which contains the current call status.  
8. **onOpponentAudioStateChanged(call)**
- Called when the audio state of either a caller or callee has been changed. (Notifies the opposite application)    
- **call**: a `Call` instance which contains the current call status.  
9. **onOpponentVideoStateChanged(call)**
- Called when the video state of either a caller or callee has been changed. (Notifies the opposite application) 
- **call**: a `Call` instance which contains the current call status.  

```javascript
import SendBirdVideoChat from 'sendbird-videochat';

const videoChatHandler = new SendBirdVideoChat.VideoChatHandler();
videoChatHandler.onStartSent = (call, userMessage) => {
/* do something... */
};
videoChatHandler.onStartReceived = (call) => {
/* do something... */
};
videoChatHandler.onAcceptSent = (call) => {
/* do something... */
};
videoChatHandler.onAcceptReceived = (call) => {
/* do something... */
};
videoChatHandler.onEndSent = (call, userMessage) => {
/* do something... */
};
videoChatHandler.onEndReceived = (call) => {
/* do something... */
};
videoChatHandler.onConnected = (call) => {
/* do something... */
};
videoChatHandler.onOpponentAudioStateChanged = (call) => {
/* do something... */
};
videoChatHandler.onOpponentVideoStateChanged = (call) => {
/* do something... */
};
SendBirdVideoChat.addVideoChatHandler('IDENTIFIER', videoChatHandler);
```

### CallOptions  
The `CallOptions` is a class that users use to request calls with the `startCall()` or to accept calls with the `accept()`. The items of `CallOptions` are:

- **channelUrl** (required): specifies the URL of the channel to send a call request.   
- **localVideoElement**: specifies the `HTMLVideoElement` to render the `Caller`'s chat view.  
- **remoteVideoElement**: specifies the `HTMLVideoElement` to render the `Callee`'s chat view.  
- **isAudioEnabled**: determines whether to use audio in the `Call`.     
- **isVideoEnabled**: determines whether to use video in the `Call`. This value is only accepted in a video call.                 
- **videoWidth**: specifies the width of the video. This value is only meaningful in a video call.      
- **videoHeight**: specifies the height of the video. This value is only meaningful in a video call.      
- **videoFPS**: specifies the frame rate of the video. This value is only meaningful in a video call.      

```javascript
import SendBirdVideoChat from 'sendbird-videochat';

const callOptions = new SendBirdVideoChat.CallOptions({
channelUrl: 'TARGET_CHANNEL_URL',
localVideoElement: document.getElementById('YOUR_LOCAL_VIDEO_ELEMENT'),
remoteVideoElement: document.getElementById('YOUR_REMOTE_VIDEO_ELEMENT'),
isAudioEnabled: true,
isVideoEnabled: true,
videoWidth: 1024,
videoHeight: 720,
videoFPS: 30,
})
```

### CallUser  

`CallUser` can be identified as a `Caller` or `Callee`. The `Caller` is the one who requests a call and the `Callee` is the one who receives a call request.   

- **userId**: user ID of the `Caller` or `Callee`.  
- **nickname**: nickname of the `Caller` or `Callee`.  
- **profileUrl**: profile URL of the `Caller` or `Callee`.  
- **isAudioEnabled**: determines whether the `Caller` or `Callee` is using audio.  
- **isVideoEnabled**: determines whether the `Caller` or `Callee` is using video.  


### Call  
Through a `Call` instance, you can make actions of a video or audio call. It also contains up-to-date information of the call.  

- **callId**: unique ID that distinguishes each call.  
- **channelUrl**: the URL of the channel of your video or audio call.  
- **messageId**: contains information about the `Call`.  
- **isAudioCall**: determines whether the `Call` is an audio call.  
- **caller**: information of the `Caller`, the one who makes the call.  
- **callee**: information of the `Callee`, the one who receives the call.  
- **state**: specifies the status of the `Call` which are identified as `none`, `connecting`, `connected`, and `disconnected`.    
- **ender**: information of the `Caller` or `Callee`, the one who ends the call.   
- **endType**: specifies that the `Call` has ended. This has one of the following values.   
- **none**: it's not ended yet.  
- **cancel**: the `end()`called by the `Caller` before `Callee` accepts the `Call`.   
- **decline**: the `end()` called by the `Callee` without accepting the `Call`.  
- **end**: a `Caller` or `Callee` ended the video or audio call after the connection.   
- **timeout**: the `Call` was closed when a `Callee` didn't respond to a call request. 
- **unknown**: the `Call` was closed for unknown reasons.   
- **period**: specifies the length of time in unix timestamp for `Call`.    
- **myRole**: specifies the role on the `Call` as a `Caller` or `Callee`.
- **accept()**: the `Callee` accepts the `Call`.    
- **end()**: close the `Call`.    
- **startVideo()**: calls the `onOpponentVideoStateChanged()` handler that you registered to start video streaming on the `Call`.       
- **stopVideo()**: calls the `onOpponentVideoStateChanged()` handler that you registered to stop video streaming on the `Call`.     
- **muteMicrophone()**: calls the `onOpponentAudioStateChanged()` handler that you registered to start audio streaming on the `Call`.      
- **unmuteMicrophone()**: calls the `onOpponentAudioStateChanged()` handler that you registered to stop audio streaming on the `Call`.      

```javascript
import SendBirdVideoChat from 'sendbird-videochat';

const videoChatHandler = new SendBirdVideoChat.VideoChatHandler();
videoChatHandler.onStartSent = (call, message) => {
// Cancel
call.end().then(call => { /* do something */ }).catch(e => { /* do something */ });
};
videoChatHandler.onStartReceived = (call) => {
// Decline
call.end().then(call => { /* do something */ }).catch(e => { /* do something */ });
};
videoChatHandler.onConnected = (call) => {
// End
call.end().then(call => { /* do something */ }).catch(e => { /* do something */ });
};
videoChatHandler.onOpponentVideoStateChanged = (call) => {
/* do something */
};
videoChatHandler.onOpponentAudioStateChanged = (call) => {
/* do something */
};
SendBirdVideoChat.addVideoChatHandler('IDENTIFIER', videoChatHandler);

const call = SendBirdVideoChat.getActiveCall();
call.startVideo();
call.stopVideo();
call.muteMicrophone();
call.unmuteMicrophone();
```

### VideoChatException  

The `VideoChatException` is returned in the event of an error in `SendBirdVideoChat`.  

- **ErrorCode**: indicates an error code that can be occurred. 
- **code**: indicates the six-digit integer code of an occurred error.  
- **message**: indicates the message of an occurred error. 


| Key                          | Code   |
|------------------------------|--------|
| UNKNOWN                      | 820000 |
| SENDBIRD_CONNECTION_REQUIRED | 820100 |
| SENDBIRD_REQUIRED            | 820130 |
| INVALID_ACTION               | 820200 |
| ACCEPTING_FAIL               | 820300 |
| INVALID_PARAMETER            | 820400 |
| UNSUITABLE_CHANNEL           | 820401 |
| CALL_ON_GOING                | 900600 |

```javascript
import SendBirdVideoChat from 'sendbird-videochat';

console.log(SendBirdVideoChat.VideoChatException.ErrorCode);
```

### VideoChatType  
The `VideoChatType` is determined by three different types of `SendBirdVideoChat`.  

| Type                 | Key        | Value      |
|----------------------|------------|------------|
| RenderingMessageType | CHAT       | chat       |
|                      | START      | start      |
|                      | END        | end        |
|                      | NOT_RENDER | not_render |
| EndType              | NONE       | none       |
|                      | END        | end        |
|                      | DECLINE    | decline    |
|                      | CANCEL     | cancel     |
|                      | TIMEOUT    | timeout    |
|                      | UNKNOWN    | unknown    |
| Role                 | NONE       | none       |
|                      | CALLER     | caller     |
|                      | CALLEE     | callee     |

```javascript
import SendBirdVideoChat from 'sendbird-videochat';

console.log(SendBirdVideoChat.VideoChatType.RenderingMessageType);
console.log(SendBirdVideoChat.VideoChatType.EndType);
console.log(SendBirdVideoChat.VideoChatType.Role);
```

## [Change Log](https://github.com/smilefam/sendbird-videochat-javascript/blob/master/CHANGELOG.md)    

## [License](https://github.com/smilefam/sendbird-videochat-javascript/blob/master/LICENSE.md)  
