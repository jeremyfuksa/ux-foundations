import getReactWithCX from 'react-cx';
import styles from './StaticHeader.module.scss';

const React = getReactWithCX(styles);

const StaticHeader = () => {
  return (
    <h1>
      <img cx='ux-logo' src='UserExperience.png' alt='UX Logo'></img>
      <span>UX Foundations Terra Dashboard</span>
    </h1>
  );
}

export default StaticHeader;