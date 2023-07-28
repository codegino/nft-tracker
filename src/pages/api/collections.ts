import {NextApiRequest, NextApiResponse} from 'next';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const collections = _req.query.name;

    const options: RequestInit = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-API-KEY': process.env.OPENSEA_API as string,
      },
    };

    let collectionsStats = [];

    for (const iterator of collections) {
      await fetch(`https://api.opensea.io/collection/${iterator}`, options)
        .then(response => response.json())
        .then(response => {
          const collection = response.collection;

          collectionsStats.push({
            name: collection.name,
            slug: collection.slug,
            floorPrice: collection.stats.floor_price,
            oneDaySales: collection.stats.one_day_sales,
            oneDayChange: collection.stats.one_day_change,
            oneDayVolume: collection.stats.one_day_volume,
            oneDayAveragePrice: collection.stats.one_day_average_price,
            sevenDaySales: collection.stats.seven_day_sales,
            sevenDayAveragePrice: collection.stats.seven_day_average_price,
            totalVolume: collection.stats.total_volume,
            sevenDayChange: collection.stats.seven_day_change,
          });
        });
    }

    res.status(200).json(collectionsStats);
  } catch (err: any) {
    res.status(500).json({statusCode: 500, message: err.message});
  }
};

export default handler;
