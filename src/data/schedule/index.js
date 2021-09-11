import axios from 'axios';
const WEEK_END_DATES = ["09/14/2021","09/21/2021","09/28/2021","10/05/2021","10/12/2021","10/19/2021","10/26/2021","11/02/2021","11/09/2021","11/16/2021",
    "11/23/2021","11/30/2021","12/07/2021","12/14/2021","12/21/2021","12/28/2021","01/04/2022","01/11/2022"];

export const getCurrentWeek = () => {
    const today = Date.now();
    return WEEK_END_DATES.findIndex(weekEndDate => today < (new Date(weekEndDate).valueOf())) + 1;
}

const teamAbbTranslate = (teamAbb) => {
    if (teamAbb === 'WSH') return 'WAS';
    return teamAbb;
}

export const getWeeklySchedule = async (week) => {
    const response = await axios.get(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?seasontype=2&week=${week}`);
    const espnWeeklyData = response.data;
    const games = espnWeeklyData.events.map((event) => {
        const competitors = event.competitions[0].competitors;
        const team1 = {
            teamName: teamAbbTranslate(competitors[0].team.abbreviation),
            homeAway: competitors[0].homeAway,
        };
        const team2 = {
            teamName: teamAbbTranslate(competitors[1].team.abbreviation),
            homeAway: competitors[1].homeAway,
        }
        return {
            date: (new Date(event.date)).toUTCString(), //@TODO: maybe change to locale (toString) ?
            team1,
            team2
        };
    });
    return games;
}

export const getWeekTimeSlots = (gamesData) => {
    const timeSlots = gamesData.map(dataObj => dataObj.date);
    let lastNewTimeSlot = timeSlots[0];
    return timeSlots.reduce((timeSlots, newTimeSlot) => {
        if (newTimeSlot === lastNewTimeSlot) return timeSlots;
        else {
            lastNewTimeSlot = newTimeSlot;
            return [...timeSlots, newTimeSlot];
        }
    }, [timeSlots[0]])
}

const computeOpponentString = (forTeam, againstTeam) => {
    return forTeam.homeAway === 'home' ? `vs. ${againstTeam.teamName}` : `@${againstTeam.teamName}`;
}

export const mapTeamData = (gamesData) => {
    const teams = {};
    for (const game of gamesData) {
        const {team1, team2, date} = game;
        teams[team1.teamName] = {
            gameDate: date,
            opponentString: computeOpponentString(team1, team2)
        };
        teams[team2.teamName] = {
            gameDate: date,
            opponentString: computeOpponentString(team2, team1)
        };
    }
    return teams;
}