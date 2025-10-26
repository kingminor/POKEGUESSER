
export function setHeaderFooter() {
    setHeader();
    setFooter();
}

function setHeader() {
    document.getElementsByTagName('header')[0].innerHTML = `
        <div id="left-header">
            <img src="./media/404-not-found.jpg" alt="PokeGuesser Logo">
            <p>POKÉGUESSER</p>
        </div>
        <nav id="right-header">
            <a href="index.html">Home</a>
            <a href="leaderboard.html">Leaderboard</a>
            <button id="pfp-button">
                <img src="./media/blankpfp.jpg" alt="profile-picture">
            </button>
        </nav>
    `;
}

function setFooter() {
    document.getElementsByTagName('footer')[0].innerHTML = `
    
    `;
}
