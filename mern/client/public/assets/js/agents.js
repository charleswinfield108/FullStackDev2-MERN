document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("agents-tbody");
    const regionFilterOptions = document.getElementById("regionFilterOptions");
    const regionFilterArrow = document.getElementById("regionFilterArrow");
    const sortHeaders = document.querySelectorAll(".sortable-header");
    let agents = [];
    let filteredAgents = [];
    let currentRegion = ""; // "" means ALL
    let currentSort = { key: null, asc: true };

    // Fetch agents and initialize
    fetch("http://99.79.77.144:3000/api/agents")
        .then(res => res.json())
        .then(data => {
            agents = data;
            createRegionOptions(agents);
            filterAndRender();
        })
        .catch(err => {
            console.error("Failed to fetch agents:", err);
        });

    // Dynamically create region options
    function createRegionOptions(agentList) {
        // Only consider agents with rating >= 95
        const highScoreAgents = agentList.filter(a => a.rating >= 95);
        const regions = Array.from(new Set(highScoreAgents.map(a => a.region))).sort();
        regionFilterOptions.innerHTML = "";
        // Add ALL option
        const allDiv = document.createElement("div");
        allDiv.dataset.region = "";
        allDiv.textContent = "All";
        allDiv.classList.add("region-option");
        regionFilterOptions.appendChild(allDiv);
        // Add each region
        regions.forEach(region => {
            const opt = document.createElement("div");
            opt.dataset.region = region;
            opt.textContent = region.charAt(0).toUpperCase() + region.slice(1);
            opt.classList.add("region-option");
            regionFilterOptions.appendChild(opt);
        });
    }

    // Filter and render table
    function filterAndRender() {
        if (!currentRegion) {
            filteredAgents = agents.filter(a => a.rating >= 95);
        } else {
            filteredAgents = agents.filter(a => a.region === currentRegion && a.rating >= 95);
        }
        if (currentSort.key) {
            filteredAgents.sort((a, b) => {
                let valA = a[currentSort.key];
                let valB = b[currentSort.key];
                if (typeof valA === "string") valA = valA.toLowerCase();
                if (typeof valB === "string") valB = valB.toLowerCase();
                if (valA < valB) return currentSort.asc ? -1 : 1;
                if (valA > valB) return currentSort.asc ? 1 : -1;
                return 0;
            });
        }
        renderTable(filteredAgents);
    }

    // Render table rows
    function renderTable(agentList) {
        tableBody.innerHTML = "";
        agentList.forEach((agent, idx) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${idx + 1}</td>
                <td>${agent.first_name}</td>
                <td>${agent.last_name}</td>
                <td>${agent.rating}</td>
                <td>${agent.fee}</td>
                <td>${agent.region.charAt(0).toUpperCase() + agent.region.slice(1)}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Dropdown menu logic (single global event)
    document.addEventListener("click", function (e) {
        if (!regionFilterArrow || !regionFilterOptions) return;

        if (e.target === regionFilterArrow) {
            // Position dropdown below the arrow using fixed positioning
            const rect = regionFilterArrow.getBoundingClientRect();
            regionFilterOptions.style.position = "fixed";
            regionFilterOptions.style.left = rect.left + "px";
            regionFilterOptions.style.top = rect.bottom + "px";
            regionFilterOptions.classList.toggle("show");
            e.stopPropagation();
        } else if (regionFilterOptions.contains(e.target) && e.target.dataset.region !== undefined) {
            currentRegion = e.target.dataset.region;
            filterAndRender();
            regionFilterOptions.classList.remove("show");
        } else {
            regionFilterOptions.classList.remove("show");
        }
    });

    // Sort event
    sortHeaders.forEach(header => {
        header.addEventListener("click", function () {
            // Determine sort key based on header text
            let sortKey = null;
            if (header.textContent.includes("First Name")) sortKey = "first_name";
            if (header.textContent.includes("Last Name")) sortKey = "last_name";
            if (header.textContent.includes("Rating")) sortKey = "rating";
            if (header.textContent.includes("Fee")) sortKey = "fee";
            if (!sortKey) return;
            if (currentSort.key === sortKey) {
                currentSort.asc = !currentSort.asc;
            } else {
                currentSort.key = sortKey;
                currentSort.asc = true;
            }
            filterAndRender();
        });
    });
});

$(document).ready(function () {
    // Store current sort state
    let sortState = {
        column: null,
        asc: true
    };

    // Map header IDs to column indices and data types
    const sortConfig = {
        firstNameArrow: { index: 1, numeric: false },
        lastNameArrow: { index: 2, numeric: false },
        ratingArrow: { index: 3, numeric: true },
        feeArrow: { index: 4, numeric: true }
    };

    // Sorting function
    function sortTable(colIndex, isNumeric, asc) {
        const $tbody = $('#agents-tbody');
        const $rows = $tbody.find('tr').get();

        $rows.sort(function (a, b) {
            let A = $(a).children('td').eq(colIndex).text().trim();
            let B = $(b).children('td').eq(colIndex).text().trim();

            if (isNumeric) {
                A = parseFloat(A.replace(/[^0-9.-]+/g, "")) || 0;
                B = parseFloat(B.replace(/[^0-9.-]+/g, "")) || 0;
            } else {
                A = A.toLowerCase();
                B = B.toLowerCase();
            }

            if (A < B) return asc ? -1 : 1;
            if (A > B) return asc ? 1 : -1;
            return 0;
        });

        $.each($rows, function (index, row) {
            $tbody.append(row);
        });
    }

    // Arrow click handlers
    $.each(sortConfig, function (arrowId, config) {
        $('#' + arrowId).css('cursor', 'pointer').on('click', function (e) {
            e.stopPropagation();

            // Toggle sort direction if same column, otherwise default to ascending
            if (sortState.column === arrowId) {
                sortState.asc = !sortState.asc;
            } else {
                sortState.column = arrowId;
                sortState.asc = true;
            }

            // Reset all arrows
            $.each(sortConfig, function (id) {
                $('#' + id).html('&#9660;');
            });

            // Set arrow direction
            $(this).html(sortState.asc ? '&#9650;' : '&#9660;');

            // Sort table
            sortTable(config.index, config.numeric, sortState.asc);
        });
    });
});