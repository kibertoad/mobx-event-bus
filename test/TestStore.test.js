const { eventBus } = require('../lib');
const TestStore = require('./TestStore');
const TOPIC = require('./topic');

describe('TestStore', () => {
    it('should work with single topic', () => {
        const payload = {
            test: 1
        };
        const store = new TestStore();

        eventBus.post(TOPIC.SINGLE, payload);

        expect(store.payload).toEqual(payload);
    });

    it('should work with multiple topics', () => {
        const firstPayload = {
            test: 1
        };
        const secondPayload = {
            test: 1
        };
        const store = new TestStore();

        eventBus.post(TOPIC.FIRST_MULTIPLE, firstPayload);

        expect(store.payload).toEqual(firstPayload);

        eventBus.post(TOPIC.SECOND_MULTIPLE, secondPayload);

        expect(store.payload).toEqual(secondPayload);
    });

    it('should work with action decorator', () => {
        const store = new TestStore();
        const payload = {
            test: 1
        };

        eventBus.post(TOPIC.ACTION, payload);

        expect(store.payload).toEqual(payload);
    });

    it('should test selector', () => {
        const store = new TestStore();
        const invalidPayload = {
            id: 2
        };
        const validPayload = {
            id: 1
        };

        eventBus.post(TOPIC.SELECTOR, invalidPayload);

        expect(store.payload).toEqual(undefined);

         eventBus.post(TOPIC.SELECTOR, validPayload);

        expect(store.payload).toEqual(validPayload);
    });

    it('should do nothing for unknown topic', () => {
        const store = new TestStore();
        const payload = {
            test: 1
        };
        eventBus.post(TOPIC.UNKNOWN, payload);

        expect(store.payload).toEqual(undefined);
    });
});
