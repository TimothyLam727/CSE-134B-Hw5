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

    connectedCallback() {
        this.render(); // Now attributes are available
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
}

customElements.define('project-card', ProjectCard);

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
})