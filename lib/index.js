const { observable, extendObservable, runInAction, reaction } = require('mobx');

function EventBus () {
  this.metadata = observable({});

  this.register = function (store, options) {
    const { __subscriberMetadata } = store;
    store.__subscriberReactions = [];
    if (__subscriberMetadata) {
      __subscriberMetadata.forEach((s) => {
        if (!this.metadata[s.topic]) {
          const item = {
            [s.topic]: {
              seq: 0
            }
          };
          runInAction(() => extendObservable(this.metadata, item));
        }
        store.__subscriberReactions.push(
          reaction(() => (this.metadata[s.topic].seq),
          (seq) => {
            if (seq > 0) {
              const { cb, selector } = s;
              if (!selector || selector(this.metadata[s.topic])) {
                runInAction(() => cb.apply(store, [this.metadata[s.topic]]))
              }
            }
          }, options)
        )
      })
    }
  };

  this.unregister = function (store) {
    const { __subscriberReactions } = store;
    if(__subscriberReactions) {
      while(__subscriberReactions.length) {
        __subscriberReactions.pop()();
      }
    }
  };

  this.post = function (topic, payload) {
    if (topic) {
      if (!this.metadata[topic]) {
        const item = {
          [topic]: {
            seq: 0
          }
        };
        runInAction(() => extendObservable(this.metadata, item));
      }
      runInAction(() => {
        this.metadata[topic].payload = payload;
        this.metadata[topic].seq = this.metadata[topic].seq + 1
      })
    }
  }
}

const eventBus = new EventBus();

function subscribe (topic, selector) {
  return function (target, name, descriptor) {
    const cb = descriptor.value;
    const sub = { topic, selector, cb };
    if (!target.__subscriberMetadata) {
      Object.defineProperty(target, '__subscriberMetadata', { value: [] });
    }
    target.__subscriberMetadata.push(sub);
    return descriptor
  }
}

module.exports = {
  eventBus,
  subscribe
};
