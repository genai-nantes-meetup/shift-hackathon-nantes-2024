export default class AudioRecorder {
  constructor(delay) {
    this.delay = delay || 5000;
    this.interval = null;

    this.mediaRecorder = null;
    this.onData = () => {};
  }

  get isRecording() {
    return this.mediaRecorder.state === 'recording'
  }

  start() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = event => {
          const audioBlob = new Blob([event.data], { type: 'audio/wav' });
          this.onData(audioBlob);
        };

        this.mediaRecorder.start();
        this.interval = setInterval(() => {
          if (this.isRecording) {
            // Trigger data fetching
            this.mediaRecorder.stop();
            this.mediaRecorder.start();
          } else {
            console.log("state is not recording. Nothing to stop");
          }
        }, 5000); // 5 seconds
      })
      .catch(err => {
        console.error(err);
        this.stop();
      });
  }

  stop() {
    this.mediaRecorder.stop();
    clearInterval(this.interval);
  }
}
