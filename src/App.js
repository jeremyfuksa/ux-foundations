import getReactWithCX from 'react-cx';
import { 
  getUsers,
  getBlockedIssuesAndPullRequests 
} from './utils/repositoryService';
import Avatar from 'terra-avatar';
import Card from 'terra-card';
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
  'neilpfeiffer',
  'jeremyfuksa',
  'scottwilmarth'
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const issues = getBlockedIssuesAndPullRequests(false, repos, labels, users);
    const usersArray = getUsers(false, users);
    console.log(usersArray);
  }

  render () {
    return (
      <div cx='app'>
        <Card cx='card'>
          <Card.Body>
            <h1><Avatar alt="Jeremy" initials="JF" /> Jeremy Fuksa</h1>
            <h2>Assigned</h2>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default App;
