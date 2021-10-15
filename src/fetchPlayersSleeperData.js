const fs = require('fs');
const axios = require('axios').default;

axios.get('https://api.sleeper.app/v1/players/nfl').then((res) => {
    const playerData = res.data;
    fs.writeFile('playersData.json', JSON.stringify(playerData), 'utf8', (err) => console.error(err));
}).catch((err) => console.error(err));

