document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Scroll Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // 2. Navbar Background on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Dynamic Portfolio Loading
    const portfolioGrid = document.getElementById('portfolio-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let allProjects = [];

    // Fetch the projects data
    async function fetchProjects() {
        try {
            portfolioGrid.innerHTML = '<div class="loading">Loading projects...</div>';
            const response = await fetch('projects.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            allProjects = await response.json();
            renderProjects(allProjects);
        } catch (error) {
            console.error('Error fetching projects:', error);
            portfolioGrid.innerHTML = '<div class="loading">Sorry, failed to load projects.</div>';
        }
    }

    // Render projects to the grid
    function renderProjects(projects) {
        portfolioGrid.innerHTML = ''; // Clear current

        if (projects.length === 0) {
            portfolioGrid.innerHTML = '<div class="loading">No projects found.</div>';
            return;
        }

        projects.forEach((project, index) => {
            // Create card element
            const card = document.createElement('a');
            card.href = project.link || '#';
            card.className = 'portfolio-card reveal';
            
            // Adding a staggered animation delay based on index for the initial load
            card.style.transitionDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <div class="card-image-wrapper">
                    <!-- Placeholder handling for missing images -->
                    <img src="${project.image}" alt="${project.title}" class="card-image" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';">
                    <div class="card-overlay"></div>
                    <div class="card-content">
                        <span class="card-category">${project.category}</span>
                        <h3 class="card-title">${project.title}</h3>
                    </div>
                </div>
            `;
            
            portfolioGrid.appendChild(card);
            
            // Observe the newly added card for scroll reveal
            setTimeout(() => {
                revealObserver.observe(card);
            }, 100);
        });
    }

    // 4. Portfolio Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter logic
            const filterValue = btn.getAttribute('data-filter');
            
            if (filterValue === 'all') {
                renderProjects(allProjects);
            } else {
                const filtered = allProjects.filter(p => p.category === filterValue);
                renderProjects(filtered);
            }
        });
    });

    // Mobile Menu Simple Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if(navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'var(--bg-color)';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid var(--border-color)';
            }
        });
    }

    // Init fetch
    fetchProjects();
});
