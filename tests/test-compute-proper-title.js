const assert = require('assert');
const { it, describe } = require('mocha');
const computePrTitle = require('../lib/compute-proper-title');

const testCases = [
    {
        expected: '[TEST-420] I Am A Test',
        branch: 'refs/heads/feature/test-420-i-am-a-test',
        title: 'Feature/test 420 i am a test',
        ticketNumber: 'TEST-420',
    },
    {
        expected: '[TEST-420] Test Project',
        branch: 'refs/heads/develop',
        title: 'TEST-420 - Test project',
        ticketNumber: 'TEST-420',
    },
    {
        expected: 'Hello World!',
        branch: 'refs/heads/goodbye',
        title: 'hello world!',
        ticketNumber: null,
    },
    {
        expected: '[DEV-42] Life, The Universe And Everything',
        branch: 'refs/heads/develop',
        title: '[DEV-42] Life, the universe and everything',
        ticketNumber: 'DEV-42',
    },
    {
        expected: '[DEV-666] Life, The Universe And Everything',
        branch: 'refs/heads/develop',
        title: '[DEV-42] Life, the universe and everything',
        ticketNumber: 'DEV-666',
    },
    {
        expected: '[PROJ-44] Random Test',
        branch: 'refs/heads/develop',
        title: 'PROJ-44 - Random test',
        ticketNumber: 'PROJ-44',
    },
    {
        expected: '[SIA-143] Verwijderde Medewerker Kan Via Api Niets',
        branch: 'refs/heads/develop',
        title: 'SIA-143-verwijderde-medewerker-kan-via-api-niets',
        ticketNumber: 'SIA-143',
    },
];

module.exports = () => {
    testCases.forEach(({
        expected, branch, title, ticketNumber,
    }) => {
        describe(`with title ${title}, branch ${branch} and ticketnumber ${ticketNumber}`, () => {
            it(`should return ${expected}`, () => {
                assert.equal(expected, computePrTitle(branch, title, ticketNumber));
            });
        });
    });
};
