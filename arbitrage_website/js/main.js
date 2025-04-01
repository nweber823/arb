// Main JavaScript functionality for ArbitragePro website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        if (menuToggle) {
                            menuToggle.classList.remove('active');
                        }
                    }
                    
                    // Update URL
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
    
    // Performance metrics animation
    const animateMetrics = () => {
        const metrics = document.querySelectorAll('.metric-value');
        
        metrics.forEach(metric => {
            const target = parseFloat(metric.getAttribute('data-target'));
            const suffix = metric.getAttribute('data-suffix') || '';
            const duration = 2000; // Animation duration in milliseconds
            const start = 0;
            const startTime = performance.now();
            
            const updateMetric = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
                const currentValue = start + (target - start) * easeProgress;
                
                if (suffix === '%') {
                    metric.textContent = currentValue.toFixed(1) + suffix;
                } else if (suffix === 'x') {
                    metric.textContent = currentValue.toFixed(2) + suffix;
                } else {
                    metric.textContent = currentValue.toFixed(0) + suffix;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateMetric);
                }
            };
            
            requestAnimationFrame(updateMetric);
        });
    };
    
    // Intersection Observer for triggering animations when elements come into view
    const observeElements = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('metrics-container')) {
                        animateMetrics();
                    }
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        const elements = document.querySelectorAll('.fade-in, .slide-in, .metrics-container');
        elements.forEach(element => {
            observer.observe(element);
        });
    };
    
    observeElements();
    
    // Tabs functionality for documentation section
    const initTabs = () => {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        if (tabButtons.length > 0) {
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const target = button.getAttribute('data-tab');
                    
                    // Update active tab button
                    tabButtons.forEach(btn => {
                        btn.classList.remove('active');
                    });
                    button.classList.add('active');
                    
                    // Show target tab content
                    tabContents.forEach(content => {
                        content.classList.remove('active');
                        if (content.getAttribute('id') === target) {
                            content.classList.add('active');
                        }
                    });
                });
            });
            
            // Activate first tab by default
            tabButtons[0].click();
        }
    };
    
    initTabs();
    
    // Interactive chart functionality
    const initCharts = () => {
        const performanceChart = document.getElementById('performance-chart');
        
        if (performanceChart && typeof Chart !== 'undefined') {
            const ctx = performanceChart.getContext('2d');
            
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                        {
                            label: 'Arbitrage Strategy',
                            data: [100, 101.2, 103.5, 104.8, 106.2, 108.1, 109.3, 110.5, 112.0, 113.2, 114.5, 116.0],
                            borderColor: '#4a80f5',
                            backgroundColor: 'rgba(74, 128, 245, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'S&P 500',
                            data: [100, 102.1, 101.5, 103.2, 102.8, 104.5, 105.2, 104.8, 106.1, 107.3, 108.5, 110.2],
                            borderColor: '#f5a742',
                            backgroundColor: 'rgba(245, 167, 66, 0.1)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            title: {
                                display: true,
                                text: 'Performance (Indexed to 100)'
                            }
                        }
                    }
                }
            });
        }
    };
    
    // Load Chart.js dynamically if needed
    if (document.getElementById('performance-chart')) {
        if (typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = initCharts;
            document.head.appendChild(script);
        } else {
            initCharts();
        }
    }
    
    // Back to top button functionality
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'flex';
            } else {
                backToTopButton.style.display = 'none';
            }
        });
        
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Form validation for contact form
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            let isValid = true;
            
            // Simple validation
            if (!nameInput.value.trim()) {
                nameInput.classList.add('error');
                isValid = false;
            } else {
                nameInput.classList.remove('error');
            }
            
            if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
                emailInput.classList.add('error');
                isValid = false;
            } else {
                emailInput.classList.remove('error');
            }
            
            if (!messageInput.value.trim()) {
                messageInput.classList.add('error');
                isValid = false;
            } else {
                messageInput.classList.remove('error');
            }
            
            if (isValid) {
                // Simulate form submission
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
                
                setTimeout(() => {
                    contactForm.reset();
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                    contactForm.appendChild(successMessage);
                    
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                }, 1500);
            }
        });
    }
});
