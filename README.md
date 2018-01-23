# ugv-leapmotion

### Abstract

  The purpose of this project was to create an unmanned ground vehicle which could be controlled using intuitive hand gestures. The vehicle also provides feedback to the user about the the environment in which its in, by way of two sensors (one proximity and one temperature sensor), and a smartphone which provides a live video feed. This vehicle has a myriad of potential applications, including military reconnaissance, field mine detection, mars exploration and search and rescue. 

### Design

1. Use a Leap Motion to control an RC car.
    
![High Level Overview of Goal](https://i.imgur.com/TeAatYm.png)

2. Modify RC car with peripherals.
![RC Car Overview](https://i.imgur.com/7ojm3W2.png)

### Host Setup

1. Install Leap Motion Driver - https://www.leapmotion.com/setup/desktop/osx

2. Install Node.js (if on OSX)
```
brew install node
```

3. Plugin the Leap Motion

4. Verify the WebSocket Server is available - https://developer.leapmotion.com/documentation/javascript/supplements/Leap_JSON.html

### RC Setup

1. Copy the `raspi` folder onto the raspberry pi. 

2. Start `piclient.js` on the raspberry pi.
```
node piclient.js
```
3. Start `sensor.py` on the raspberry pi.
```
python sensor.py
```

## Built With

* [NodeJS](https://nodejs.org/en/)
* [Python](https://www.python.org/)
* [LeapMotion](https://www.leapmotion.com/setup/) 
* [Johnny-Five](http://johnny-five.io/)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
