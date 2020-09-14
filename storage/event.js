class Event {
  constructor() {
    this._events = {};
  }
  once(event, fn) {
    function on() {
      this.off(event, on);
      fn.apply(this, arguments)
    }
    on.fn = fn;
    this.on(event, on);
  }
  on(event, fn) {
    (this._events[event] || (this._events[event] = [])).push(fn);
  }
  off(event, fn) {
    const cbs = this._events[event];
    if(!cbs) {
      return;
    }
    if(!fn) {
      this._events[event] = null;
    }
    let cb = null;
    let i = cbs.length;
    console.log(cbs);
    while(i--) {
      cb = cbs[i];
      if(cb === fn || cb.fn === fn) {
        this._events[event].splice(i, 1);
        break;
      }
    }
  }
  emit(event, ...args) {
    let cbs = this._events[event];
    if(cbs) {
      
      cbs.forEach(cb => {
        cb.apply(this, args);
      })
    }
  }
}
export default Event;