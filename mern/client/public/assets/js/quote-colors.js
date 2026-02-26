
//Function to change card heading colors based on building type selection//
document.addEventListener('DOMContentLoaded', function () {
    function updateCardHeadings(selection) {
        const selectors = [
            '.select-building-type .card-heading',
            '.estimate-num-elv .card-heading',
            '.product-line .card-heading',
            '.final-pricing-display .card-heading'
        ];
        selectors.forEach(selector => {
            const heading = document.querySelector(selector);
            if (!heading) return;

            // Reset styles for heading and all children
            heading.style.backgroundColor = '';
            heading.style.color = '';
            heading.querySelectorAll('*').forEach(child => {
                child.style.color = '';
                child.style.setProperty('color', '', 'important');
            });

            // If default option is selected, set all text to blue
            if (selection === '---Select---' || !['residential','commercial','industrial'].includes(selection)) {
                heading.style.color = '#0a65a0';
                heading.querySelectorAll('*').forEach(child => {
                    child.style.setProperty('color', '#0a65a0', 'important');
                });
                return;
            }

            // Otherwise, set colors for the selected type
            let bg = '', color = '';
            if (selection === 'residential') {
                bg = '#80c3f0'; color = '#fff';
            } else if (selection === 'commercial') {
                bg = '#d47f7f'; color = '#fff';
            } else if (selection === 'industrial') {
                bg = '#cfcccc'; color = '#fff';
            }
            heading.style.backgroundColor = bg;
            heading.style.color = color;
            heading.querySelectorAll('*').forEach(child => {
                child.style.setProperty('color', color, 'important');
            });
        });
    }

    const select = document.getElementById('building-type');
    if (select) {
        select.addEventListener('change', function (e) {
            updateCardHeadings(select.value);
        });
        updateCardHeadings(select.value);
    }
});