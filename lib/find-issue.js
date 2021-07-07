const branchMatchingRegexp = /^([a-z]{1,8})[_\-\s]?(\d+)\b/i;

/**
 * Fidns the issue in the branch name or title
 * @param {String} refOrTitle Reference item or title
 * @returns {String|null}
 */
const findIssueInBranch = (refOrTitle) => {
    const finalRefPart = String(refOrTitle).split('/').pop();

    const refMatches = branchMatchingRegexp.exec(finalRefPart);

    if (refMatches === null) {
        return null;
    }

    return [
        refMatches[1].toUpperCase(),
        Number.parseInt(refMatches[2], 10).toString(10),
    ].join('-');
};

module.exports = findIssueInBranch;
