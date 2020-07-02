/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import getReactWithCX from 'react-cx';
import Card from 'terra-card';
import IconCommit from 'terra-icon/lib/icon/IconCommit';
import List, { Item } from 'terra-list';
import Issue from '../issue/Issue';
import CardHeader from './CardHeader';
import styles from './UserCard.module.scss';

const React = getReactWithCX(styles);
const iconCommit = <IconCommit/>;


class UserCard extends React.Component {
  constructor(props) {
    super(props);
    const total = props.issues.length;
    props.issues.sort((a, b) => (a.age < b.age) ? 1 : -1);
    this.state = {
      total: total,
      currentPage: 1
    }
  }

  render () {
    return (
      <Card cx='card'>
        <CardHeader
          initials={this.props.initials}
          image={this.props.image}
          name={this.props.name}
        />
        <Card.Body>
          <List>
            {
              this.props.issues.length > 0 ?
              this.props.issues.map((issue) => (
                <Item cx='issue-item' key={`issue-${this.props.initials}-${issue.htmlUrl}`}>
                  <Issue
                    age={issue.age}
                    htmlUrl={issue.htmlUrl}
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
        </Card.Body>
      </Card>
    );
  }
}

export default UserCard;