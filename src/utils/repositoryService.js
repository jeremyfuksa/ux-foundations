import {Octokit} from '@octokit/rest';
import flatten from 'lodash.flattendeep';

const getOctoKitInstanceForExternalGithub = () => (
  Octokit({
    timeout: 0, // 0 means no request timeout
    userAgent: 'octokit/rest.js v16.27.0',
    auth: '931ccca7e8c21f87914460449e3b574f62039c6d',
  })
);

const getOctoKitInstanceForInternalGithub = () => (
  Octokit({
    timeout: 0, // 0 means no request timeout
    userAgent: 'octokit/rest.js v16.27.0',
    baseUrl: 'https://github.cerner.com/api/v3',
    auth: '1a10c2cc57e848533ddd589ef7eb5249d3e3c4d6',
  })
);

const intersectionOfSets = (set1, set2) => new Set([...set1].filter(x => set2.has(x)));

const getUser = (areInternalRepositories, username) => {
  let octokitInstance;
  if (areInternalRepositories) {
    octokitInstance = getOctoKitInstanceForInternalGithub();
  } else {
    octokitInstance = getOctoKitInstanceForExternalGithub();
  }
  return octokitInstance.users.getByUsername({username});
}

const getBlocks = (areInternalRepositories, repositories, blockingLabels, username) => {
  let octokitInstance;
  if (areInternalRepositories) {
    octokitInstance = getOctoKitInstanceForInternalGithub();
  } else {
    octokitInstance = getOctoKitInstanceForExternalGithub();
  }

  return Promise.all(repositories.map((repositoryInfo) => {
    const [owner, repository] = repositoryInfo.split('/');
    // Get options for pagination
    const options = octokitInstance.issues.listForRepo.endpoint.merge({
      owner,
      repo: repository,
      state: 'open',
      assignee: username,
      per_page: 100
    });
    // Gets the open issues that are assigned
    return octokitInstance.paginate(options)
    .then((response) => (
      response.map((issue) => {
        const updatedIssue = issue;
        updatedIssue.owner = owner;
        updatedIssue.repo = repository;
        return updatedIssue;
      })
    ));
  }))
  .then((allResponses) => {
    const blockedIssues = [];
    flatten(allResponses, 2).forEach((issue) => {
      // console.log(issue);
      const labelNames = issue.labels.map(label => label.name);
      const relevantLabels = intersectionOfSets(new Set(labelNames), new Set(blockingLabels));
      if (relevantLabels.size > 0) {
        const labelsArray = Array.from(relevantLabels);
        if (labelNames.includes('bug')) {
          labelsArray.push('bug');
        }
        if (labelNames.includes('bug-fix')) {
          labelsArray.push('bug-fix');
        }
        blockedIssues.push({
          number: issue.number,
          repo: issue.repo,
          owner: issue.owner,
          title: issue.title,
          htmlUrl: issue.html_url,
          labels: labelsArray,
        });
      }
    });
    return blockedIssues;
  })
  .then(blockedIssues => (
    Promise.all(blockedIssues.map((blockedIssue) => {
      const updatedBlockedIssue = blockedIssue;
      const options = octokitInstance.issues.listEvents.endpoint.merge({
        owner: blockedIssue.owner,
        repo: blockedIssue.repo,
        issue_number: blockedIssue.number,
      });
      return octokitInstance.paginate(options).then((events) => {
        events.filter(event => event.event === 'labeled' && blockingLabels.includes(event.label.name)).reverse().forEach((event) => {
          updatedBlockedIssue.age = new Date() - new Date(event.created_at);
        });
        return updatedBlockedIssue;
      });
    }))
  ));
};

const makeInitials = (name) => {
  let initials = name.match(/\b\w/g) || [];
  initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  return initials;
}

export {
  getUser,
  getBlocks,
  makeInitials
};
