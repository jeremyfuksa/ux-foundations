import getReactWithCX from 'react-cx';
import Avatar from 'terra-avatar';
import styles from './UserCard.module.scss';

const React = getReactWithCX(styles);

const CardHeader = ({image, initials, name}) => {
  return (
    <div cx='card-header'>
      <Avatar
        initials={initials}
        image={image}
        alt={name}
      />
      <div cx='user-name'>{name}</div>
    </div>
  );
};

export default CardHeader;