Changelog
=========

## v0.9.4(AUG 1, 2019)
 * Changed timeout time to handle the bad network.     
 
## v0.9.3(JUN 3, 2019)
 * Improved stability.   
 
## v0.9.2(MAY 3, 2019)
 * Improved stability.   
 * Added `setMediaDevice()` to change device such as microphone, speaker, or camera.  
 * Updated `VideoChatHandler`.  
   * Removed `onConnected()`.   
   * Added `onOpened()` to replace `onConnected()`.   
   * Added `onDropped()` to notify connection was gone.   
   * Added `onReopened()` to notify reconnected.   
 * Added `reconnect_timeout` on `EndType` in `VideoChatType`.   

## v0.9.1(MAR 30, 2019)
 * 0.9.1 release
