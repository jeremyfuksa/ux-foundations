import getReactWithCX from 'react-cx';
import {
  getUser,
  getBlockedIssuesAndPullRequests
} from './utils/repositoryService';
import GithubCard from './components/github-card/GithubCard';
import styles from './App.module.scss';

const React = getReactWithCX(styles);
const repos = [
    'cerner/duplicate-package-checker-webpack-plugin',
    'cerner/terra-aggregate-translations',
    'cerner/terra-application',
    'cerner/terra-clinical',
    'cerner/terra-core',
    'cerner/terra-dev-site',
    'cerner/terra-enzyme-intl',
    'cerner/terra-framework',
    'cerner/terra-toolkit',
    'cerner/generator-terra-module',
    'cerner/eslint-config-terra',
    'cerner/stylelint-config-terra',
    'cerner/browserslist-config-terra',
    'cerner/terra-kaiju-plugin',
    'cerner/kaiju',
    'cerner/terra-ui',
    'cerner/carbon-graphs'
  ];

const labels = [
  '🚧Blocked: UX Input Needed',
  'Needs UX review',
  'Needs design input',
  'Ready for UX review',
  'Blocked: UX Input Needed',
  'Blocked: Awaiting UX Input'
];

const users = [
  'jeremyfuksa',
  'neilpfeiffer',
  'scottwilmarth'
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: {},
      cards: []
    };
  }

  componentDidMount() {
    // const issues = getBlockedIssuesAndPullRequests(false, repos, labels, users);
    this.makeCards();
  }

  makeCards = () => {
    for (let i = 0; i < users.length; i++) {
      getUser(false, users[i])
      .then((user) => {
        console.log(user.data);
        let cardArray = this.state.cards;
        cardArray.push(
          <GithubCard
            key={i}
            name={user.data.name}
            initials={this.makeInitials(user.data.name)}
            image={user.data.avatar_url}
          />
        );
        this.setState({
          cards: cardArray
        });
      });
    }
  }

  makeInitials = (name) => {
    let initials = name.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    return initials;
  }

  render () {
    return (
      <div cx='app'>
        <h1>UX Foundations Dashboard</h1>
        <div cx='app-content'>{this.state.cards}</div>
      </div>
    );
  }
}

export default App;
