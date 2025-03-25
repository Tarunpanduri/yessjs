import React, { useEffect, useState } from 'react';

const Home = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/message')
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Error fetching message:', error));
  }, []);

  return (
    <div>
      <h1>Welcome to {message}</h1>
      <p>Message from API: {message}</p>
    </div>
  );
};

export default Home;
