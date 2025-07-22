// api/planes.js
import fetch from 'node-fetch';

const OPEN_SKY_USER = process.env.OPEN_SKY_USER;
const OPEN_SKY_PASS = process.env.OPEN_SKY_PASS;

export default async (req, res) => {
  const { lamin, lomin, lamax, lomax } = req.query;
  if (!lamin || !lomin || !lamax || !lomax) {
    res.status(400).json({ error: 'Missing bounding box parameters' });
    return;
  }

  const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;
  const auth = 'Basic ' + Buffer.from(`${OPEN_SKY_USER}:${OPEN_SKY_PASS}`).toString('base64');

  try {
    const openSkyRes = await fetch(url, {
      headers: { Authorization: auth }
    });

    if (!openSkyRes.ok) {
      res.status(openSkyRes.status).json({ error: 'OpenSky API error' });
      return;
    }

    const data = await openSkyRes.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (err) {
    console.error('Proxy fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
