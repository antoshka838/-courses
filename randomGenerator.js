const crypto = require('crypto')

class RandomGenerator{
    generateKey(){
        return crypto.randomBytes(32).toString('hex');
    }

    generateRandom(min,max){    
        const range = max - min + 1;
        const randomValue = crypto.randomBytes(4).readUInt32BE(0);
        return min + (randomValue % range);
    }

    calculateHMAC(key, message){
        return crypto.createHmac('sha3-256', key).update(message).digest('hex');
    }

}

module.exports = RandomGenerator;