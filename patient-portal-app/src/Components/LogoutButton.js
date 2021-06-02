import React from 'react';

function LogoutButton() {
    
    const handleLogOut = () => window.location.href="http://localhost:5000/logout";

    return <button onClick={handleLogOut}>Log out</button>
}

export default LogoutButton;