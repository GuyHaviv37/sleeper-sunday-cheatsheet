import React, {useState} from 'react';

const UsernameInput = (props) => {
    const [usernameInput, setUsernameInput] = useState('');
    const onInputChange = (e) => setUsernameInput(e.currentTarget.value);

    return (
        <div>
            <label>Username: </label>
            <input type="text" placeholder="Enter Username..." value={usernameInput} onChange={onInputChange}/>
            <button onClick={() => props.onInputSubmit(usernameInput)}>Submit</button>
        </div>

    )
}

export default UsernameInput;