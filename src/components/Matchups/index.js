import React, {useState, useEffect} from 'react';
import {buildStartersData} from '../../data';

const Matchups = (props) => {
    const {username} = props;
    const [isLoading, setIsLoading] = useState(true);
    const [userMatchups, setUserMatchups] = useState();
    const [opponentMatchups, setOpponentMatchups] = useState();
    const [weekTimeSlots, setWeekTimeSlots] = useState();

    useEffect(() => {
        const fetchMathcups = async () => {
            const {userStartersByTime, opponentStartersByTime, weekTimeSlots: fetchedWeekTimeSlots} = await buildStartersData(username);
            setUserMatchups(userStartersByTime);
            setOpponentMatchups(opponentStartersByTime);
            setWeekTimeSlots(fetchedWeekTimeSlots);
            setIsLoading(false);
        };
        fetchMathcups().catch(err => console.error(err));
    }, [username]);

    const getPlayerPrintString = (playerObj) => {
        const {fullName, position, team, opponentString, times, leagueName} = playerObj;
        const teamString = team !== fullName ? `, ${team} -` : '';
        const timesString = times > 1 ? `(X${times})` : '';
        return `${position}  ${fullName}${teamString} ${opponentString} ${timesString} [${leagueName}]`
    }

    const renderStarters = (starters) => {
        if (!starters) return null;
        return (
            <div>
                {starters.map((starter) => {
                    return (
                        <div key={starter.fullName}>
                            {getPlayerPrintString(starter)}
                        </div>
                    )
                })}
            </div>
        )
    }

    const renderMatchups = () => {
        return (
            <div>
                {weekTimeSlots.map((timeSlot) => {
                    return (
                        <div key={timeSlot}>
                            <h3>{timeSlot}</h3>
                            <div style={{display: 'flex'}}>
                                <div style={{minWidth: '350px'}}>
                                    <strong>You:</strong>
                                    {renderStarters(userMatchups[timeSlot])}
                                </div>
                                <div style={{paddingLeft: '20px'}}>
                                    <strong>Opponent:</strong>
                                    {renderStarters(opponentMatchups[timeSlot])}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    return !isLoading ? (
        <div>
            {renderMatchups()}
        </div>
    ) : (
        <div>
            Loading...
        </div>
    )
}

export default React.memo(Matchups);