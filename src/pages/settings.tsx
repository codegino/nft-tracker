import {useEffect, useState} from 'react';
import Layout from '../components/Layout';

const SettingsPage = () => {
  const [collections, setCollections] = useState<string[]>([]);

  useEffect(() => {
    const parseCollections = JSON.parse(
      window.localStorage.getItem('collections') ?? '[]',
    );

    setCollections(parseCollections);
  }, []);

  const [itemToAdd, setItemToAdd] = useState('');

  const isItemAlreadyExisting = collections.includes(itemToAdd.trim());

  const handleAddItem = () => {
    if (!isItemAlreadyExisting) {
      const newCollections = [...collections, itemToAdd.trim()];

      window.localStorage.setItem(
        'collections',
        JSON.stringify(newCollections),
      );

      setCollections(newCollections);

      setItemToAdd('');
    }
  };

  const handleRemoveItem = value => {
    const newCollections = collections.filter(c => c !== value.trim());

    window.localStorage.setItem('collections', JSON.stringify(newCollections));

    setCollections(newCollections);
  };

  return (
    <Layout title="OpenSea floor price">
      <h1 className="text-3xl font-bold underline mb-4">Settings</h1>

      <h2>Collections</h2>
      {collections.map(c => (
        <div className="flex gap-10" key={c}>
          <p>{c}</p>
          <button onClick={() => handleRemoveItem(c)}>x</button>
        </div>
      ))}

      <div className="flex gap-2">
        <input
          className="border-2 border-black"
          value={itemToAdd}
          onChange={e => setItemToAdd(e.target.value)}
        />
        <button
          onClick={handleAddItem}
          disabled={isItemAlreadyExisting}
          className={
            isItemAlreadyExisting
              ? 'cursor-not-allowed text-gray-400'
              : 'cursor-pointer'
          }
        >
          Add to Collection
        </button>
      </div>
    </Layout>
  );
};

export default SettingsPage;
