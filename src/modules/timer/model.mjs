'use strict';

const TimerModel = {
  // Current time in seconds
  startTime: new Date().getTime(),
  currentTime: 1500,
  running: false,
  workTime: true,
  pompoms: 0,
  pubSub: null,
  subject: 'timer',
  countDown: null,
  currentPomodoro: 0,
  pomodoroTime: 1500,
  pomodoroRest: 300,
  pomodoroLong: 750,
  buttonPressed: false,
  storageID: 'timer',
  /**
   * Load the object with all its default settings
   */
  load: function (PubSub) {
    const currentSettings = JSON.parse(localStorage.getItem(this.storageID));
    if (currentSettings) {
      this.currentTime = currentSettings.currentTime;
      this.running = currentSettings.running;
      this.workTime = currentSettings.workTime;
      this.pompoms = currentSettings.pompoms;
      this.countDown = currentSettings.countDown;
      this.buttonPressed = currentSettings.buttonPressed;
    } else {
      this.currentTime = this.pomodoroTime;
    }
    this.currentPomodoro = this.currentTime;

    // Set the current time to the pomodoro timer
    // this.currentTime = this.pomodoroTime;

    // console.log(PubSub);
    this.pubSub = PubSub;
    this.publish();

    // Use a faster timeout for local testing
    const timeout = 1000;

    // create the timer once
    this.countDown = window.setInterval(() => {
      this.buttonPressed = false;
      //Make sure the timer is running and not paused
      if (this.running) {
        //  Check if the timer has ended, if it has determine the next course of action
        console.log('load', this.currentTime);
        if (this.currentTime <= 0) {
          this.stop();
          this.next();
        } else {
          /**
           * Decrease the timer
           */
          this.decrease();
        }
      }
    }, timeout);
  },
  publish: function () {
    const currentSettings = {
      currentTime: this.currentTime,
      running: this.running,
      workTime: this.workTime,
      pompoms: this.pompoms,
      countDown: this.countDown,
      buttonPressed: this.buttonPressed,
    };
    localStorage.setItem(this.storageID, JSON.stringify(currentSettings));
    this.pubSub.publish(this);
  },
  /**
   * Decrease the current time by one second
   */
  decrease: function () {
    var currentMillisecondsPassed = new Date().getTime() - this.startTime;
    this.currentTime = this.currentPomodoro - currentMillisecondsPassed / 50;
    this.publish();
  },
  /**
   * Start the timer
   */
  start: function () {
    this.running = true;
    this.buttonPressed = true;
    this.startTime = new Date().getTime();
    console.log(this.startTime);
    this.publish();
  },
  /**
   * Stop the timer
   */
  stop: function () {
    this.running = false;
    this.publish();
  },
  next: function () {
    // console.log('Next timer');
    //   Alarm && Alarm.play();

    /**
     * Check the amount of pompoms, this will determine what happens to the timer
     * The number of pompoms will indicate what iteration we are on
     * 8: Will indicate the end of a round because this is the last iteration
     * 7: Will be the long break after the previous 3 breaks
     * 1,3,5: Will be the short breaks and can be calculated using mod
     * 2,4,6: Pomodoro, this is the default not caught by any of the if statements
     */
    this.pompoms++;
    // console.log(`Pompoms: ${this.pompoms}`);
    // End: The 8th pompom will happen after the long break so requires it to be reset
    if (this.pompoms === 8) {
      this.pompoms = 0;
      this.workTime = true;
      this.setTime(this.pomodoroTime);
    }
    // Long Break: The 7th pompom occurs after 4 rounds so this means you get a long break
    else if (this.pompoms === 7) {
      this.setTime(this.pomodoroLong);
      this.workTime = false;
    }
    // Short Break: Every 2nd pompom should be a break
    else if (this.pompoms % 2 === 1) {
      this.setTime(this.pomodoroRest);
      this.workTime = false;
    } else {
      // Pomodoro period
      this.setTime(this.pomodoroTime);
      this.workTime = true;
    }
  },
  /**
   * Set the timer to a number of seconds that it will run for.
   * The timer can only be set if the timer is not running
   *
   * @param seconds Number of seconds for the timer to be set to
   */
  setTime: function (seconds) {
    // Check that timer is not running
    if (this.running) return;
    this.currentPomodoro = seconds;
    this.currentTime = seconds;
    this.publish();
  },
  /**
   * Set timings of the pomodoro
   * @param profile Profile containing the values of the timings
   */
  setTiming: function (profile) {
    // console.log('set timing', profile);

    /**
     * The profile is set in minutes so you will need to calculate the values
     * in seconds before saving them
     */
    if (profile.pomodoroTime) {
      this.pomodoroTime = profile.pomodoroTime * 60;
    }
    if (profile.pomodoroRest) {
      this.pomodoroRest = profile.pomodoroRest * 60;
    }
    if (profile.pomodoroLong) {
      this.pomodoroLong = profile.pomodoroLong * 60;
    }
  },
  reset: function () {
    this.running = false;
    this.buttonPressed = true;
    this.currentTime = this.pomodoroTime;
    this.currentPomodoro = this.currentTime;
    this.pompoms = 0;
    this.workTime = true;
    this.publish();
  },
};
export default TimerModel;
