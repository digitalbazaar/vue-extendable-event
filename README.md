# vue-extendable-event
ExtendableEvents for Vue

## Overview

This library provides a helper to Vue to enable "extendable events", modeled
after the Web's "[ExtendableEvent](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent)" interface.

It is often useful to be able to perform asynchronous actions when handling
and event. It is also often useful for the emitter of the event to know when
this event handling has completed. It allows the emitter to provide visual
cues to the user, such as loading animations, etc. while the event is still
being processed.

The idea behind an "ExtendableEvent" is to enable the lifetime of an event to
become "extendable" in a way that the event emitter can know about. This
approach keeps a clean separation of concerns:

The event emitter can perform its duties without having to know the
implementation details of how its events are handled but it can be informed of
when processing has finished. It can also be informed of any error that
occurred during processing.

To accomplish this, an event that is emitted via the extendable event API is augmented with a `waitUntil(Promise)` method. The caller of this method passes
it a Promise such that the event emitter can wait for it to settle before
proceeding.

Additionally, some emitters may desire a specific response from an event
handler. One motivation for this use case comes from this thread:

https://github.com/vuejs/vue/issues/5443

This library also augments the event with a `respondWith(Promise)` that
controls the return value of the aforementioned Promise that the emitter
awaits. This function call can only be called by a single event emitter,
otherwise an error is thrown.

## Installation

```js
import ExtendableEvent from 'vue-extendable-event';
Vue.use(ExtendableEvent);
```

## Examples

With this library installed, a Vue component can emit an extendable event:

```js
await this.$emitExtendable(name, event);
```

This method returns a Promise that will settle once all promises passed via
calls to `event.waitUntil` have settled and once the Promise that was passed to
`event.respondWith` (if used) has settled. The Promise will be rejected if any of those promises reject, indicating a failure to process the event. Note that not every emitter will have a need for a specific return value via
`event.respondWith`, often `event.waitUntil` will suffice.

Here is an example of emitting an "ExtendableEvent":

```js
export default {
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async click() {
      this.loading = true;
      try {
        const event = {foo: 1};
        await this.$emitExtendable('foo', event);
      } catch(e) {
        // handle/display error somehow
      } finally {
        this.loading = false;
      }
    }
  }
}
```

Another component could handle the event like this:

```js
export default {
  methods: {
    foo(event) {
      event.waitUntil(this.doSomethingAsync());
    },
    async doSomethingAsync() {
      // do something async
    }
  }
}
```

Similarly, another component could respond to an event with a specific
value like this:

```js
// responding to the event with a value, if advertised as supported by the
// emitter's contract as useful
export default {
  methods: {
    foo(event) {
      event.respondWith(this.doSomethingAsync());
    },
    async doSomethingAsync() {
      // do something async and return something for the emitter
    }
  }
}
```
