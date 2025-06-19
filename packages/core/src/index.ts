import { setupDbObservers } from '#db/observers';
import { setupEventHandlers } from '#handlers';

export * from '#events';
export * from '#models';
export * from '#types';
export * from '#db';
export * from '#constants';

function start() {
  console.log('Starting event handlers and database observers...');
  setupEventHandlers();
  setupDbObservers();
}

start();
