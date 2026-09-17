const defaultTickets = [
    { ticketNumber: 999, name: "Ola Nordmann", email: "ola@bedrift.no", category: "Maskinvare", priority: "Høy", description: "Skjermen blinker konstant.", status: "Under behandling" },
    { ticketNumber: 1000, name: "Kari Nordmann", email: "kari@bedrift.no", category: "Tilganger", priority: "Lav", description: "Glemt passord til intranett.", status: "Lukket" }
];

let supportTickets = JSON.parse(localStorage.getItem('supportTickets')) || defaultTickets;

let nextTicketNumber = supportTickets.length > 0 
    ? Math.max(...supportTickets.map(t => t.ticketNumber)) + 1 
    : 1001;

const helpdeskForm = document.getElementById('helpdesk-form');
const confirmationDiv = document.getElementById('confirmation-message');
const tableBody = document.getElementById('tickets-table-body');
const searchInput = document.getElementById('search-input');
const filterStatus = document.getElementById('filter-status');
const themeToggle = document.getElementById('theme-toggle');

function renderTickets() {
    tableBody.innerHTML = "";
    
    const searchTerm = searchInput.value.toLowerCase();
    const selectedStatus = filterStatus.value;

    supportTickets.forEach(ticket => {
        const matchesSearch = ticket.description.toLowerCase().includes(searchTerm) || 
                              ticket.name.toLowerCase().includes(searchTerm);
        const matchesStatus = selectedStatus === "Alle" || ticket.status === selectedStatus;

        if (matchesSearch && matchesStatus) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>#${ticket.ticketNumber}</strong></td>
                <td>${ticket.name}</td>
                <td>${ticket.category}</td>
                <td>${ticket.description}</td>
                <td><span class="badge badge-${ticket.priority.toLowerCase()}">${ticket.priority}</span></td>
                <td><span class="status-${ticket.status.toLowerCase().replace(/ /g, "-")}">${ticket.status}</span></td>
            `;
            tableBody.appendChild(row);
        }
    });
}

helpdeskForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const newTicket = {
        ticketNumber: nextTicketNumber,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        category: document.getElementById('category').value,
        priority: document.getElementById('priority').value,
        description: document.getElementById('description').value,
        status: "Åpen"
    };

    supportTickets.push(newTicket);
    
    localStorage.setItem('supportTickets', JSON.stringify(supportTickets));
    renderTickets();

    confirmationDiv.innerHTML = `
        <div style="background-color: #ecfdf5; border: 1px solid #10b981; color: #065f46; padding: 15px; border-radius: 6px; margin-top: 20px;">
            <strong>Sak registrert! Saksnummer: #${newTicket.ticketNumber}</strong>
        </div>
    `;

    nextTicketNumber++;
    helpdeskForm.reset();
});

searchInput.addEventListener('input', renderTickets);
filterStatus.addEventListener('change', renderTickets);

const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = "☀️ Lyst modus";
}

themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = "🌙 Mørk modus";
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = "☀️ Lyst modus";
    }
});

renderTickets();
