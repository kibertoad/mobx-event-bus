/* Type definitions for mobx-event-bus */
/* Version 0.1.1 */
/* Definitions by: Igor Savin https://github.com/kibertoad */

declare interface ReactionOptions {
    fireImmediately?: boolean;
}

declare interface EventBus {
    /**
     *  @field
     */
    metadata: {
        [topic: string]: {
            seq: number,
            payload?: any
        }
    }

    /**
     * Registers subscriber to receive events
     * @function
     * @param {object} subscriber
     * @param {ReactionOptions} options
     */
    register(subscriber: object, options?: ReactionOptions): void;

    /**
     * Unregisters subscriber
     * @function
     * @param {object} subscriber
     */
    unregister(subscriber: object): void;

    /**
     * Post event with given topic and payload
     * @function
     * @param {string} topic
     * @param {Object} payload
     */
    post(topic: string, payload: any): void;
}

export const eventBus: EventBus;

declare interface Event<Payload> {
    topic: string,
    payload?: Payload;
}

interface Selector<Payload> {
    (event: Event<Payload>): boolean;
}

export function subscribe<Payload>(topic: string, selector?: Selector<Payload>);
