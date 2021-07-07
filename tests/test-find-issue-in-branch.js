const findIssueInBranch = require('../lib/find-issue');

const testCases = [
    ['refs/heads/steve/test-194-random-number', 'TEST-194'],
    ['test-2-2-2', 'TEST-2'],
    ['test323', 'TEST-323'],
    ['zero-004', 'ZERO-4'],
];

module.exports = () => {
    testCases.forEach(([input, expected]) => {
        const result = findIssueInBranch(input);
        if (result === expected) {
            console.log('Got expected %o from %o', expected, input);
            return;
        }

        console.error('Got unexpected result %o from %o, expected %o', result, input, expected);
    });
};
