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

const getUsers = (areInternalRepositories, assignedUsers) => {
  let octokitInstance;
  if (areInternalRepositories) {
    octokitInstance = getOctoKitInstanceForInternalGithub();
  } else {
    octokitInstance = getOctoKitInstanceForExternalGithub();
  }
  // get avatars and info for all users in the array.
  return Promise.all(assignedUsers.map((username) => {
    const userInfo = octokitInstance.users.getByUsername({username});
    // console.log(userInfo.data);
    return userInfo;
  }));
}

const getBlockedIssuesAndPullRequests = (areInternalRepositories, repositories, blockingLabels, assignedUsers) => {
  let octokitInstance;
  if (areInternalRepositories) {
    octokitInstance = getOctoKitInstanceForInternalGithub();
  } else {
    octokitInstance = getOctoKitInstanceForExternalGithub();
  }

  return Promise.all(repositories.map((repositoryInfo) => {
    const [owner, repository] = repositoryInfo.split('/');
    const options = octokitInstance.issues.listForRepo.endpoint.merge({
      owner,
      repo: repository,
      state: 'open',
      per_page: 100,
    });
    return octokitInstance.paginate(options).then(response => (
      response.map((issue) => {
        const updatedIssue = issue;
        updatedIssue.owner = owner;
        updatedIssue.repo = repository;
        return updatedIssue;
      })
    ));
  })).then((allResponses) => {
    const blockedIssues = [];
    flatten(allResponses, 2).forEach((issue) => {
      const labelNames = issue.labels.map(label => label.name);
      const relevantLabels = intersectionOfSets(new Set(labelNames), new Set(blockingLabels));
      const userNames = issue.assignees.map(assignee => assignee.login);
      const relevantUsers = intersectionOfSets(new Set(userNames), new Set(assignedUsers));
      if (relevantLabels.size > 0 && relevantUsers.size > 0) {
        const labelsArray = Array.from(relevantLabels);
        const usersArray = Array.from(relevantUsers);
        if (labelNames.includes('bug')) {
          labelsArray.push('bug');
        }
        if (labelNames.includes('bug-fix')) {
          labelsArray.push('bug-fix');
        }
        // console.log(issue);
        // need to add assignee and avatar_url to the object.
        blockedIssues.push({
          number: issue.number,
          repo: issue.repo,
          owner: issue.owner,
          title: issue.title,
          htmlUrl: issue.html_url,
          labels: labelsArray,
          users: usersArray,
        });
      }
    });
    return blockedIssues;
  }).then(blockedIssues => (
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

const getRepositoryTree = (owner, repo) => {
  const octokitInstance = getOctoKitInstanceForExternalGithub();
  return octokitInstance.git.getTree({
    owner,
    repo,
    tree_sha: 'master',
    recursive: 1,
  });
};

export {
  getUsers,
  getBlockedIssuesAndPullRequests,
  getRepositoryTree,
};
