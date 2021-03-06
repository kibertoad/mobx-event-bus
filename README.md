# mobx-event-bus &middot; [![Build Status](https://travis-ci.org/7upcat/mobx-event-bus.svg?branch=master)](https://travis-ci.org/7upcat/mobx-event-bus)

Tiny library allows publish-subscribe-style communication between components without requiring the components to explicitly register with one another.
Based on original implementation by 7upcat, this fork includes Typescript bindings. Additional enhancements are planned in the future.

## Installation

`npm install mobx-event-bus2 --save`

## Usage

### Basic

```javascript
import { eventBus, subscribe } from 'mobx-event-bus'

class DemoStore {
  constructor () {
    // Registers subscriber the receive events
    eventBus.register(this)
  }

  // Mark listener1 as a event subscriber handle all 'topic1' events
  @subscribe('topic1')
  lisener1 (event) {
    console.log(`listener1: Hello ${event.payload}`)
  }

  // Mark listener2 as a event subscriber handle 'topic1' events payload match 'Martin'
  @subscribe('topic1', event => event.payload === 'Martin')
  listener2 (event) {
    console.log(`listener2: Hello ${event.payload}`)
  }
}

export const demoStore = new DemoStore()

// post event with topic 'topic1' and payload 'Tommy'
eventBus.post('topic1', 'Tommy')

// post event with topic 'topic1' and payload 'Martin'
eventBus.post('topic1', 'Martin')

// unregister from receiving future events
eventBus.unregister(demoStore);

```

### Integration with react-router

#### `RouterStore.js`

```javascript
import { createBrowserHistory } from 'history'
import { eventBus } from 'mobx-event-bus'

export default class RouterStore {
  constructor () {
    this.history.listen((location, action) => {
      eventBus.post('router', { ...location})
    })
  }

  history = createBrowserHistory()
}
```

#### `DomainStore.js`

```javascript
import { eventBus, subscribe } from 'mobx-event-bus'

export default class DomainStore {
  constructor () {
    eventBus.register(this, {
      fireImmediately: false
    })
  }

  @subscribe('router', {payload}=> payload.pathname === '/')
  setup( event ) {
    // init data
  }
}
```
### Handle Keyboard Events

#### React Component
```javascript
import eventBus from 'mobx-event-bus'
// 
export default ()=>{
  const handleKeyPress = (event)=>{
    eventBus.post('keyboard', event)
  }
  return <input type="text" id="one" onKeyPress={handleKeyPress} />
}
```

#### `DomainStore.js`

```javascript
import { eventBus, subscribe } from 'mobx-event-bus'

export default class DomainStore {
  constructor () {
    eventBus.register(this)
  }
  
  @subscribe('keyboard', ({payload}) => payload.key === 'Enter')
  handleEnterPress( event ) {
    // your business code.
  }
}
```

## API Documents

### eventBus

Dispatch events to listeners, and provides ways for subscribers register themselves.

```javascript
import { eventBus } from 'mobx-event-bus'
```

#### register(store, options?)

Registers all subscribers methods on store instances to receive events. 
Accepts optional config with the following options:

## Options

* `fireImmediately`: Boolean that indicates that the subscriber function should immediately 
be triggered if event for that topic were fired before. `false` by default.

#### unregister(store)

Unregister store from receiving future events.

#### post(topic , payload)

Posts specified topic events to registered subscribers.

```javascript
// event data structure
{
  topic: 'theTopic',
  payload: 'the data'
}
```
### @subscribe

Mark a store class method as an event subscriber.

Usage:
```
    @subscribe (topic, selector)
    handler() {
    
    }
```


