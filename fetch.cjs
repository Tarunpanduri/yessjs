(async () => {
  try {
    const response = await fetch('https://Tarunpanduri.github.io/watchtogether/data.json');

    // Log response details
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));

    const text = await response.text(); // Get raw response
    console.log('Raw Response:', text); // Log raw response

    const json = JSON.parse(text); // Try to parse JSON
    console.log('JSON Data:', json);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
