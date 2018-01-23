//Importing Library
var webSocket = require('ws'), 							// WebSocket Library
    ws = new webSocket('ws://192.168.1.4:6437/'),	//Built In Leapmotion WebSocket Server (JSON FRAME DATA)
    five = require('johnny-five'),						// Johnny-Five Library
    board = new five.Board(),							// Instantiation of the Arduino Board
    frame;												// Variable for Frame Data 
var controller = process.argv[2] || "GP2Y0A02YK0F";

//----------Arduino Board Start ----------//
board.on('ready', function() {							

	//Instantiate Pins to Control Movement
    forward = new five.Pin(12);
    backward = new five.Pin(8);
    right = new five.Pin(7);
    left = new five.Pin(4);

    // PROXIMITY COMPONENT INSTNATIATION
    var proximity = new five.IR.Proximity({
        controller: controller,
        pin: "A0"
    });

    closerange = 1;

    // Working on SERVO CODE
    var servo = new five.Servo({
        id: "MyServo",     			// User defined id
        pin: 10,           			// Which pin is it attached to?
        type: "standard",  			// Default: "standard". Use "continuous" for continuous rotation servos
        range: [0,180],    			// Default: 0-180
        fps: 100,          			// Used to calculate rate of movement between positions
        startAt: 90,       			// Immediately move to a degree
        center: true,      			// overrides startAt if true and moves the servo to the center of the range
        specs: {           			// Is it running at 5V or 3.3V?
          speed: five.Servo.Continuous.speeds["@3.3V"]
        }
    });


    proximity.on("data", function() {
        // console.log("inches: ", this.inches);
        //console.log("cm: ", this.cm);
        if (this.cm > 100){
            console.log("NOT CLOSE! cm: ", this.cm);
            closerange = 0;
        } else {
            closerange = 1;
            console.log("TOO CLOSE! cm: ", this.cm);
        }
    });


    // MOVEMENT LOGIC
    ws.on('message', function(data, flags) {

        frame = JSON.parse(data); 	// Parse JSON FRAME DATA

        hand = frame.hands[0];		//DETECT HAND from FRAME DATA

        if (hand) {
            //var hand = frame.hands[0];
            sphereRadius = Math.round(hand.sphereRadius); //Used for Dual Modes
            //current possition for x,z
            x = (hand.palmPosition[0].toFixed(1));
            z = (hand.palmPosition[2].toFixed(1));

            x = Math.round(x);
            z = Math.round(z);

            //LOGIC TO CHANGE BETWEEN MODES
            if(parseInt(sphereRadius)<40){
                //console.log(">> SERVO CONTROL ============================= " + x);
               if( x >=0 && x < 180 ) {
					 servo.to(x);
				}
            } else {

	            //Steer Right
	            if(x >= 75){
	                right.high();
	                backward.low();
	                forward.low();
	                left.low();
	                //console.log(">> RIGHT");	
	                //Steer Right & Back
	                if(z >= 75){
                        if (closerange==1){
                            right.low();
                            backward.low();
                            forward.low();
                            left.low();     
                            //console.log(">> BACKWARD STOPPED");
                        }
                        if (closerange==0) {
                            right.high();
                            backward.high();
                            forward.low();
                            left.low();     
                            //console.log(">> BACKWARD");
                        } 

	                    //console.log(">> RIGHT & BACK");	
	                }
	                //Steer Right & Forward
	                else if( z <= -75){
	                    right.high();
	                    backward.low();
	                    forward.high();
	                    left.low();
	                    //console.log(">> RIGHT & FORWARD");	
	                }
	            } else if (x <= -75){ // Steer LEFT
	                right.low();
	                backward.low();
	                forward.low();
	                left.high();
	                //console.log(">> LEFT");
	                //Steer Left & Back
	                if(z >= 75){
                        if (closerange==1){
                            right.low();
                            backward.low();
                            forward.low();
                            left.low();     
                            //console.log(">> BACKWARD STOPPED");
                        }
                        if (closerange==0) {
                            right.low();
                            backward.high();
                            forward.low();
                            left.high();
                            //console.log(">> BACKWARD");
                        } 
	                    //console.log(">> LEFT & BACKWARD");
	                }
	                //Steer Left & Forward
	                else if( z <= -75){
                        right.low();
                        backward.low();
                        forward.high();
                        left.high();    

	                    //console.log(">> LEFT & FORWARD");
	                }
	            } else if (z <= -75 && (x < 75 && x > -75)) { //Steer Forward
                    right.low();
                    backward.low();
                    forward.high();
                    left.low();	
                    //console.log(">> FORWARD");
	            } else if (z >=75 && (x < 75 && x > -75)) { //Steer Backward
                    if (closerange==1){
                        right.low();
                        backward.low();
                        forward.low();
                        left.low();     
                        //console.log(">> BACKWARD STOPPED");
                    } else if (closerange==0) {
                        right.low();
                        backward.high();
                        forward.low();
                        left.low();     
                        //console.log(">> BACKWARD");
                    } 

	            } else {
	                right.low();						// MIDDLE IDLE
	                backward.low();
	                forward.low();
	                left.low();
	                //console.log(">> IDLE");
	            }

            }
        }
        //DONT DO ANYTHING
        else {
            right.low();
            backward.low();
            forward.low();
            left.low();
        }
    });
});

