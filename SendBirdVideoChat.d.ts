import * as SendBird from 'sendbird';
type UserMessage = SendBird.UserMessage;

export = SendBirdVideoChat;
export as namespace SendBirdVideoChat;

declare const SendBirdVideoChat: SendBirdVideoChatStatic;

interface SendBirdVideoChatStatic {
  VideoChatHandler: VideoChatHandler;
  CallOptions: CallOptions;
  VideoChatException: VideoChatException;
  VideoChatType: VideoChatType;

  VERSION: string;
  sendBird: SendBird.SendBirdInstance | null;

  init(options: SendBirdVideoChatInitOptions): void;

  startCall(isAudioCall: boolean, callOptions: CallOptions, callbackFn: responseCallback): void;
  startCall(isAudioCall: boolean, callOptions: CallOptions): Promise<Call>;

  buildCall(message: UserMessage): Call | null;
  getCall(callId: string): Call | null;
  getActiveCall(): Call | null;

  setStartCallTimeout(sec: number): void;
  getStartCallTimeout(): number;

  getRenderingMessageType(message: UserMessage): RenderingMessageType;

  addVideoChatHandler(identifier: string, handler: VideoChatHandler): void;
  removeVideoChatHandler(identifier: string): void;
  removeAllVideoChatHandlers(): void;
}

interface CallUser {
  readonly userId: string;
  nickname: string;
  profileUrl: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
}

interface Call {
  readonly callId: string;
  readonly channelUrl: string;
  readonly messageId: string;
  caller: CallUser;
  callee: CallUser;
  isAudioCall: boolean;
  ender: CallUser;
  endType: EndType;
  period: number;
  readonly myRole: RoleType;

  accept(callOptions: CallOptions, callbackFn: responseCallback): void;
  accept(callOptions: CallOptions): Promise<Call>;
  end(callbackFn: responseCallback): void;
  end(): Promise<Call>;

  startVideo(): void;
  stopVideo(): void;
  muteMicrophone(): void;
  unmuteMicrophone(): void;
  setMediaDevice(deviceId: string, callbackFn: errorResponseCallback): void;
  setMediaDevice(deviceId: string): Promise<void>;
}

interface CallOptions {
  channelUrl: string;
  localVideoElement: HTMLVideoElement | null;
  remoteVideoElement: HTMLVideoElement | null;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  videoWidth: number;
  videoHeight: number;
  videoFPS: number;
  getConstraints(isAudioCall: boolean): ConstraintsType;
}
declare var CallOptions: {
  prototype: CallOptions;
  new (options: CallOptionsConstructorOptions): CallOptions;
};
interface CallOptionsConstructorOptions {
  channelUrl: string;
  localVideoElement: HTMLVideoElement | null;
  remoteVideoElement: HTMLVideoElement | null;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  videoWidth: number;
  videoHeight: number;
  videoFPS: number;
}

interface VideoChatHandler {
  onStartSent: (call: Call, message: UserMessage) => any | null;
  onStartReceived: (call: Call) => any | null;
  onAcceptSent: (call: Call) => any | null;
  onAcceptReceived: (call: Call) => any | null;
  onEndSent: (call: Call, message: UserMessage | null) => any | null;
  onEndReceived: (call: Call) => any | null;
  onOpened: (call: Call) => any | null;
  onDropped: (call: Call) => any | null;
  onReopened: (call: Call) => any | null;
  onOpponentAudioStateChanged: (call: Call) => any | null;
  onOpponentVideoStateChanged: (call: Call) => any | null;
}
declare var VideoChatHandler: {
  prototype: VideoChatHandler;
  new (): VideoChatHandler;
};

interface VideoChatException extends Error {
  name: 'VideoChatException';
  message: string;
  code: number;
  ErrorCode: ErrorCodeType;
}

interface VideoChatType {
  RenderingMessageType: {
    CHAT: 'chat';
    START: 'start';
    END: 'end';
    NOT_RENDER: 'not_render';
  };
  EndType: {
    NONE: 'none';
    END: 'end';
    DECLINE: 'decline';
    CANCEL: 'cancel';
    TIMEOUT: 'timeout';
    RECONNECT_TIMEOUT: 'reconnect_timeout';
    UNKNOWN: 'unknown';
  };
  Role: {
    NONE: 'none';
    CALLER: 'caller';
    CALLEE: 'callee';
  };
}

type SendBirdVideoChatInitOptions = { sendBird: SendBird.SendBirdInstance };
type responseCallback = (error: VideoChatException, call: Call | null) => void;
type errorResponseCallback = (error: VideoChatException) => void;
type ConstraintsType = { audio: boolean; video: boolean | ConstraintsVideoType };
type ConstraintsVideoType =
  | { width: number }
  | { height: number }
  | { frameRate: { ideal: number } }
  | { width: number; height: number }
  | { width: number; frameRate: { ideal: number } }
  | { height: number; frameRate: { ideal: number } }
  | { width: number; height: number; frameRate: { ideal: number } };
type EndType = 'none' | 'end' | 'decline' | 'cancel' | 'timeout' | 'reconnect_timeout' | 'unknown';
type RoleType = 'none' | 'caller' | 'callee';
type RenderingMessageType = 'chat' | 'start' | 'end' | 'not_render';
type ErrorCodeType = {
  UNKNOWN: 820000;
  SENDBIRD_CONNECTION_REQUIRED: 820100;
  SENDBIRD_REQUIRED: 820130;
  INVALID_ACTION: 820200;
  ACCEPTING_FAIL: 820300;
  INVALID_PARAMETER: 820400;
  UNSUITABLE_CHANNEL: 820401;
  CALL_ON_GOING: 900600;
};
