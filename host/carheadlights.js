var Leap = require('leapjs'),
    http = require('http'),
    toggle = 1;
var controller  = new Leap.Controller({enableGestures: true});

controller.on('deviceFrame', function(frame) {
  // loop through available gestures
  for(var i = 0; i < frame.gestures.length; i++){
    var gesture = frame.gestures[i];
    var type    = gesture.type;          

    switch( type ){

      case "circle":
        if (gesture.state == "stop") {
          console.log('circle');  
        }
        break;

      case "swipe":
        if (gesture.state == "stop") {
          console.log('swipe');
        }
        break;

      case "screenTap":
        if (gesture.state == "stop") {
          console.log('screenTap');

        }
        break;

      case "keyTap":
        if (gesture.state == "stop") {
          console.log('keyTap');
          if (toggle){
            var options = {
              host: '192.168.1.3',
              port: 3390,
              path: '/enabletorch'
            };

            http.get(options, function(resp){
              resp.on('data', function(chunk){
                //do something with chunk
              });
            }).on("error", function(e){
              console.log("Got error: " + e.message);
            });    
             toggle = 0;

          } else {
            var options = {
              host: '192.168.1.3',
              port: 3390,
              path: '/disabletorch'
            };
            http.get(options, function(resp){
              resp.on('data', function(chunk){
                //do something with chunk
              });
            }).on("error", function(e){
              console.log("Got error: " + e.message);
            });
            toggle = 1;
          }
        }
        break;

      }
    }
});

controller.connect();
