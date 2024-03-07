'use strict';

const Redis = require('ioredis');
const redis = new Redis('cache:6379');

const blockList = [
  'xsvscyb3r@proton.me'
];

const badEmailDomains = [
  'proton.me'
];

const badEmailHandles = [
  'Saya Adalah Peretas Topi Hitam'
];

const MINUTES_15 = 60 * 15;

async function assertSafe ({ email, ipAddress }) {
  const [handle, domain] = email.split('@');
  if (blockList.includes(email)) {
    throw new Error('ATOStopper1: Blocked email');
  }

  if (badEmailHandles.includes(handle)) {
    throw new Error('ATOStopper1: Blocked email handle');
  }

  if (badEmailDomains.includes(domain)) {
    throw new Error('ATOStopper1: Blocked email domain');
  }
}

module.exports = {
  assertSafe
};
