const { eventBus } = require('../lib');
const TestStore = require('./TestStore');
const TOPIC = require('./topic');

beforeEach(() => {
    eventBus.metadata = {};
});

describe('EventBus', () => {
    it('should test register', () => {
        const store = new TestStore();

        expect(store.__subscriberMetadata).toEqual([{
            cb: store.singleEvent,
            selector: undefined,
            topic: TOPIC.SINGLE
          }, {
            cb: store.multipleEvents,
            selector: undefined,
            topic: TOPIC.SECOND_MULTIPLE
          }, {
            cb: store.multipleEvents,
            selector: undefined,
            topic: TOPIC.FIRST_MULTIPLE
          }, {
            cb: store.action,
            selector: undefined,
            topic: TOPIC.ACTION
        }, {
            cb: store.selector,
            selector: expect.any(Function),
            topic: TOPIC.SELECTOR
        }]);

        expect(store.__subscriberReactions).toHaveLength(5);
    });

    it('should test metadata', () => {
        const payload = {
            test: 1
        };
        const storeMetadata = {
            [TOPIC.ACTION]: {
                seq: 0
            },
            [TOPIC.FIRST_MULTIPLE]: {
                seq: 0
            },
            [TOPIC.SECOND_MULTIPLE]: {
                seq: 0
            },
            [TOPIC.SELECTOR]: {
                seq: 0
            },
            [TOPIC.SINGLE]: {
                seq: 0
            }
        };

        expect(eventBus.metadata).toEqual({});

        eventBus.post(TOPIC.UNKNOWN, payload);

        expect(eventBus.metadata).toEqual({
            [TOPIC.UNKNOWN]: {
                seq: 1,
                payload,
            }
        });

        new TestStore();

        expect(eventBus.metadata).toEqual({
            ...storeMetadata,
            [TOPIC.UNKNOWN]: {
                seq: 1,
                payload,
            }
        });

        eventBus.post(TOPIC.SINGLE, payload);

        expect(eventBus.metadata).toEqual({
            ...storeMetadata,
            [TOPIC.SINGLE]: {
                seq: 1,
                payload,
            },
            [TOPIC.UNKNOWN]: {
                seq: 1,
                payload,
            }
        });
    });

    it('should test unregister', () => {
        const payload = {
            test: 1
        };
        const firstStore = new TestStore();
        const secondStore = new TestStore();

        expect(firstStore.__subscriberReactions).toHaveLength(5);
        expect(secondStore.__subscriberReactions).toHaveLength(5);

        eventBus.unregister(firstStore);

        expect(firstStore.__subscriberReactions).toHaveLength(0);
        expect(secondStore.__subscriberReactions).toHaveLength(5);

        eventBus.post(TOPIC.SINGLE, payload);

        expect(firstStore.payload).toEqual(undefined);
        expect(secondStore.payload).toEqual(payload);
    });
});
