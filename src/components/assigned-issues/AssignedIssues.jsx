import getReactWithCX from 'react-cx';
import UserCard from '../user-card/UserCard';
import PropTypes from 'prop-types';
import styles from './AssignedIssues.module.scss';
const React = getReactWithCX(styles);
class AssignedIssues extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: []
    };
  }

  componentDidMount() {
    // Divide issues up by user
    this.props.users.map((user) => {
      const userIssues = [];
      this.props.issues.map((issue) => {
        issue.assignees.map((assignee) => {
          if (user.login === assignee.login) {
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
            userIssues.push(issue);
          }
          return null;
        })
        return null;
      });
      const currentUser = {
        name: user.name,
        initials: user.initials,
        image: user.image,
        issues: userIssues
      };
      this.setState(prevState => ({
        cards: [...prevState.cards, currentUser]
      }));
      return null;
    });
  }

  render() {
    return (
      <section cx='issues assigned-issues'>
        {this.state.cards.map((card) => (
        <UserCard
          key={card.initials}
          name={card.name}
          initials={card.initials}
          image={card.image}
          issues={card.issues}
        />
        ))}
      </section>
    );
  }
}

AssignedIssues.propTypes = {
  users: PropTypes.array,
  issues: PropTypes.array
};

export default AssignedIssues;