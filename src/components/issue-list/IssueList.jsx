import getReactWithCX from 'react-cx';
import List, { Item } from 'terra-list';
import Issue from '../issue/Issue';
import PropTypes from 'prop-types';
import styles from './IssueList.module.scss';

const React = getReactWithCX(styles);

class IssueList extends React.Component {
  constructor(props) {
    super(props);
    props.issues.sort((a, b) => (a.age < b.age) ? 1 : -1);
    this.state = {};
  }
  
  componentDidMount() {
    this.props.issues.map((issue) => {
      issue.labels.map((label) => {
        if(label.includes('Ready')) {
          issue.readyForReview = true;
        }
        if(label.includes('Blocked')) {
          issue.isBlocked = true;
        }
        if(label.includes('bug')) {
          issue.isBug = true;
        }
        return null;
      });
      return null;
    });
  }

  render () {
    return (
      <div cx='issue-list'>
        <List>
          {
            this.props.issues.length > 0 ?
            this.props.issues.map((issue) => (
              <Item cx='issue-item' key={`issue-${this.props.initials}-${issue.htmlUrl}`}>
                <Issue
                  age={issue.age}
                  htmlUrl={issue.htmlUrl}
                  labels={issue.labels}
                  repo={issue.repo}
                  title={issue.title}
                  isPR={issue.isPR}
                  isBug={issue.isBug}
                  isBlocked={issue.isBlocked}
                  readyForReview={issue.readyForReview}
                />
              </Item>
            ))
            : <Item cx='issue-item' key={`no-issues-${this.props.initials}`}>No assigned issues.</Item>
          }
        </List>
      </div>
    );
  }
}

IssueList.propTypes = {
  issues: PropTypes.array
};

export default IssueList;