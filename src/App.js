import getReactWithCX from 'react-cx';
import {
  getUser,
  getBlocks,
  makeInitials
} from './utils/repositoryService';
import StatusView from 'terra-status-view';
import LoadingOverlay from 'terra-overlay/lib/LoadingOverlay';
import OverlayContainer from 'terra-overlay/lib/OverlayContainer';
import IssueCards from './components/issue-cards/IssueCards';
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

const blockLabels = [
  '🚧Blocked: UX Input Needed',
  'Blocked: UX Input Needed',
  'Blocked: Awaiting UX Input'
];

const reviewLabels = [
  'Needs UX review',
  'Ready for UX review',
  'Ready for UX Review'
];

const inputLabels = [
  'Needs design input'
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
      isLoading: true,
      isErrored: false,
      cards: [],
      blocks: {},
      reviews: {},
      inputs: {}
    };
  }

  componentDidMount() {
    for (const [index, name] of users.entries()) {
      this.populateCard(name, index);
    }

    getBlocks(false, repos, blockLabels, 'none')
    .then((blocks) => {
      this.setState({blocks: blocks});
    })
    .catch(() => {
      this.setState({blocks: undefined});
    });

    getBlocks(false, repos, reviewLabels, 'none')
    .then((reviews) => {
      this.setState({reviews: reviews});
    })
    .catch(() => {
      this.setState({reviews: undefined});
    });

    getBlocks(false, repos, inputLabels, 'none')
    .then((inputs) => {
      this.setState({inputs: inputs});
    })
    .catch(() => {
      this.setState({inputs: undefined});
    });
  }

  populateCard = (userName, index) => {
    const card = {};
    getUser(false, userName)
      .then((user) => {
        Object.assign(card, {
          index: index,
          userName: user.data.name,
          userInitials: makeInitials(user.data.name),
          userImage: user.data.avatar_url
        });
      })
      .then(() => {
        return getBlocks(false, repos, blockLabels, userName);
      })
      .then((blocks) => {
        Object.assign(card, {blocks: blocks});
      })
      .then(() => {
        return getBlocks(false, repos, reviewLabels, userName);
      })
      .then((reviews) => {
        Object.assign(card, {reviews: reviews});
      })
      .then(() => {
        return getBlocks(false, repos, inputLabels, userName);
      })
      .then((inputs) => {
        Object.assign(card, {inputs: inputs});
      })
      .then(() => {
        const newCard = [...this.state.cards, card];
        this.setState({
          cards: newCard,
          isErrored: false
        });
        if(this.state.cards.length === users.length) {
          this.setState({isLoading: false});
        }
      })
      .catch(() => {
        this.setState({
          cards: undefined,
          isErrored: true,
          isLoading: false,
        });
      });
  }

  render () {
    if (this.state.isErrored) {
      return <StatusView title="Error" variant="error" />;
    }
    return (
      <div cx='app'>
        <h1><img cx='ux-logo' src='UserExperience.png'></img><span>UX Foundations Terra Dashboard</span></h1>
        <OverlayContainer cx='container'>
          <LoadingOverlay isOpen={this.state.isLoading} isAnimated isRelativeToContainer />
          <div cx='app-content'>
            <IssueCards cards={this.state.cards} />
            <GithubCard
              key='UN_BLOCKS'
              type='unassigned'
              name='Unassigned UX Blocks'
              icon='🚧'
              iconClass='yellow-avatar'
              blocks={this.state.blocks}
            />
            <GithubCard
              key='UN_REVIEWS'
              type='unassigned'
              icon='⭐️'
              iconClass='green-avatar'
              name='Unassigned UX Reviews'
              blocks={this.state.reviews}
            />
            <GithubCard
              key='UN_INPUT'
              type='unassigned'
              icon='💬'
              iconClass='red-avatar'
              name='Unassigned Design Input'
              blocks={this.state.inputs}
            />
          </div>
        </OverlayContainer>
      </div>
    );
  }
}

export default App;
