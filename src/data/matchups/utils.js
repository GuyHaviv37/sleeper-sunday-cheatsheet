import playersData from '../playersData.json';
const SPORT = 'nfl';
const SEASON = '2021';

export const getLeaguesURLByUserId = (userId) => `https://api.sleeper.app/v1/user/${userId}/leagues/${SPORT}/${SEASON}`;

const decodeStarters = (starters) => {
    return starters.map((starter) => {
        const starterData = playersData[starter];
        if (starterData) {
            const starterName = starterData.full_name ?? starterData.team
            return {
                fullName: starterName,
                position: starterData.position,
                team: starterData.team
            }
        } else {
            return {
                fullName: 'Empty',
                position: 'N/A',
                team: 'N/A'
            }
        }
    })
}

export const bundleUserStarters = (leagueNames, userMatchups) => {
    const result = {};
    // can use reduce instead
    leagueNames.forEach((leagueName, index) => {
        result[leagueName] = {
            starters: decodeStarters(userMatchups[index].starters)
        }
    })
    return result;
}

export const addGameDataToStarters = (userStarters, teamData) => {
    for (const [leagueName, leagueObj] of Object.entries(userStarters)) {
        for (const starter of leagueObj.starters) {
            starter.leagueName = leagueName;
            if (starter.team !== 'N/A') {
                starter.gameDate = teamData[starter.team]?.gameDate;
                starter.opponentString = teamData[starter.team]?.opponentString;
            }
        }
    }
}
