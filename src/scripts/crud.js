document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("project-form");
    const projectsContainer = document.getElementById("projects-container");
    let projects = JSON.parse(localStorage.getItem("projects")) || [];

    // Function to render all projects
    function renderProjects() {
        projectsContainer.innerHTML = ""; // Clear existing projects

        projects.forEach((proj, index) => {
            const projectCard = document.createElement("project-card");
            projectCard.setAttribute("title", proj.title);
            projectCard.setAttribute("date", proj.date);
            projectCard.setAttribute("language", proj.language);
            projectCard.setAttribute("image", proj.image);
            projectCard.setAttribute("description", proj.description);
            projectCard.setAttribute("link", proj.link);

            // Add Edit & Delete buttons
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", () => editProject(index));

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => deleteProject(index));

            const actionsDiv = document.createElement("div");
            actionsDiv.appendChild(editButton);
            actionsDiv.appendChild(deleteButton);

            const cardWrapper = document.createElement("div");
            cardWrapper.appendChild(projectCard);
            cardWrapper.appendChild(actionsDiv);

            projectsContainer.appendChild(cardWrapper);
        });
    }

    // Function to handle form submission (Add/Edit)
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const date = document.getElementById("date").value;
        const language = document.getElementById("language").value;
        const image = document.getElementById("image").value;
        const description = document.getElementById("description").value;
        const link = document.getElementById("link").value;
        const editIndex = document.getElementById("edit-index").value;

        const project = { title, date, language, image, description, link };

        if (editIndex) {
            // Update existing project
            projects[editIndex] = project;
        } else {
            // Add new project
            projects.push(project);
        }

        localStorage.setItem("projects", JSON.stringify(projects));
        renderProjects();
        form.reset(); // Clear form
        document.getElementById("edit-index").value = ""; // Reset edit index
    });

    // Function to edit a project
    function editProject(index) {
        const project = projects[index];
        document.getElementById("title").value = project.title;
        document.getElementById("date").value = project.date;
        document.getElementById("language").value = project.language;
        document.getElementById("image").value = project.image;
        document.getElementById("description").value = project.description;
        document.getElementById("link").value = project.link;
        document.getElementById("edit-index").value = index;
    }

    // Function to delete a project
    function deleteProject(index) {
        projects.splice(index, 1);
        localStorage.setItem("projects", JSON.stringify(projects));
        renderProjects();
    }

    // Initial render
    renderProjects();
});
