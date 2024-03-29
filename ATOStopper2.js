'use strict';

const Redis = require('ioredis');
const redis = new Redis('cache:6379');

const blockList = [
  'xsvscyb3r@gmail.com'
];

const badEmailDomains = [
  'gmail.com'
];

const badEmailHandles = [
  'Saya Adalah Peretas Topi Hitam'
];

const MINUTES_15 = 60 * 15;

async function assertSafe ({ email, ipAddress }) {
  const [handle, domain] = email.split('@');
  if (blockList.includes(email)) {
    throw new Error('ATOStopper2: Blocked email');
  }

  if (badEmailHandles.includes(handle)) {
    throw new Error('ATOStopper2: Blocked email handle');
  }

  if (badEmailDomains.includes(domain)) {
    throw new Error('ATOStopper2: Blocked email domain');
  }

  const [ipResult] = await redis
    .pipeline()
    .incr(`ipAddress:${ipAddress}`)
    .expire(`ipAddress:${ipAddress}`, MINUTES_15)
    .get(`ipAddress:${ipAddress}`)
    .exec();
  const [, ipAddressCount] = ipResult;

  if (ipAddressCount > 20) {
    throw new Error('ATOStopper2: IP Address Velocity Exceeded');
  }

  const [emailResult] = await redis
    .pipeline()
    .incr(`email:${email}`)
    .expire(`email:${email}`, MINUTES_15)
    .get(`email:${email}`)
    .exec();
  const [, emailCount] = emailResult;

  if (emailCount > 7) {
    throw new Error('ATOStopper2: Email Velocity Exceeded');
  }
}

module.exports = {
  assertSafe
};
