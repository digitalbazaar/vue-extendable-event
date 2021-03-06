/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
export default function install(Vue) {
  Vue.prototype.$emitExtendable = $emitExtendable;
}

async function $emitExtendable(name, event = {}) {
  if(!(event && typeof event === 'object')) {
    throw new TypeError('"event" must be an object.');
  }

  // set initial response to a promise that resolves to undefined
  const initial = Promise.resolve();
  let response = initial;

  // emit event and augment it
  const promises = [];
  this.$emit(name, {
    ...event,
    // allow event lifetime to be extended
    waitUntil: p => promises.push(p),
    // allow response to event to be sent to emitter
    respondWith(p) {
      if(response !== initial) {
        throw new Error(
          '"respondWith" has already been called and may only be called once.');
      }
      response = p;
    }
  });

  // await any lifetime extensions
  await Promise.all(promises);

  // return response
  return response;
}
