const assert = require('assert');
const { it, describe } = require('mocha');
const findIssueInBranch = require('../lib/find-issue');

const testCases = [
    ['refs/heads/steve/test-194-random-number', 'TEST-194'],
    ['test-2-2-2', 'TEST-2'],
    ['test323', 'TEST-323'],
    ['zero-004', 'ZERO-4'],
    ['SIA-143-verwijderde-medewerker-kan-via-api-niets', 'SIA-143'],
    ['PROJ-44 - Random test', 'PROJ-44'],
    ['[DEV-42] Life, the universe and everything', 'DEV-42'],
    ['hello world!', null],
    ['TEST-420 - Test project', 'TEST-420'],
    ['Feature/test 420 i am a test', 'TEST-420'],
];

module.exports = () => {
    testCases.forEach(([input, expected]) => {
        describe(`with ${input}`, () => {
            it(`should return ${expected}`, () => {
                assert.equal(expected, findIssueInBranch(input));
            });
        });
    });
};
