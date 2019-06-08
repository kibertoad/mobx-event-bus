const { eventBus, subscribe } = require('../lib');
const { action } = require('mobx');
const TOPIC = require('./topic');

class TestStore {

    payload = undefined;

    constructor() {
        eventBus.register(this)
    }

    @subscribe(TOPIC.SINGLE)
    singleEvent(event) {
        this.payload = event.payload;
    }

    @subscribe(TOPIC.FIRST_MULTIPLE)
    @subscribe(TOPIC.SECOND_MULTIPLE)
    multipleEvents(event) {
        this.payload = event.payload;
    }

    @subscribe(TOPIC.ACTION)
    @action
    action(event) {
        this.payload = event.payload;
    }

    @subscribe(TOPIC.SELECTOR, ({ payload }) => payload.id === 1)
    selector(event) {
        this.payload = event.payload;
    }
}

module.exports = TestStore;
