/* eslint-disable no-undef */
import {Octokit} from '@octokit/rest';
import flatten from 'lodash.flattendeep';

function b64DecodeUnicode(str) {
  return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
}

console.log(b64DecodeUnicode(process.env.REACT_APP_GITHUB_PERSONAL_TOKEN));

const getOctoKitInstanceForExternalGithub = () => (
  new Octokit({
    timeout: 0, // 0 means no request timeout
    userAgent: 'octokit/rest.js v18.10.0',
    auth: b64DecodeUnicode(process.env.REACT_APP_GITHUB_PERSONAL_TOKEN)
  })
);

// const getOctoKitInstanceForInternalGithub = () => (
//   Octokit({
//     timeout: 0, // 0 means no request timeout
//     userAgent: 'octokit/rest.js v18.10.0',
//     baseUrl: 'https://github.cerner.com/api/v3',
//     auth: process.env.REACT_APP_INT_GITHUB,
//   })
// );

const intersectionOfSets = (set1, set2) => new Set([...set1].filter(x => set2.has(x)));

const getUser = (areInternalRepositories, username) => {
  let octokitInstance;
  // Temporarily allow public api only
  // if (areInternalRepositories) {
  //   octokitInstance = getOctoKitInstanceForInternalGithub();
  // } else {
  //   octokitInstance = getOctoKitInstanceForExternalGithub();
  // }
  octokitInstance = getOctoKitInstanceForExternalGithub();
  return octokitInstance.rest.users.getByUsername({username});
}

const getAudits = (areInternalRepositories, repositories) => {
  let octokitInstance;
  // Temporarily allow public api only
  // if (areInternalRepositories) {
  //   octokitInstance = getOctoKitInstanceForInternalGithub();
  // } else {
  //   octokitInstance = getOctoKitInstanceForExternalGithub();
  // }
  octokitInstance = getOctoKitInstanceForExternalGithub();

  return Promise.all(repositories.map((repositoryInfo) => {
    const [owner, repository] = repositoryInfo.split('/');
    const options = octokitInstance.rest.issues.listForRepo.endpoint({
      owner,
      repo: repository,
      state: 'open',
      per_page: 500
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
    const allIssues = [];
    flatten(allResponses, 2).forEach((issue) => {
      let isPR = false;
      const labelNames = issue.labels.map(label => label.name);
      const relevantLabels = intersectionOfSets(new Set(labelNames), new Set(['UX Audit']));
      if(issue.pull_request) {
        isPR = true;
      }
      if (relevantLabels.size > 0) {
        let labelsArray = Array.from(relevantLabels);
        if (labelNames.includes('bug')) {
          labelsArray.push('bug');
        }
        if (labelNames.includes('bug-fix')) {
          labelsArray.push('bug-fix');
        }
        allIssues.push({
          age: new Date() - new Date(issue.created_at),
          assignees: issue.assignees,
          number: issue.number,
          repo: issue.repo,
          owner: issue.owner,
          title: issue.title,
          htmlUrl: issue.html_url,
          labels: labelsArray,
          isPR: isPR
        });
      }
    });
    return allIssues;
  });
}

const getLabeledIssues = (areInternalRepositories, repositories, labels) => {
  let octokitInstance;
  // Temporarily allow public api only
  // if (areInternalRepositories) {
  //   octokitInstance = getOctoKitInstanceForInternalGithub();
  // } else {
  //   octokitInstance = getOctoKitInstanceForExternalGithub();
  // }
  octokitInstance = getOctoKitInstanceForExternalGithub();

  return Promise.all(repositories.map((repositoryInfo) => {
    const [owner, repository] = repositoryInfo.split('/');
    const options = octokitInstance.rest.issues.listForRepo.endpoint({
      owner,
      repo: repository,
      state: 'open',
      per_page: 500
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
    const allIssues = [];
    flatten(allResponses, 2).forEach((issue) => {
      let isPR = false;
      const labelNames = issue.labels.map(label => label.name);
      const relevantLabels = intersectionOfSets(new Set(labelNames), new Set(labels));
      if(issue.pull_request) {
        isPR = true;
      }
      if (relevantLabels.size > 0) {
        let labelsArray = Array.from(relevantLabels);
        if (labelNames.includes('bug')) {
          labelsArray.push('bug');
        }
        if (labelNames.includes('bug-fix')) {
          labelsArray.push('bug-fix');
        }
        allIssues.push({
          age: new Date() - new Date(issue.created_at),
          assignees: issue.assignees,
          number: issue.number,
          repo: issue.repo,
          owner: issue.owner,
          title: issue.title,
          htmlUrl: issue.html_url,
          labels: labelsArray,
          isPR: isPR
        });
      }
    });
    return allIssues;
  });
};

// May never use.
const assignUser = (areInternalRepositories, number, owner, repo, username) => {
  let octokitInstance;
  if (areInternalRepositories) {
    octokitInstance = getOctoKitInstanceForInternalGithub();
  } else {
    octokitInstance = getOctoKitInstanceForExternalGithub();
  }
  return octokitInstance.rest.issues.addAssignees({
    owner,
    repo,
    number,
    username
  });
};

const makeInitials = (name) => {
  let initials = name.match(/\b\w/g) || [];
  initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  return initials;
}

export {
  getAudits,
  getUser,
  getLabeledIssues,
  makeInitials,
  assignUser
};
