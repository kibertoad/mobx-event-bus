const {eventBus, subscribe} = require('../lib')

class TestStore {

    payload = undefined

    constructor() {
        eventBus.register(this)
    }

    @subscribe('topic1')
    lisener1(event) {
        this.payload = event.payload
    }
}

module.exports = TestStore
