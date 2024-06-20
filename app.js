const express = require('express');
const axios = require('axios');

const app = express();
const port = 9876;

const WINDOW_SIZE = 10;
const TIMEOUT_THRESHOLD = 2000;

let storedNumbers = [];
let windowState = [];
let average = 0.0;

const data = {
    "companyName":"Affordmed",
    "clientID":"fbd1e3f5-621f-41ee-baa7-26ca8aa2e229",
    "clientSecret":"rURuyISirUEFIXHC",
    "ownerName":"Gummadavelly Srirag",
    "ownerEmail":"2110039472cse@gmail.com",
    "rollNo":"2110039472"
};

async function fetchNumbers(type) {
  const baseUrl = 'http://20.244.56.144/test/';
  const url = baseUrl + (type === 'p' ? 'primes' : type === 'f' ? 'fibo' : type === 'e' ? 'even' : 'rand');

  try {
    const response = await axios.get(url, { 
      timeout: TIMEOUT_THRESHOLD,
      headers: {
        'Authorization': `Bearer ${data.clientID}:${data.clientSecret}`
      }
    });
    if (response.status === 200) {
      return response.data.numbers || [];
    } else {
      throw new Error(`Failed to fetch numbers. Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching numbers:', error.message);
    return [];
  }
}

app.get('/numbers/:numberid', async (req, res) => {
  const numberid = req.params.numberid;

  try {
    const numbers = await fetchNumbers(numberid);

    storedNumbers = [...storedNumbers, ...numbers].slice(-WINDOW_SIZE);
    windowState = storedNumbers.slice(-WINDOW_SIZE);
    average = windowState.reduce((acc, num) => acc + num, 0) / windowState.length;

    res.json({
      windowPrevState: windowState,
      windowCurrState: storedNumbers,
      numbers: numbers,
      avg: average.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});