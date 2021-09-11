import React, {useCallback, useState} from 'react';
import UsernameInput from './components/UsernameInput'
import Matchups from './components/Matchups'

function App() {
  const [showMatchups, setShowMatchups] = useState(false);
  const [username, setUsername] = useState('');
  const enableShowMatchups = useCallback((username) => {
    setShowMatchups(true)
    setUsername(username);
  }, [setShowMatchups]);

  const renderApp = () => {
    if (!showMatchups) {
      return <UsernameInput onInputSubmit={enableShowMatchups}/>
    } else {
      return (
        <Matchups username={username}/>
      )
    }
  }

  return (
    <div className="App" style={{padding: '20px'}}>
      <h1>Sleeper Sunday Cheatsheet</h1>
      {renderApp()}
    </div>
  );
}

export default App;
