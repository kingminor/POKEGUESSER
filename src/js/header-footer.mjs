
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
            <div class="dropdown">
                <button class="dropbtn">
                    <img src="./media/blankpfp.jpg" alt="profile-picture">
                </button>
                <div id="myDropdown" class="dropdown-content">
                    <a href="#profile">Profile</a>
                    <a href="#stats">Stats</a>
                    <a href="#contact">Contact</a>
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
    `;
}
