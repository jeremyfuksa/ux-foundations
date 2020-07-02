import getReactWithCX from 'react-cx';
import Hyperlink from 'terra-hyperlink';
import {ReactComponent as PrIcon} from './icon-pr.svg';
import {ReactComponent as IssueIcon} from './icon-issue.svg';
import {ReactComponent as BugIcon} from './icon-bug.svg';
import moment from 'moment';
import styles from './Issue.module.scss';

const React = getReactWithCX(styles);

const Issue = ({
  age,
  htmlUrl,
  labels,
  isBlocked,
  isBug,
  isPR,
  readyForReview,
  repo,
  title
}) => {
  let labelList = null;
  if (labels) {
    labelList = (
      <div cx='label-list'>
        {labels.map((label) => {
          return (<div cx='label' key={`${title}-${label}`}>{label.replace(/:construction:/gi, '🚧')}</div>);
        })}
      </div>
    );
  }
  return (
    <React.Fragment>
      <div cx='issue-details'>
        <span cx={[readyForReview ? 'ready-for-review' : '', isBlocked ? 'issue-blocked' : '', 'issue-icon', 'issue-type']}>{isPR ? <PrIcon /> : <IssueIcon />}</span>
        <span cx='issue-repo'>{repo}</span>
        <span cx={[Number.parseFloat(age / 86400000).toFixed(0) >= 60 ? 'issue-age-alert' : '', 'issue-age']}>
          <BugIcon cx={[isBug ? 'is-bug': 'hidden', 'issue-icon']} />
          {
            Number.parseFloat(age / 86400000).toFixed(0) >= 365 ?
            `${moment.duration(age).as('years').toFixed(1)} ${moment.duration(age).as('years').toFixed(1) < 1.1 ? 'year' : 'years'}` :
            `${Number.parseFloat(age / 86400000).toFixed(0)} days`
          }
        </span>
      </div>
      <div cx='issue-metadata'>
        <Hyperlink cx='issue-link' href={htmlUrl} target='_blank'>
          {title}
        </Hyperlink>
        {labelList}
      </div>
    </React.Fragment>
  );
};

export default Issue;