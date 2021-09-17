/* eslint-disable no-undef */
import getReactWithCX from 'react-cx';
import {
  getAudits,
  getUser,
  getLabeledIssues,
  makeInitials
} from './utils/repositoryService';
import Alert from 'terra-alert';
import LoadingOverlay from 'terra-overlay/lib/LoadingOverlay';
import OverlayContainer from 'terra-overlay/lib/OverlayContainer';
import StatusView from 'terra-status-view';
import Tabs from 'terra-tabs';
import AssignedIssues from './components/assigned-issues/AssignedIssues';
import IssueList from './components/issue-list/IssueList';
import StaticHeader from './components/static-header/StaticHeader';
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
  'cerner/terra-toolkit-boneyard',
  'cerner/generator-terra-module',
  'cerner/eslint-config-terra',
  'cerner/stylelint-config-terra',
  'cerner/browserslist-config-terra',
  'cerner/terra-kaiju-plugin',
  'cerner/kaiju',
  'cerner/terra-ui',
  'cerner/carbon-graphs'
];

const packages = [
  'terra-action-footer',
  'terra-action-header',
  'terra-alert',
  'terra-arrange',
  'terra-avatar',
  'terra-badge',
  'terra-base',
  'terra-breakpoints',
  'terra-button',
  'terra-button-group',
  'terra-card',
  'terra-cell-grid',
  'terra-content-container',
  'terra-demographics-banner',
  'terra-dialog',
  'terra-divider',
  'terra-doc-template',
  'terra-docs',
  'terra-dropdown-button',
  'terra-dynamic-grid',
  'terra-form-checkbox',
  'terra-form-field',
  'terra-form-fieldset',
  'terra-form-input',
  'terra-form-radio',
  'terra-form-select',
  'terra-form-textarea',
  'terra-grid',
  'terra-heading',
  'terra-html-table',
  'terra-hyperlink',
  'terra-i18n',
  'terra-icon',
  'terra-image',
  'terra-legacy-theme',
  'terra-list',
  'terra-markdown',
  'terra-mixins',
  'terra-overlay',
  'terra-paginator',
  'terra-profile-image',
  'terra-progress-bar',
  'terra-props-table',
  'terra-responsive-element',
  'terra-scroll',
  'terra-search-field',
  'terra-section-header',
  'terra-show-hide',
  'terra-signature',
  'terra-spacer',
  'terra-status',
  'terra-status-view',
  'terra-switch',
  'terra-table',
  'terra-tag',
  'terra-text',
  'terra-toggle',
  'terra-toggle-button',
  'terra-toggle-section-header',
  'terra-toolbar',
  'terra-visually-hidden-text',
  'terra-abstract-modal',
  'terra-aggregator',
  'terra-app-delegate',
  'terra-application',
  'terra-application-header-layout',
  'terra-application-layout',
  'terra-application-links',
  'terra-application-menu-layout',
  'terra-application-name',
  'terra-application-navigation',
  'terra-application-utility',
  'terra-brand-footer',
  'terra-collapsible-menu-view',
  'terra-date-input',
  'terra-date-picker',
  'terra-date-time-picker',
  'terra-dialog-modal',
  'terra-disclosure-manager',
  'terra-embedded-content-consumer',
  'terra-form-validation',
  'terra-hookshot',
  'terra-infinite-list',
  'terra-layout',
  'terra-menu',
  'terra-modal-manager',
  'terra-navigation-layout',
  'terra-navigation-prompt',
  'terra-navigation-side-menu',
  'terra-notification-dialog',
  'terra-popup',
  'terra-slide-group',
  'terra-slide-panel',
  'terra-slide-panel-manager',
  'terra-tabs',
  'terra-theme-context',
  'terra-theme-provider',
  'terra-time-input'
];

