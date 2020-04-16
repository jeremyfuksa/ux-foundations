/* eslint-disable no-unused-expressions */
import getReactWithCX from 'react-cx';
import Hyperlink from 'terra-hyperlink';
import Table, {
  Header,
  HeaderCell,
  Body,
  Cell,
  Row,
} from 'terra-html-table';
import SectionHeader from 'terra-section-header';
import styles from './DataTable.module.scss';

const React = getReactWithCX(styles);

const DataTable = (props) => {
  console.log(props);
  if (props.data) {
    const tableRows = props.data.map(({
      title, htmlUrl, labels, age,
    }) => (
      <Row key={htmlUrl}>
        <Cell></Cell>
        <Cell><Hyperlink href={htmlUrl}>{title}</Hyperlink></Cell>
        <Cell></Cell>
        <Cell>{`${Number.parseFloat(age / (1000 * 60 * 60 * 24)).toFixed(0)} days`}</Cell>
      </Row>
    ));
    return (
      <div cx='break'>
        <SectionHeader title={props.title} />
        <Table>
          <Body>
            {tableRows}
          </Body>
        </Table>
      </div>
    );
  }
  return null;
};

export default DataTable;