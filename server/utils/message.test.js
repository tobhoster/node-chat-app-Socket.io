var expect = require('expect');
var {generateMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var res = generateMessage('Oluwatobi', 'How are you?');

        expect(res.from).toEqual('Oluwatobi');
        expect(res.text).toEqual('How are you?');
        expect(res.createdAt).toBeA("number");
    });
})