
export function setHeaderFooter() {
    setHeader();
    setFooter();
}

function setHeader() {
    document.getElementsByTagName('header')[0].innerHTML = `
        <div id="logo-menu-row">
        <a href="./index.html" class="left-header-link">
            <div id="left-header">
                <img src="./media/404-not-found.jpg" alt="PokeGuesser Logo">
                <p>POKÉGUESSER</p>
            </div>
        </a>
            <button id="nav-drop">Menu</button>
        </div>
        <nav id="right-header" class="closed">
            <a href="index.html">Home</a>
            <a href="leaderboard.html">Leaderboard</a>
            <div class="dropdown">
                <button class="dropbtn">
                    <img src="./media/blankpfp.jpg" alt="profile-picture">
                </button>
                <div id="myDropdown" class="dropdown-content">
                    <a href="./stats.html">Stats</a>
                    <a href="./contact.html">Contact</a>
                    <div class="switch-container">
                        <span>Animate Background</span>
                        <label class="switch">
                            <input type="checkbox" id="toggle-animations" checked>
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>
        </nav>
    `;

    document.getElementById('nav-drop').addEventListener('click', ()=> {
        document.getElementById('right-header').classList.toggle('closed');
    });

    const dropbtn = document.querySelector(".dropbtn");
    const dropdown = document.getElementById("myDropdown");
    const toggleAnimations = document.getElementById("toggle-animations");
    const slidingBackground = document.querySelector("#sliding-background");

    if(localStorage.getItem("animateBackground") === null)
    {
        localStorage.setItem("animateBackground", "true");
    }

    // Checks if background should be animated.
    if(localStorage.getItem("animateBackground") === "true")
    {
        toggleAnimations.checked = true;
        slidingBackground.classList.add("sliding-background");
    }
    else 
    {
        toggleAnimations.checked = false;
        slidingBackground.classList.remove("sliding-background");
    }

    // Dropdown toggle
    dropbtn.addEventListener("click", function(event) {
        event.stopPropagation();
        dropdown.classList.toggle("show");
    });

    // Hide dropdown if user clicks anywhere else on the screen.
    document.addEventListener("click", function(event) {
        if (!dropdown.contains(event.target) && !dropbtn.contains(event.target)) {
            dropdown.classList.remove("show");
        }
    });

    // Background animation toggle
    toggleAnimations.addEventListener("click", function() {
        if (toggleAnimations.checked) {
            slidingBackground.classList.add("sliding-background");
            localStorage.setItem("animateBackground", "true");
        } else {
            slidingBackground.classList.remove("sliding-background");
            localStorage.setItem("animateBackground", "false");
        }
    });
}

function setFooter() {
    document.getElementsByTagName('footer')[0].innerHTML = `
        <p>This is a student project.</p>
        <p>All Pokémon and Pokémon character names are trademarks of The Pokémon Company International.</p>
        <p>© 2025 Christian Haroldsen & Michael Brightman. All rights reserved.</p>
    `;
}
