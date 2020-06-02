'use strict';

const TimerModel = {
  // Current time in seconds
  currentTime: 1500,
  running: false,
  workTime: true,
  pompoms: 0,
  pubSub: null,
  subject: 'timer',
  countDown: null,
  /**
   * Load the object with all its default settings
   */
  load: function (PubSub) {
    // console.log(PubSub);
    this.pubSub = PubSub;
    this.publish();

    // Use a faster timeout for local testing
    const timeout =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
        ? 10
        : 1000;

    // create the timer once
    this.countDown = window.setInterval(() => {
      //Make sure the timer is running and not paused
      if (this.running) {
        //  Check if the timer has ended, if it has determine the next course of action
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
    this.pubSub.publish(this);
  },
  /**
   * Decrease the current time by one second
   */
  decrease: function () {
    this.currentTime--;
    this.publish();
  },
  /**
   * Start the timer
   */
  start: function () {
    this.running = true;
    this.publish();
  },
  /**
   * Stop the timer
   */
  stop: function () {
    // console.log('Stopping timer');
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
      this.setTime(1500);
    }
    // Long Break: The 7th pompom occurs after 4 rounds so this means you get a long break
    else if (this.pompoms === 7) {
      this.setTime(750);
      this.workTime = false;
    }
    // Short Break: Every 2nd pompom should be a break
    else if (this.pompoms % 2 === 1) {
      this.setTime(300);
      this.workTime = false;
    } else {
      // Pomodoro period
      this.setTime(1500);
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
    this.currentTime = seconds;
    this.publish();
  },
  reset: function () {
    this.running = false;
    this.currentTime = 1500;
    this.publish();
  },
};
export default TimerModel;
