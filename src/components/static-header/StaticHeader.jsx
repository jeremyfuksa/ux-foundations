import getReactWithCX from 'react-cx';
import Toolbar from 'terra-toolbar';
import styles from './StaticHeader.module.scss';
import UXLogo from './UserExperience.png';

const React = getReactWithCX(styles);

const StaticHeader = () => {
  return (
    <Toolbar cx='toolbar'>
      <h1>
        <img cx='ux-logo' src={UXLogo} alt='UX Logo'></img>
        <span>UX Foundations Github Dashboard</span>
      </h1>
    </Toolbar>
  );
}

export default StaticHeader;