const testComputeProperTitle = require('./test-compute-proper-title');
const testFindIssueInBranch = require('./test-find-issue-in-branch');

console.group('Issue detection');
testFindIssueInBranch();
console.groupEnd();

console.group('Title compution');
testComputeProperTitle();
console.groupEnd();
