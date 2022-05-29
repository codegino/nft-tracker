import {useEffect, useState} from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

type CollectionStats = {
  name: string;
  floorPrice: string;
  oneDaySales: string;
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

const IndexPage = () => {
  const [collections] = useState([
    'blvckgenesis',
    'apiens-main-collection',
    'shinsekaicorp',
    'bionicapesnft',
    'footballcritter',
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

  return (
    <Layout title="OpenSea floor price">
      <h1 className="text-3xl font-bold underline mb-4">My Watchlist</h1>
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
                Total Volume:{' '}
                <b>{toTwoDecimalPlaces(collection.totalVolume)}</b>
              </h4>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default IndexPage;
