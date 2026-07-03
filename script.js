// --- Configuration ---
// Paste your Web App URL here after publishing your Google Apps Script
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz2afbRX3WyqFvpuMrYSj5ec1Fj990s_ZfzHxfpSqBXUVVVv0bjhvvCwu5v8eHnTMBy/exec";

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. DOM Access Methods ---
    // Accessing elements by ID
    const form = document.getElementById("registrationForm");
    const searchBar = document.getElementById("searchBar");
    const clearBtn = document.getElementById("clearFiltersBtn");
    const formStatus = document.getElementById("formStatus");
    const emailError = document.getElementById("emailError");
    
    // Accessing elements by Tag Name/Query Selector for groups
    const directoryGrid = document.getElementById("directoryGrid");

    // --- 2. Live Filtering Functionality (Control Structures & Loops) ---
    searchBar.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        
        // Dynamic Node selection using QuerySelectorAll
        const cards = document.querySelectorAll(".card");
        
        // Loop structure iterating over DOM elements
        cards.forEach(card => {
            const subject = card.getAttribute("data-subject").toLowerCase();
            
            // Conditional control flow to toggle visibility
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

    // --- 3. Form Submission & Validation (Control Flow & Async Fetch) ---
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Extracting form data using value property
        const name = document.getElementById("fullName").value.trim();
        const email = document.getElementById("studentEmail").value.trim();
        const dept = document.getElementById("department").value;
        const subject = document.getElementById("subject").value.trim();
        const role = document.getElementById("role").value;

        // Reset error styling
        emailError.textContent = "";

        // Control Structure: Validation Check
        if (!email.endsWith(".edu")) {
            emailError.textContent = "Registration requires a valid institutional email ending in '.edu'.";
            return;
        }

        // Displaying a processing message to the user
        formStatus.style.display = "block";
        formStatus.style.backgroundColor = "#e2e8f0";
        formStatus.style.color = "#333";
        formStatus.style.border = "1px solid #cbd5e1";
        formStatus.textContent = "Sending registration details to database...";

        // Preparing payload structure
        const payload = { name, email, dept, subject, role };

        try {
            // Forwarding structured data directly to Google Apps Script Endpoint
            const response = await fetch(APPS_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors", // Required bypassing for Google Script Macro web configurations
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            // Dynamically updating UI to reflect successful transmission
            formStatus.style.backgroundColor = "#d1fae5";
            formStatus.style.color = "#065f46";
            formStatus.style.border = "1px solid #a7f3d0";
            formStatus.textContent = "Success! Your registration is officially recorded.";
            
            // DOM Manipulation: Dynamically append the new card to the UI immediately
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

    // Helper function demonstrating programmatic DOM node creation and styling mapping
    function appendNewCard(data) {
        const card = document.createElement("div");
        const lowerDept = data.dept.toLowerCase();
        
        card.className = `card ${lowerDept}`;
        card.setAttribute("data-subject", data.subject);
        card.setAttribute("data-dept", data.dept);

        // Control structure assigning localized badges
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