const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

function fib(index) {
    if (index < 2) return 1;
    return fib(index -1) + fib(index -2);
}

// When new message comes, Redis calculates with fib function
sub.on('message', (channel, message) => {
   redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');