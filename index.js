const core = require('@actions/core');
const github = require('@actions/github');
const computePrTitle = require('./lib/compute-proper-title');
const findIssueInBranch = require('./lib/find-issue');

try {
    // Find token from request
    const token = core.getInput('token', { required: true });
    const octokit = github.getOctokit(token);

    // Find input ticket, if any
    const inputTicket = core.getInput('ticket-number', { required: false });

    // Prepare reusable query
    const prQuery = {
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: github.context.issue.number,
    };

    // Fetch PR
    octokit.rest.pulls.get(prQuery).then((pullRequest) => {
        // Determine the ticket number from the input, the branch or the title
        const ticketNumber = inputTicket
            || findIssueInBranch(pullRequest.data.head.ref)
            || findIssueInBranch(pullRequest.data.title);

        // Get the current title as shorthand for comparison
        const prHeadRef = pullRequest.data.head.ref;
        const currentTitle = String(pullRequest.data.title);

        if (currentTitle.trim().length === 0) {
            core.info('Title is empty, not continuing');
            return;
        }

        // Let the system compute the right title
        const properTitle = computePrTitle(prHeadRef, currentTitle, ticketNumber);

        // Check if the titles are identical
        if (properTitle.toLocaleLowerCase() === currentTitle.toLocaleLowerCase()) {
            core.info(`PR title “${currentTitle}” is already clean, not updating.`);
            return;
        }

        if (properTitle.length === 0) {
            core.warning(`Could not compute a proper title from current PR title “${currentTitle}”`);
            return;
        }

        core.info(`Updating PR title to “${properTitle}”...`);

        return octokit.rest.pulls.update(Object.assign(prQuery, {
            title: properTitle,
        }));
    });
} catch (error) {
    core.setFailed(error.message);
}
