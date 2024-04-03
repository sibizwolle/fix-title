const branchMatchingRegexp = /^\/?refs\/(heads|tags)\/(?=.+)/;

const removeGitRefsFromBranch = (branch) => String(branch).replace(branchMatchingRegexp, '');

const removeBranchPrefix = (branch, title) => {
    const branchWithoutGitRef = removeGitRefsFromBranch(branch);

    const branchParts = branchWithoutGitRef.split('/');
    if (branchParts.length !== 2) {
        return title;
    }

    const firstBranchPart = branchParts[0].toLowerCase();
    if (title.toLowerCase().indexOf(firstBranchPart) !== 0) {
        return title;
    }

    return title.substring(firstBranchPart.length + 1).trim();
};

const removeTicketNumberFromStart = (title, ticketNumber) => {
    if (!ticketNumber) {
        return title;
    }

    const ticketNumberSpaced = ticketNumber.replace(/-/g, '(\\s|-)?');
    const ticketProject = ticketNumber.split('-')[0];

    return title
        .replace(RegExp(`^\\[${ticketNumber}\\]`, 'i'), '')
        .replace(RegExp(`^\\[${ticketProject}-\\d+\\]`, 'i'), '')
        .replace(RegExp(`^${ticketNumberSpaced}(\\s?[-:]|\\s)`, 'i'), '')
        .replace(RegExp(`^${ticketProject}-\\d+(\\s?[-:]|\\s)`, 'i'), '')
        .trim();
};

const computePrTitle = (branch, title, ticketNumber) => {
    // Use a let and treat title as constant
    let newTitle = title;

    // Convert "[proj-10] feature/proj 10 test stuff" to "feature/proj 10 test stuff"
    newTitle = removeTicketNumberFromStart(newTitle, ticketNumber);

    // Convert "feature/proj 10 test stuff" to "proj 10 test stuff"
    newTitle = removeBranchPrefix(branch, newTitle);

    // Convert "proj 10 test stuff" to "test stuff"
    newTitle = removeTicketNumberFromStart(newTitle, ticketNumber);
    
    // Convert "test stuff" to "Test Stuff"
    newTitle = newTitle.replace(/(\s+|^)([a-z])/g, (matches) => matches.toUpperCase());

    // Don't tweak further if no ticketNumber is set
    if (!ticketNumber) {
        return newTitle;
    }

    // Insert number
    return `[${ticketNumber}] ${newTitle}`;
};

module.exports = computePrTitle;
