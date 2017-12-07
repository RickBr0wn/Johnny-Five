// REQUIRE all MODULES
const http = require('http');
const express = require('express');
const five = require('johnny-five');
const PubNub = require('pubnub');

// Create a BOARD instance from JOHNNY-FIVE
const board = new five.Board();

// Create an EXPRESS instance
const app = express();

// Specify PORT number
const port = 3000;

// Use the /PUBLIC DIRECTORY
app.use(express.static(__dirname + '/public'));

// Function for READY state of ARDUINO
board.on('ready', function(){
  // Create a new BUTTON instance
  let button = new five.Button(2);
  // Create a new LED instance
  let led = new five.Led(8);

  // Physical button PRESS logic
  button.on('press', function(){
    led.toggle();
  });

  // Begin LISTEN on the predetermined PORT number
  app.listen(port, function(){
    console.log('Listening on port: ' + port);
  });

  // Create an instance on PUBNUB 
  const pubnub = new PubNub({
    subscribeKey: "XXX",
    publishKey: "XXX"
  });

  // Specify the channel
  var channel = 'arduino_channel';

  // PUBNUB SUBSCRIBE - RECIEVE a MESSAGE and print
  pubnub.subscribe({
    channel: channel,
    message: function(m){
      console.log('** Message Recieved: ' + JSON.stringify(m));
    }
  });

}); // End of BOARD.ON 'READY' state

// ARDUINO ERROR handling
board.on('error', function(e){
  console.log('** Arduino Board error: ' + e);
});
