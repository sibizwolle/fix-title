const { assert } = require('chai');
const { it } = require('mocha');
const findIssueInBranch = require('../lib/find-issue');

const testCases = [
    ['refs/heads/steve/test-194-random-number', 'TEST-194'],
    ['test-2-2-2', 'TEST-2'],
    ['test323', 'TEST-323'],
    ['zero-004', 'ZERO-4'],
];

testCases.forEach(([input, expected]) => {
    it(`should return ${expected} with title ${input}`, () => {
        assert.equal(expected, findIssueInBranch(input));
    });
});
