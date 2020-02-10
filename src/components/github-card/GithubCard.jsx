import getReactWithCX from 'react-cx';
import Avatar from 'terra-avatar';
import Card from 'terra-card';
import styles from './GithubCard.module.scss';

const React = getReactWithCX(styles);

class GithubCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Card cx='card'>
        <div cx='card-header'>
          <Avatar 
            alt={this.props.name}
            image={this.props.image}
            initials={this.props.initials}
            cx='github-avatar'
          />
          <div cx='user-name'>{this.props.name}</div>
        </div>
        <Card.Body>
          <h2>Assigned</h2>
        </Card.Body>
      </Card>
    );
  }
}

export default GithubCard;