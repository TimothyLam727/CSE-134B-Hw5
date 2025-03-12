class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Create card structure
        this.card = document.createElement('div');
        this.card.classList.add('card');

        this.styleElement = document.createElement('style');
        this.styleElement.textContent = `
            .card {
                width: 50vw;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin: 30px 0;
                padding: 10px;

                border-radius: 5px;
                background:rgb(206, 205, 205);
                box-shadow: 0px 2px 5px rgba(0,0,0,0.1);
            }
            h2 {
                font-size: 1.5em;
                margin-bottom: 5px;
                justify-self: center;
                text-align: center;
            }


            img {
                width: 20vw;
                border-radius: 8px;
                margin-bottom: 10px;
            }
            #description {
                width: 80%;
                text-align: center;
            }
            a {
                display: inline-block;
                text-decoration: none;
                color: blue;
                font-weight: bold;
                margin-top: 10px;
                transition: transform 0.2s ease-in-out;
            }

            a:hover {
                cursor: pointer;
                transition: transform 0.2s ease-in-out;
                transform: scale(1.2);
            }
        `;

        // Attach elements but don't populate yet
        this.shadowRoot.append(this.styleElement, this.card);
    }

    static get observedAttributes() {
        return ['title', 'date', 'language', 'image', 'description', 'link'];
    }

    connectedCallback() {
        this.render(); // Now attributes are available
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const title = this.getAttribute('title') || "Untitled Project";
        const date = this.getAttribute('date') || "Unknown Date";
        const language = this.getAttribute('language') || "Not Specified";
        const image = this.getAttribute('image') || "";
        const description = this.getAttribute('description') || "No Description";
        const link = this.getAttribute('link') || "#";

        this.card.innerHTML = `
            <h2>${title}</h2>
            <p>${date} | <code>${language}</code></p>
            ${image ? `<picture><img src="${image}" alt="${title}" loading="lazy"></picture>` : ""}
            <p id="description">${description}</p>
            <a href="${link}" target="_blank">More Info</a>
        `;
    }

    setProjectData(project) {
        Object.keys(project).forEach(attr => {
            this.setAttribute(attr, project[attr]);
        });
        this.render(); // Call render() directly to update the UI
    }
}

customElements.define('project-card', ProjectCard);

// fetch data from projects.json and populate project cards
document.addEventListener("DOMContentLoaded", () => {
    fetch('src/json/projects.json')
        .then(response => response.json())
        .then(data => {
            const projectsSection = document.querySelector('#projects');

            // check if projectsSection is correctly loaded
            if (!projectsSection) {
                console.error("Error: #projects element not found.");
                return;
            }

            projectsSection.innerHTML = '';

            // loop through each project in projects.json
            data.forEach(proj => {
                const projectCard = document.createElement('project-card');

                // set attributes
                projectCard.setAttribute('title', proj.title);
                projectCard.setAttribute('date', proj.date);
                projectCard.setAttribute('language', proj.language);
                projectCard.setAttribute('image', proj.image);
                projectCard.setAttribute('description', proj.description);
                projectCard.setAttribute('link', proj.link);

                projectsSection.appendChild(projectCard);
            });
        })
        .catch(error => console.error('Error loading project data:', error));
});


document.addEventListener("DOMContentLoaded", () => {
    const localButton = document.getElementById('load-local');
    const remoteButton = document.getElementById('load-remote');
    const addProjectButton = document.getElementById('add-project'); // Button to manually add a project
    const projectsContainer = document.getElementById('projects');

    if (!projectsContainer) {
        console.error("Error: #projects element not found.");
        return;
    }

    // JSONBin API Setup (Replace with your actual Bin ID)
    const JSON_BIN_URL = "https://api.jsonbin.io/v3/b/67d122b78561e97a50ea5abc"; 
    const JSON_BIN_API_KEY = "$2a$10$mM/.ab43yXi2hGi/tkCIUe8WIXKnASwxlLl57IrvDipmDRL34KLyi"; 

    // Function to create a new project-card using render()
    function addProjectCard(project) {
        const projectCard = document.createElement('project-card');
        projectCard.setProjectData(project); // Directly uses render()
        projectsContainer.appendChild(projectCard);
    }

    // Dummy Data for LocalStorage
    const localProjects = [
        {
            "title": "Local Project 1",
            "date": "2024",
            "language": "JavaScript",
            "image": "local1.jpg",
            "description": "This project is loaded from localStorage.",
            "link": "https://example.com/local1"
        },
        {
            "title": "Local Project 2",
            "date": "2023",
            "language": "Python",
            "image": "local2.jpg",
            "description": "Another localStorage project.",
            "link": "https://example.com/local2"
        }
    ];

    // Load LocalStorage Data
    localButton.addEventListener("click", () => {
        console.log("Loading local projects...");

        if (!localStorage.getItem("projects")) {
            localStorage.setItem("projects", JSON.stringify(localProjects));
        }

        const savedProjects = JSON.parse(localStorage.getItem("projects"));
        projectsContainer.innerHTML = ''; // Clear before adding new cards
        savedProjects.forEach(addProjectCard); // Use the new function
    });

    // Load Remote Data from JSONBin
    remoteButton.addEventListener("click", () => {
        console.log("Fetching remote projects from JSONBin...");

        fetch(JSON_BIN_URL, {
            method: "GET",
            headers: {
                "X-Master-Key": JSON_BIN_API_KEY,
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            projectsContainer.innerHTML = ''; // Clear before adding new cards
            data.record.forEach(addProjectCard); // Use the new function
        })
        .catch(error => console.error('Error fetching remote data:', error));
    });
});