const FIRST_HASH_VALUE = '0000000000000000000000000000000000000000000000000000000000000000';
const FIRST_NONCE = '0';
const START_VALUE = '00';
const should = require('should');

describe('Transaction (service)', function() {

    describe('#CreateFirstTransaction()', function() {
      it('Should create first transaction with correct hash', async function () {
        const message = 'Test message';
        const created = await TransactionService.create(message);
        
        created.should.have.property('hash');
        created.should.have.property('hash').equal(FIRST_HASH_VALUE);
      });

      it('Should create first transaction with correct message', async function () {
        const message = 'Test message';
        const created = await TransactionService.create(message);
        
        created.should.have.property('message');
        created.should.have.property('message').equal(message);
      });

      it('Should create first transaction with correct nonce', async function () {
        const message = 'Test message';
        const created = await TransactionService.create(message);
        
        created.should.have.property('nonce');
        created.should.have.property('nonce').equal(FIRST_NONCE);
      });

    });

    describe('#CreateMultipleTransactions()', function() {
        it('Should create to entries with correct messages', async function () {
            const messageOne = 'Test message 1';
            const messageTwo = 'Test message 2';

            const createdFirst = await TransactionService.create(messageOne);
            const createdSecond = await TransactionService.create(messageTwo);

            createdFirst.should.have.property('message');
            createdFirst.should.have.property('message').equal(messageOne);

            createdSecond.should.have.property('message');
            createdSecond.should.have.property('message').equal(messageTwo);
          });

        it('Should create two entries and persist in storage', async function () {
            const messageOne = 'Test message 1';
            const messageTwo = 'Test message 2';
            await TransactionService.create(messageOne);
            await TransactionService.create(messageTwo);

            const storage = TransactionService.get();
            createdFirst = storage[0];
            createdSecond = storage[1];

            createdFirst.split(',').should.containEql(messageOne);
            createdSecond.split(',').should.containEql(messageTwo);
        });

        it('Should create three entries and hash must start with zeros', async function () {
            const messageOne = 'Test message 1';
            const messageTwo = 'Test message 2';
            const messageThree = 'Test message 3';

            await TransactionService.create(messageOne);
            await TransactionService.create(messageTwo);
            await TransactionService.create(messageThree);

            const storage = TransactionService.get();
            createdSecond = storage[1];
            createdThird = storage[2];

            createdSecond.split(',')[0].should.startWith(START_VALUE);

            createdThird.split(',')[0].should.startWith(START_VALUE);
        });

        it('Should create three and each hash must depend the last one.', async function () {
            const messageOne = 'Test message 1';
            const messageTwo = 'Test message 2';
            const messageThree = 'Test message 3';

            await TransactionService.create(messageOne);
            await TransactionService.create(messageTwo);
            await TransactionService.create(messageThree);

            const storage = TransactionService.get();
            createdFirst = storage[0].split(',');
            createdSecond = storage[1].split(',');
            createdThird = storage[2].split(',');

            TransactionService.hash(createdFirst[0], messageTwo, createdSecond[2]).should.be.equal(createdSecond[0]);
            TransactionService.hash(createdSecond[0], messageThree, createdThird[2]).should.be.equal(createdThird[0]);

        });

        it('Should create three and each hash must depend the last one.', async function () {
            const results = []
            for(let i = 0; i < 10; i++)
                results.push(await TransactionService.create(`Message${i}`));

            for(let i = 1; i < 10; i++)
                TransactionService.hash(results[i-1].hash, `Message${i}`, results[i].nonce).should.be.equal(results[i].hash);

        });
    })
  
  });
