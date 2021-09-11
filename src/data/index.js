import { getWeeklySchedule, getWeekTimeSlots, mapTeamData, getCurrentWeek } from './schedule';
import { fetchStartersData, addGameDataToStarters } from './matchups';


const getStartersByTimeSlot = (starters) => {
    const result = {};
    for (const leagueObj of Object.values(starters)) {
        const leagueStarters = leagueObj.starters;
        for (const leagueStarter of leagueStarters) {
            if (!result[leagueStarter.gameDate]) {
                result[leagueStarter.gameDate] = [];
            }
            const starterIndex = result[leagueStarter.gameDate].findIndex(starter => starter.fullName === leagueStarter.fullName);
            if (starterIndex >= 0) {
                const previousLeagues = result[leagueStarter.gameDate][starterIndex].leagueName
                const isPreviousLeagueString = typeof previousLeagues === 'string';
                result[leagueStarter.gameDate][starterIndex] = {
                    ...result[leagueStarter.gameDate][starterIndex],
                    times: (result[leagueStarter.gameDate][starterIndex].times + 1),
                    leagueName: isPreviousLeagueString ? [previousLeagues, leagueStarter.leagueName] : [...previousLeagues, leagueStarter.leagueName]
                }
            } else {
                result[leagueStarter.gameDate].push({
                    ...leagueStarter,
                    times: 1
                })
            }
        }
    }
    return result;
}

export const buildStartersData = async (username) => {
    try {
        const week = getCurrentWeek();
        const gamesData = await getWeeklySchedule(week); //@TODO : merge await with fetchData
        const weekTimeSlots = getWeekTimeSlots(gamesData);
        const teamsData = mapTeamData(gamesData);
        const [userStarters, opponentStarters] = await fetchStartersData(username, week);
        addGameDataToStarters(userStarters, teamsData);
        addGameDataToStarters(opponentStarters, teamsData);
        const userStartersByTime = getStartersByTimeSlot(userStarters);
        console.log(userStartersByTime);
        const opponentStartersByTime = getStartersByTimeSlot(opponentStarters);
        return {userStartersByTime, opponentStartersByTime, weekTimeSlots}
    } catch (err) {
        console.error(err);
    }
}
