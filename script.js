document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const contactForm = document.querySelector('.contact form');
    const reservationForm = document.querySelector('.reservations form');
    const newsletterForm = document.querySelector('.newsletter form');

    // Load theme preference
    try {
        if (localStorage.getItem('dark-mode') === 'enabled') {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '☀️';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        }
    } catch (e) {
        console.error('Failed to access localStorage:', e);
    }

    // Debounce utility
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    // Toggle dark mode
    themeToggle.addEventListener('click', debounce(() => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        try {
            localStorage.setItem('dark-mode', isDarkMode ? 'enabled' : 'disabled');
        } catch (e) {
            console.error('Failed to update localStorage:', e);
        }
        themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
        themeToggle.setAttribute('aria-label', isDarkMode ? 'Switch to light mode' : 'Switch to dark mode');
    }, 200));

    // Toggle mobile menu
    menuToggle.addEventListener('click', () => {
        const isExpanded = navLinks.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        menuToggle.setAttribute('aria-label', isExpanded ? 'Close mobile menu' : 'Open mobile menu');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Open mobile menu');
        });
    });

    // Handle contact form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };
        console.log('Contact form submission:', data);
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });

    // Handle reservation form submission
    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(reservationForm);
            const data = {
                date: formData.get('date'),
                time: formData.get('time'),
                partySize: formData.get('party-size'),
                message: formData.get('message')
            };
            console.log('Reservation submission:', data);
            alert('Thank you for your reservation request! We will confirm soon.');
            reservationForm.reset();
        });
    }

    // Handle newsletter form submission
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('#newsletter-email').value;
            console.log('Newsletter signup:', { email });
            alert('Thank you for subscribing!');
            newsletterForm.reset();
        });
    }

    // Coffee Quiz Game
    const quizData = [
        {
            question: "What is the main ingredient in espresso?",
            options: ["Sugar", "Coffee beans", "Milk", "Chocolate"],
            correct: 1
        },
        {
            question: "Which coffee drink includes steamed milk and foam?",
            options: ["Americano", "Latte", "Cappuccino", "Espresso"],
            correct: 2
        },
        {
            question: "Where are Café Delight's beans sourced from?",
            options: ["Local farms", "Ethically sourced global farms", "Synthetic blends", "Supermarkets"],
            correct: 1
        }
    ];

    let currentQuestion = 0;
    let score = 0;

    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const quizSubmit = document.getElementById('quiz-submit');
    const quizResult = document.getElementById('quiz-result');

    function loadQuestion() {
        const q = quizData[currentQuestion];
        quizQuestion.innerHTML = `<h3>${q.question}</h3>`;
        quizOptions.innerHTML = q.options.map((option, index) => `
            <label class="quiz-option">
                <input type="radio" name="quiz" value="${index}" aria-label="${option}">
                ${option}
            </label>
        `).join('');
        quizSubmit.disabled = true;
        quizOptions.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', () => {
                quizSubmit.disabled = false;
                quizSubmit.focus();
            });
        });
    }

    function showResult() {
        quizQuestion.innerHTML = '';
        quizOptions.innerHTML = '';
        quizSubmit.style.display = 'none';
        quizResult.innerHTML = `
            <p>You scored ${score} out of ${quizData.length}!</p>
            <p>Visit Café Delight at 123 Coffee Street, New York, NY 10001 for a free coffee with your next visit! <a href="#contact" class="btn">Contact Us</a></p>
        `;
    }

    if (quizQuestion && quizOptions && quizSubmit) {
        loadQuestion();
        quizSubmit.addEventListener('click', () => {
            const selected = quizOptions.querySelector('input:checked');
            if (selected) {
                const answer = parseInt(selected.value);
                if (answer === quizData[currentQuestion].correct) {
                    score++;
                }
                currentQuestion++;
                if (currentQuestion < quizData.length) {
                    loadQuestion();
                } else {
                    showResult();
                }
            }
        });
    }

    // Hide theme toggle on scroll for non-mobile screens
    const toggleThemeVisibility = () => {
        if (window.innerWidth > 768) {
            if (window.scrollY > 100) {
                themeToggle.classList.add('hidden-toggle');
            } else {
                themeToggle.classList.remove('hidden-toggle');
            }
        } else {
            themeToggle.classList.remove('hidden-toggle');
        }
    };

    // Initial check for scroll position
    toggleThemeVisibility();

    // Scroll event listener
    window.addEventListener('scroll', debounce(toggleThemeVisibility, 150));

    // Add more reviews dynamically
    // Add more reviews
    const reviewsContainer = document.querySelector('.reviews-container');
    if (reviewsContainer) {
        const extraReviews = [
            '"Absolutely love the cozy vibe and friendly staff!" - Priya K.',
            '"A hidden gem for coffee lovers. The muffins are amazing." - Alex R.',
            '"Great place to work or relax. Highly recommend the latte." - Maria L.',
            '"Fast service and delicious pastries. Will visit again!" - Ethan W.'
        ];
        extraReviews.forEach(text => {
            const div = document.createElement('div');
            div.className = 'review-item';
            div.innerHTML = `<p>${text}</p>`;
            reviewsContainer.appendChild(div);
        });
    }
});