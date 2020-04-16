import getReactWithCX from 'react-cx';
import GithubCard from '../github-card/GithubCard';
import styles from './IssueCards.module.scss';

const React = getReactWithCX(styles);

const IssueCards = ({cards}) => {
  if(cards) {
    const issueCards = cards.map(({
      userName,
      userInitials,
      userImage,
      reviews,
      blocks,
      inputs
    }) => (
      <GithubCard
        key={userInitials}
        name={userName}
        initials={userInitials}
        image={userImage}
        reviews={reviews}
        blocks={blocks}
        inputs={inputs}
      />
    ));
    return issueCards;
  }
  return null;
};

export default IssueCards;