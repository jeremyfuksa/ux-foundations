import getReactWithCX from 'react-cx';
import Avatar from 'terra-avatar';
import Badge from 'terra-badge';
import Card from 'terra-card';
import DropdownButton, { Item as DropItem } from 'terra-dropdown-button';
import Hyperlink from 'terra-hyperlink';
import List, { 
  Item,
  Subsection
} from 'terra-list';
import Paginator from 'terra-paginator';
import styles from './GithubCard.module.scss';

const React = getReactWithCX(styles);

const GithubCard = ({
  type,
  name,
  initials,
  icon,
  iconClass,
  image,
  reviews,
  blocks,
  inputs
}) => {
  if (initials) {
    const total = blocks.length + reviews.length;
    const blockList = blocks.length > 0 ? blocks.map(({
      htmlUrl, title, repo, age
    }) => (
      <Item cx='issue-item' key={`block-${htmlUrl}`}>
        <div cx='issue-details'>
          <span>{repo}</span><span>{`${Number.parseFloat(age / (1000 * 60 * 60 * 24)).toFixed(0)} days`}</span>
        </div>
        <Hyperlink href={htmlUrl} target='_blank'>
          {title}
        </Hyperlink>
      </Item>
    )) : <Item cx='issue-item' key={`no-block-${initials}`}>No assigned issues.</Item>;
    const reviewList = reviews.length > 0 ? reviews.map(({
        htmlUrl, title, repo, age
      }) => (
        <Item cx='issue-item' key={`review-${htmlUrl}`}>
          <div cx='issue-details'>
            <span>{repo}</span><span>{`${Number.parseFloat(age / (1000 * 60 * 60 * 24)).toFixed(0)} days`}</span>
          </div>
          <Hyperlink href={htmlUrl} target='_blank'>
            {title}
          </Hyperlink>
        </Item>
      )) : <Item cx='issue-item' key={`no-review-${initials}`}>No issues to review.</Item>;
    const inputList = inputs.length > 0 ? inputs.map(({
        htmlUrl, title, repo, age
      }) => (
        <Item cx='issue-item' key={`input-${htmlUrl}`}>
          <div cx='issue-details'>
            <span>{repo}</span><span>{`${Number.parseFloat(age / (1000 * 60 * 60 * 24)).toFixed(0)} days`}</span>
          </div>
          <Hyperlink href={htmlUrl} target='_blank'>
            {title}
          </Hyperlink>
        </Item>
      )) : <Item cx='issue-item' key={`no-input-${initials}`}>No assigned issues.</Item>;
    return (
      <Card cx='card'>
        <div cx='card-header'>
          <Avatar
            alt={name}
            image={image}
            initials={initials}
          />
          <div cx='user-name'>{name} <Badge intent='info'>{total}</Badge></div>
        </div>
        <Card.Body>
          <List cx='block-list'>
            <Subsection
              key={`blocks-${initials}`}
              title='Blocked Issues'
            >
              {blockList}
            </Subsection>
          </List>
          <List cx='block-list'>
            <Subsection
              key={`inputs-${initials}`}
              title='Design Input Needed'
            >
              {inputList}
            </Subsection>
          </List>
          <List>
            <Subsection
              key={`reviews-${initials}`}
              title='UX Review Needed'
            >
              {reviewList}
            </Subsection>
          </List>
        </Card.Body>
      </Card>
    );
  }
  if (type) {
    const totalCount = blocks.length;
    const list = totalCount > 0 ? blocks.map(({
      htmlUrl, title, repo, age
    }) => (
      <Item cx='issue-item' key={`block-${htmlUrl}`}>
        <div cx='issue-details'>
          <span>{repo}</span><span>{`${Number.parseFloat(age / (1000 * 60 * 60 * 24)).toFixed(0)} days`}</span>
        </div>
        <div cx='issue-actions'>
          <Hyperlink cx='issue-link' href={htmlUrl} target='_blank'>
            {title}
          </Hyperlink>
          <DropdownButton
            cx='issue-assign'
            label='Assign'
            isCompact
          >
            <DropItem label='Jeremy Fuksa' />
            <DropItem label='Neil Pfeiffer' />
            <DropItem label='Scott Wilmarth' />
          </DropdownButton>
        </div>
      </Item>
    )) : <Item cx='issue-item' key={`no-block-${initials}`}>No unassigned issues.</Item>;
    return (
      <Card cx='card'>
        <div cx='card-header'>
        <Avatar
            initials={icon}
            cx={iconClass}
            alt={name}
          />
          <div cx='user-name'>{name}</div>
        </div>
        <Card.Body>
          <List cx='block-list'>
            {list}
          </List>
        </Card.Body>
      </Card>
    );
  }
  return null;
};

export default GithubCard;