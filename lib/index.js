/*!
 * Copyright (c) 2020-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {getCurrentInstance} from 'vue';

export default function install(app) {
  app.config.globalProperties.$emitExtendable = emitExtendable;
}

export function createEmitExtendable({emit}) {
  if(!emit && !getCurrentInstance()) {
    throw new TypeError('Emit function is not present.');
  }
  if(emit) {
    return emitExtendable.bind({emit});
  }
  return emitExtendable.bind(getCurrentInstance());
}

export async function emitExtendable(name, event = {}) {
  if(!(event && typeof event === 'object')) {
    throw new TypeError('"event" must be an object.');
  }

  // set initial response to a promise that resolves to undefined
  const initial = Promise.resolve();
  let response = initial;

  // emit event and augment it
  const promises = [];
  _emit.call(this, name, {
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

function _emit(...args) {
  if(this?.$emit) {
    return this.$emit(...args);
  }
  if(this?.emit) {
    return this.emit(...args);
  }
  const {emit} = getCurrentInstance();
  return emit(...args);
}
