import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import Layout from '../components/Layout';

type CollectionStats = {
  name: string;
  floorPrice: number;
  oneDaySales: number;
  oneDayAveragePrice: number;
  oneDayVolume: number;
  oneDayChange: number;
  sevenDaySales: string;
  sevenDayAveragePrice: number;
  sevenDayChange: number;
  totalVolume: number;
  slug: string;
};

const toTwoDecimalPlaces = (num: number) => Math.round(num * 100) / 100;

const SorterColumn = ({prop, children}) => {
  const {query} = useRouter();

  const [sortProp, sortOrder] = (query?.sortBy as string)?.split(':') ?? [];

  return (
    <th className="p-2 text-left">
      <Link
        href={{
          pathname: '/',
          query: {
            ...query,
            sortBy: `${prop}:${
              sortProp === prop ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc'
            }`,
          },
        }}
      >
        <a className={sortProp === prop ? 'text-blue-700' : ''}>
          {children}
          {sortProp === prop ? (sortOrder === 'desc' ? '▼' : '▲') : ''}
        </a>
      </Link>
    </th>
  );
};

const TableView = ({collectionsStats}) => {
  return (
    <table>
      <thead>
        <tr className="border-y-2 border-blue-900">
          <SorterColumn prop="name">Name</SorterColumn>
          <SorterColumn prop="floorPrice">Floor Price</SorterColumn>
          <SorterColumn prop="oneDaySales">One Day Sales</SorterColumn>
          <th className="p-2 text-left">One Day Average Price</th>
          <th className="p-2 text-left">One Day Volume</th>
          <th className="p-2 text-left">24h%</th>
          <th className="p-2 text-left">7d%</th>
          <SorterColumn prop="totalVolume">Total Volume</SorterColumn>
        </tr>
      </thead>
      <tbody>
        {collectionsStats.map(collection => {
          return (
            <tr key={collection.slug} className="border-b-2 border-blue-900">
              <td className="p-3 text-left">
                <Link href={`https://opensea.io/collection/${collection.slug}`}>
                  <a target="_blank">{collection.name}</a>
                </Link>
              </td>
              <td className="p-3 text-left">{collection.floorPrice}⬙</td>
              <td className="p-3 text-left">
                {toTwoDecimalPlaces(collection.oneDaySales)}
              </td>
              <td className="p-3 text-left">
                {toTwoDecimalPlaces(collection.oneDayAveragePrice)}⬙
              </td>
              <td className="p-3 text-left">
                {toTwoDecimalPlaces(collection.oneDayVolume)}⬙
              </td>
              <td
                className={
                  collection.oneDayChange > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {toTwoDecimalPlaces(collection.oneDayChange)}%
              </td>
              <td
                className={
                  collection.sevenDayChange > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {toTwoDecimalPlaces(collection.sevenDayChange)}%
              </td>
              <td className="p-3 text-left">
                {toTwoDecimalPlaces(collection.totalVolume)}⬙
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const CardView = ({collectionsStats}) => {
  return (
    <div>
      {collectionsStats.map(collection => {
        return (
          <div key={collection.slug} className="mb-2">
            <Link href={`https://opensea.io/collection/${collection.slug}`}>
              <a target="_blank">
                <h3 className="text-xl">
                  Name: <b>{collection.name}</b>
                </h3>
              </a>
            </Link>
            <h4>
              Floor Price: <b>{collection.floorPrice}</b>
            </h4>
            <h4>
              One Day Sales: <b>{collection.oneDaySales}</b>
            </h4>
            <h4>
              One Day Average Price:{' '}
              <b>{toTwoDecimalPlaces(collection.oneDayAveragePrice)}</b>
            </h4>
            <h4>
              One Day Volume:{' '}
              <b>{toTwoDecimalPlaces(collection.oneDayVolume)}</b>
            </h4>
            <h4>
              24h %:{' '}
              <b
                className={
                  collection.oneDayChange > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {toTwoDecimalPlaces(collection.oneDayChange)}%
              </b>
            </h4>
            <h4>
              7d%:{' '}
              <b
                className={
                  collection.sevenDayChange > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {toTwoDecimalPlaces(collection.sevenDayChange)}%
              </b>
            </h4>
            <h4>
              Total Volume: <b>{toTwoDecimalPlaces(collection.totalVolume)}</b>
            </h4>
          </div>
        );
      })}
    </div>
  );
};

const ViewChanger = () => {
  const {query} = useRouter();

  return (
    <div className="my-4">
      {query?.view === 'table' ? (
        <Link
          href={{
            pathname: '/',
            query: {
              ...query,
              view: 'card',
            },
          }}
        >
          <a>Switch to Card view</a>
        </Link>
      ) : (
        <Link
          href={{
            pathname: '/',
            query: {
              ...query,
              view: 'table',
            },
          }}
        >
          <a>Switch to Table view</a>
        </Link>
      )}
    </div>
  );
};

const IndexPage = () => {
  const [collections] = useState([
    'blvckgenesis',
    'apiens-main-collection',
    'shinsekaicorp',
    'bionicapesnft',
    'footballcritter',
    'devs-for-revolution',
  ]);

  const [collectionsStats, setCollectionsStats] = useState<CollectionStats[]>(
    [],
  );

  useEffect(() => {
    fetch(`/api/collections?${collections.map(c => `name=${c}`).join('&')}`)
      .then(res => res.json())
      .then(res => {
        setCollectionsStats(res);
      });
  }, [collections]);

  const {query} = useRouter();

  const sortedCollectionStats = query?.sortBy
    ? collectionsStats.sort((a, b) => {
        const [sortProp, order] = (query.sortBy as string).split(':');

        if (sortProp === 'name') {
          if (order === 'asc') {
            return b[sortProp].localeCompare(a[sortProp]);
          } else {
            return a[sortProp].localeCompare(b[sortProp]);
          }
        }

        if (order === 'asc') {
          return b[sortProp] - a[sortProp];
        }
        return a[sortProp] - b[sortProp];
      })
    : collectionsStats;

  return (
    <Layout title="OpenSea Collection Watchlist">
      <h1 className="text-3xl font-bold underline mb-4">My Watchlist</h1>

      {collectionsStats.length > 0 && <ViewChanger />}

      {collectionsStats.length === 0 ? (
        <h2 className="text-2xl">Fetching Collection Stats...</h2>
      ) : (
        <>
          {query?.view === 'table' ? (
            <TableView collectionsStats={sortedCollectionStats} />
          ) : (
            <CardView collectionsStats={sortedCollectionStats} />
          )}
        </>
      )}
    </Layout>
  );
};

export default IndexPage;
