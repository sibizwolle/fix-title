const { describe } = require('mocha');
const testComputeProperTitle = require('./test-compute-proper-title');
const testFindIssueInBranch = require('./test-find-issue-in-branch');

describe('Issue detection', () => {
    testFindIssueInBranch();
});

describe('Title compution', () => {
    testComputeProperTitle();
});
