
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz2afbRX3WyqFvpuMrYSj5ec1Fj990s_ZfzHxfpSqBXUVVVv0bjhvvCwu5v8eHnTMBy/exec";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registrationForm");
    const searchBar = document.getElementById("searchBar");
    const clearBtn = document.getElementById("clearFiltersBtn");
    const formStatus = document.getElementById("formStatus");
    const emailError = document.getElementById("emailError");
    const directoryGrid = document.getElementById("directoryGrid");

    searchBar.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        
        const cards = document.querySelectorAll(".card");
        
        cards.forEach(card => {
            const subject = card.getAttribute("data-subject").toLowerCase();
            
            if (subject.includes(query)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });

    clearBtn.addEventListener("click", () => {
        searchBar.value = "";
        const cards = document.querySelectorAll(".card");
        cards.forEach(card => card.style.display = "block");
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const name = document.getElementById("fullName").value.trim();
        const email = document.getElementById("studentEmail").value.trim();
        const dept = document.getElementById("department").value;
        const subject = document.getElementById("subject").value.trim();
        const role = document.getElementById("role").value;

        emailError.textContent = "";

        if (!email.endsWith(".edu")) {
            emailError.textContent = "Registration requires a valid institutional email ending in '.edu'.";
            return;
        }

        formStatus.style.display = "block";
        formStatus.style.backgroundColor = "#e2e8f0";
        formStatus.style.color = "#333";
        formStatus.style.border = "1px solid #cbd5e1";
        formStatus.textContent = "Sending registration details to database...";

        const payload = { name, email, dept, subject, role };

        try {
            const response = await fetch(APPS_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            formStatus.style.backgroundColor = "#d1fae5";
            formStatus.style.color = "#065f46";
            formStatus.style.border = "1px solid #a7f3d0";
            formStatus.textContent = "Success! Your registration is officially recorded.";
            
            appendNewCard(payload);
            
            form.reset();

        } catch (error) {
            formStatus.style.backgroundColor = "#fee2e2";
            formStatus.style.color = "#991b1b";
            formStatus.style.border = "1px solid #fecaca";
            formStatus.textContent = "Transmission failed. Check script configuration endpoint.";
            console.error("Submission error details: ", error);
        }
    });

    function appendNewCard(data) {
        const card = document.createElement("div");
        const lowerDept = data.dept.toLowerCase();
        
        card.className = `card ${lowerDept}`;
        card.setAttribute("data-subject", data.subject);
        card.setAttribute("data-dept", data.dept);

        let badgeClass = "stem-badge";
        if (data.dept === "Business") badgeClass = "business-badge";
        if (data.dept === "Humanities") badgeClass = "humanities-badge";

        card.innerHTML = `
            <h3>${data.subject.toUpperCase()}</h3>
            <p><strong>Type:</strong> ${data.role}</p>
            <p><strong>Contact:</strong> ${data.email}</p>
            <span class="badge ${badgeClass}">${data.dept}</span>
        `;
        
        directoryGrid.appendChild(card);
    }
});