const labels = [
  ':construction: Blocked: UX Input',
  ':construction: Blocked: Accessibility Input',
  'Accessibility Review Required',
  'Accessibility Review Ready',
  'UX Review Required',
  'UX Review Ready'
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
      allAudits: false,
      allIssues: false,
      allUsers: false,
      isLoading: true,
      isErrored: false,
      users: [],
      audits: [],
      assignedIssues: [],
      unassignedIssues: []
    };
  }

  componentDidMount() {
    //Get audits
    getAudits(false, repos)
    .then((issues) => {
      const audits = [];
      issues.map(issue => {
        audits.push(issue);
        return null;
      });
      this.setState({
        allAudits: true,
        audits: audits
      });
      if(this.state.allIssues && this.state.allUsers && this.state.allAudits) {
        this.setState({ isLoading: false });
      }
    })
    .catch(() => {
      this.setState({
        isErrored: true,
        isLoading: false,
      });
    });
    // Get all labeled issues
    getLabeledIssues(false, repos, labels)
    .then((issues) => {
      // Sort between assigned and unassigned issues
      const assigned = [];
      const unassigned = [];
      issues.map(issue => {
        if (issue.assignees.length === 0) {
          unassigned.push(issue);
        } else {
          assigned.push(issue);
        }
        return null;
      });
      this.setState({
        allIssues: true,
        assignedIssues: assigned,
        unassignedIssues: unassigned
      });
      if(this.state.allIssues && this.state.allUsers && this.state.allAudits) {
        this.setState({ isLoading: false });
      }
    })
    .catch(() => {
      this.setState({
        isErrored: true,
        isLoading: false,
      });
    });

    // Make an array of user data to pass as a prop
    users.map(user => {
      getUser(false, user)
      .then((user) => {
      return {
          login: user.data.login,
          name: user.data.name,
          initials: makeInitials(user.data.name),
          image: user.data.avatar_url
        };
      })
      .then((obj) => {
        this.setState({ users: [...this.state.users, obj] });
        if(this.state.users.length === users.length) {
          this.setState({ allUsers: true });
        }
        if(this.state.allIssues && this.state.allUsers) {
          this.setState({ isLoading: false });
        }
        return null;
      })
      .catch(() => {
        this.setState({
          isErrored: true,
          isLoading: false,
        });
      });
      return null;
    });
    // Reverse sort
    // blocks.sort((a, b) => (a.age < b.age) ? 1 : -1);
  }

  render() {
    let cAssignedIssues;
    let cAudits;
    let cUnassigned;
    if (this.state.isErrored) {
      return (
        <div cx='app-error'>
          <StatusView title="Error" variant="error" />
        </div>
      );
    }
    if (this.state.users.length !== 0 && this.state.assignedIssues.length !== 0) {
      cAssignedIssues = (
        <Tabs.Pane
          label="Issues and PRs"
          key="issuesAndPrs"
        >
          <AssignedIssues users={this.state.users} issues={this.state.assignedIssues} />
        </Tabs.Pane>
      );
    } else {
      cAssignedIssues = (
        <Tabs.Pane
          label="Assigned Issues and PRs"
          key="issuesAndPrs"
        >
        </Tabs.Pane>
      );
    }
    if (this.state.audits.length !== 0) {
      cAudits = (
        <Tabs.Pane
          label="UX Audits"
          key="uxAudits"
        >
          <IssueList issues={this.state.audits} />
        </Tabs.Pane>
      );
    } else {
      cAudits = (
        <Tabs.Pane
          label="Terra Component UX Audits"
          key="uxAudits"
        >
          <Alert type="info">No audits have been defined.</Alert>
        </Tabs.Pane>
      );
    }
    
    if (this.state.unassignedIssues.length !== 0) {
      cUnassigned = (
        <Tabs.Pane
          label="Unassigned Issues and PRs"
          key="unassignedIssuesAndPrs"
        >
          <IssueList issues={this.state.unassignedIssues} />
        </Tabs.Pane>
      );
    } else {
      cUnassigned = (
        <Tabs.Pane
          label="Unassigned Issues and PRs"
          key="unassignedIssuesAndPrs"
        >
          <Alert type="info">No unassigned issues or PRs at this time.</Alert>
        </Tabs.Pane>
      );
    }

    return (
      <div cx='app'>
        <StaticHeader/>
        <div cx='app-content'>
          <OverlayContainer cx='container'>
            <LoadingOverlay isOpen={this.state.isLoading} isAnimated isRelativeToContainer />
            <Tabs defaultActiveKey='issuesAndPrs'>
              {cAssignedIssues}
              {cUnassigned}
              {cAudits}
            </Tabs>
          </OverlayContainer>
        </div>
      </div>
    );
  }
}

export default App;