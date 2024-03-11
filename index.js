import { info, getInput, getBooleanInput, warning, setFailed, startGroup, endGroup } from "@actions/core";
import { getOctokit, context } from "@actions/github";
import computePrTitle from "./lib/compute-proper-title";
import findIssueInBranch from "./lib/find-issue";

// Find token from request
const token = getInput("token", { required: true });
const octokit = getOctokit(token);

// Prepare reusable query
const prQuery = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.issue.number,
};

let ticketNumber = null;

async function updatePrTitle() {
    startGroup("Start updating PR title...");

    try {
        // Find input ticket, if any
        const inputTicket = getInput("ticket-number", { required: false });

        // Fetch PR
        const pullRequest = await octokit.rest.pulls.get(prQuery);

        // Get the current title as shorthand for comparison
        const prHeadRef = pullRequest.data.head.ref;
        const currentTitle = String(pullRequest.data.title);

        if (currentTitle.trim().length === 0) {
            info("Title is empty, not continuing");
            return;
        }

        // Determine the ticket number from the input, the branch or the title
        ticketNumber = inputTicket ||
            findIssueInBranch(pullRequest.data.head.ref) ||
            findIssueInBranch(pullRequest.data.title);

        info(`Ticket number: "${ticketNumber}"`);

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
    } catch (error) {
        setFailed(error.message);
    }

    endGroup();
}

async function updatePrLabels() {
    startGroup("Start updating Labels on PR...");
        const assignDefaultLabel = getInput("label", { required: false });

        if (assignDefaultLabel == "false") {
            info(`Skip labeling PR`);

            return;
        }

        if (!ticketNumber) {
            info(`No ticket number found, don't label PR`);

            return;
        }

        // Fetch labels
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

    endGroup();
}

await updatePrTitle();
await updatePrLabels();