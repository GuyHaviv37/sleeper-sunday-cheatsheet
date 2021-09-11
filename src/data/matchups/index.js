import axios from 'axios';
import { bundleUserStarters, getLeaguesURLByUserId } from './utils';
export {addGameDataToStarters} from './utils';

// @param: username - string;
const fetchUserId = async (username) => {
    const userDataResponse = await axios.get(`https://api.sleeper.app/v1/user/${username}`);
    const userId = userDataResponse.data.user_id;
    return userId;
}

// @param: userId - string
export const fetchUserLeagues = async (userId) => {
    const userLeaguesResponse = await axios.get(getLeaguesURLByUserId(userId));
    const userLeagues = userLeaguesResponse.data;
    return userLeagues;
}

// @param: leagueIds - Array<string>
// @param: userId - string
const fetchUserRostersFromLeagueIds = async (leagueIds, userId) => {
    const fetchRosterPromises = leagueIds.map((leagueId) => axios.get(`https://api.sleeper.app/v1/league/${leagueId}/rosters`));
    const fetchedRostersResponse = await Promise.all(fetchRosterPromises);
    const fetchedRosters = fetchedRostersResponse.map((fetchedRosterResponse) => fetchedRosterResponse.data);
    const userRosters = fetchedRosters.map((rosters) => (rosters.filter((roster) => roster.owner_id === userId))[0]);
    return userRosters;
}

const fetchUserMatchups = async (leagueIds, rosterIds, week) => {
    const fetchMatchupPromises = leagueIds.map((leagueId) => axios.get(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`));
    const fetchMatchupResponse = await Promise.all(fetchMatchupPromises);
    const fetchedMatchups = fetchMatchupResponse.map((fetchedMatchupResponse) => fetchedMatchupResponse.data);

    const userMatchupData = fetchedMatchups.map((leagueMatchups, index) => {
        const userRosterId = rosterIds[index];
        return leagueMatchups.filter((matchup) => matchup.roster_id === userRosterId)[0];
    });
    const userMatchupIds = userMatchupData.map((userMatchup) => userMatchup.matchup_id);
    const opponentMatchupData = fetchedMatchups.map((leagueMatchups,index) => {
        const userRosterId = rosterIds[index];
        const userMatchupId = userMatchupIds[index];
        return leagueMatchups.filter((matchup) => matchup.matchup_id === userMatchupId && matchup.roster_id !== userRosterId)[0];
    });
    return [userMatchupData, opponentMatchupData];
}

export const fetchStartersData = async (username, week) => {
    const userId = await fetchUserId(username);

    const userLeagues = await fetchUserLeagues(userId);
    const userLeaguesNames = userLeagues.map((league) => league.name);
    const userLeaguesIds = userLeagues.map((league) => league.league_id);

    const userRosters = await fetchUserRostersFromLeagueIds(userLeaguesIds, userId);
    const userRostersIds = userRosters.map((roster) => roster.roster_id);

    const [userMatchupsFull, opponentMatchupsFull] = await fetchUserMatchups(userLeaguesIds, userRostersIds, week);
    return [bundleUserStarters(userLeaguesNames, userMatchupsFull), bundleUserStarters(userLeaguesNames, opponentMatchupsFull)]
}