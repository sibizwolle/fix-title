import { info, getInput, warning, setFailed, startGroup, endGroup } from "@actions/core";
import { getOctokit, context } from "@actions/github";
import computePrTitle from "./lib/compute-proper-title";
import findIssueInBranch from "./lib/find-issue";

async function updatePrTitle() {
    startGroup("Processing PR...");

    try {
        // Find token from request
        const token = getInput("token", { required: true });
        const octokit = getOctokit(token);

        // Find input ticket, if any
        const inputTicket = getInput("ticket-number", { required: false });

        // Prepare reusable query
        const prQuery = {
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: context.issue.number,
        };

        // Fetch PR
        const pullRequest = await octokit.rest.pulls.get(prQuery);

        // Determine the ticket number from the input, the branch or the title
        const ticketNumber = inputTicket ||
            findIssueInBranch(pullRequest.data.head.ref) ||
            findIssueInBranch(pullRequest.data.title);

        info(`Ticket number "${ticketNumber}" found.`);

        // Get the current title as shorthand for comparison
        const prHeadRef = pullRequest.data.head.ref;
        const currentTitle = String(pullRequest.data.title);

        if (currentTitle.trim().length === 0) {
            info("Title is empty, not continuing");
            return;
        }

        // Let the system compute the right title
        const properTitle = computePrTitle(prHeadRef, currentTitle, ticketNumber);

        // Check if the titles are identical
        if (properTitle.toLocaleLowerCase() === currentTitle.toLocaleLowerCase()) {
            info(`PR title “${currentTitle}” is already clean, not updating.`);
            return;
        }

        // Throw a warning if the title is empty now
        if (properTitle.length === 0) {
            warning(`Could not compute a proper title from current PR title “${currentTitle}”`);
            return;
        }

        // Report empty
        info(`Updating PR title to “${properTitle}”...`);

        // Send update to GitHub
        await octokit.rest.pulls.update({
            ...prQuery,
            title: properTitle,
        });

        // Assign label to PR
        const labels = await octokit.rest.issues.listLabelsForRepo({
            owner: prQuery.owner,
            repo: prQuery.repo,
        });

        // Find label that starts with the project name
        const matchingLabelWithTicket = labels.data.find((label) =>
            label.name.startsWith(ticketNumber.split("-")[0])
        );

        info(`${labels.data.length} labels found.`);

        // Add label to PR if found
        if (matchingLabelWithTicket) {
            info(`Adding label “${matchingLabelWithTicket.name}” to PR...`);

            await octokit.rest.issues.addLabels({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                labels: [matchingLabelWithTicket.name],
            });
        }
    } catch (error) {
        setFailed(error.message);
    }

    endGroup();
}

updatePrTitle();
