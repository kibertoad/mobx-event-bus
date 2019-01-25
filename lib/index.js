const { observable, extendObservable, runInAction, reaction } = require('mobx');

exports.eventBus = (function () {
  let metadata = observable({})
  function registerToStore(store) {
    const { __subscriberMetadata } = store
    if (__subscriberMetadata) {
      __subscriberMetadata.forEach((s) => {
        if (!metadata[s.topic]) {
          const item = {}
          item[s.topic] = { seq: 0 }
          extendObservable(metadata, item)
          metadata[s.topic].event = {}
        }
        if (metadata[s.topic].seq > 0) {
          const { cb, selector } = s
          if (!selector || selector(metadata[s.topic])) {
            runInAction(() => cb.apply(store, [metadata[s.topic]]))
          }
        }
        reaction(() => (metadata[s.topic].seq),
          (seq) => {
            if (seq > 0) {
              const { cb, selector } = s
              if (!selector || selector(metadata[s.topic])) {
                runInAction(() => cb.apply(store, [metadata[s.topic]]))
              }
            }
          })
      })
    }
  }

  function postEvent(topic, payload) {
    if (topic) {
      if (!metadata[topic]) {
        const item = {}
        item[topic] = { seq: 0 }
        extendObservable(metadata, item)
      }
      runInAction(() => {
        metadata[topic].payload = payload
        metadata[topic].seq = metadata[topic].seq + 1
      })
    }
  }

  return {
    register: registerToStore,
    post: postEvent
  }
})();

exports.subscribe = (topic, selector) => {
  return function (target, name, descriptor) {
    const cb = descriptor.value
    const sub = { topic, selector, cb }
    if (!target.__subscribers) { target.__subscribers = [] }
    target.__subscribers.push(sub)
    Object.defineProperty(target, '__subscriberMetadata', { value: target.__subscribers })
    return descriptor
  }
}

