export default function State(initialState = {}) {
  this.state = initialState;
  this.publish = {};
}

// importing event emitter causes IE8 errors
// here's a stupid hacky event bus
State.prototype.on = function (eventName, callback) {
  if (!this.publish[eventName]) {
    this.publish[eventName] = [];
  }

  this.publish[eventName].push(callback);
};

State.prototype.emit = function (eventName, eventData) {
  console.log('EMIT#', eventName, eventData);
  if (this.publish[eventName] && this.publish[eventName].length > 0) {
    this.publish[eventName].forEach(cb => cb(eventData));
  }
};

State.prototype.setState = function (newState) {
  const oldState = this.state;
  this.state = {
    ...this.state,
    ...newState,
  };
  this.emit('change', {oldState, newState: this.state});
  console.log('state changed', this.state);
};

// ES6 classes don't transpile?
// export default class State extends EventEmitter {
//   constructor(initialState = {}) {
//     super();
//     this.state = initialState;
//     this.state.token = getCookie(SETTING_TOKEN);
//   }
//
//   setState(newState) {
//     this.state = {
//       ...this.state,
//       ...newState,
//     };
//     this.emit('change', this.state);
//     console.log('state changed', this.state);
//   }
// }
