// Cart state management
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

// Update cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    initializeMobileMenu();
    setupAuthModal(); // Initialize auth modal functionality
    initializeAuth();
    initializeNotebookCards();
    initializeProductFilters();
    initializeFilterScroll();
});

// Function to toggle the cart modal
function toggleCart() {
    const cartModal = document.querySelector('.cart-modal');
    cartModal.classList.toggle('active');
}

// Function to open a specific modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

// Function to close a specific modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Function to switch between modals
function switchModal(currentModalId, targetModalId) {
    closeModal(currentModalId);
    openModal(targetModalId);
}

// Function to set up the authentication modal
function setupAuthModal() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('loginModal');
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('signupModal');
        });
    }

    // Add event listeners to close buttons
    document.querySelectorAll('.nav-close').forEach(button => {
        button.addEventListener('click', (e) => {
            const modalId = button.closest('.auth-modal').id;
            closeModal(modalId);
        });
    });
}

// Mobile Menu functionality
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const navClose = document.createElement('button');
    navClose.className = 'nav-close';
    navClose.innerHTML = '<i class="fas fa-times"></i>';
    nav.insertBefore(navClose, nav.firstChild);

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    navClose.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// Cart functionality
function updateCartUI() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => el.textContent = cartCount);

    const cartItemsContainer = document.querySelector('.cart-items');
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = cartItems.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price} × ${item.quantity}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        // Update total
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.querySelector('.cart-total span:last-child').textContent = `$${total.toFixed(2)}`;
    }

    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function addToCart(productId, name, price, image) {
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            id: productId,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    cartCount++;
    updateCartUI();
    showToast('Item added to cart');
}

function removeFromCart(productId) {
    const itemIndex = cartItems.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cartCount -= cartItems[itemIndex].quantity;
        cartItems.splice(itemIndex, 1);
        updateCartUI();
        showToast('Item removed from cart');
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <i class="fas fa-shopping-cart"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Close cart when clicking close button
document.querySelector('.close-cart')?.addEventListener('click', toggleCart);

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    const cartModal = document.querySelector('.cart-modal');
    const cartBtn = document.querySelector('.cart-btn');
    
    if (cartModal && !cartModal.contains(e.target) && !cartBtn.contains(e.target) && cartModal.classList.contains('active')) {
        toggleCart();
    }
});
document.getElementById('search-button').addEventListener('click', function() {
    const query = document.getElementById('search-input').value;
    
});

function initializeAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const closeBtns = document.querySelectorAll('.close-btn');
    const switchBtns = document.querySelectorAll('.switch-auth-btn');
    
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.add('active');
    });

    signupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.classList.add('active');
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.classList.remove('active');
            signupModal.classList.remove('active');
        });
    });

    switchBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.toggle('active');
            signupModal.classList.toggle('active');
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('auth-modal')) {
            e.target.classList.remove('active');
        }
    });
}

// Notebook page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const notebookCards = document.querySelectorAll('.notebook-card');
    
    notebookCards.forEach(card => {
        // Handle explore button click
        const exploreBtn = card.querySelector('.explore-btn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                const productName = card.querySelector('h3').textContent;
                // Add your explore functionality here
                console.log('Exploring:', productName);
            });
        }

        // Add hover animations
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});

// Notebook specific functionality
function initializeNotebookCards() {
    const notebookCards = document.querySelectorAll('.notebook-card');
    
    notebookCards.forEach(card => {
        const cartBtn = card.querySelector('.cart-btn');
        const overlay = card.querySelector('.product-overlay');
        const exploreBtn = card.querySelector('.explore-btn');
        
        // Cart button animation
        cartBtn.addEventListener('click', function() {
            this.classList.add('added');
            setTimeout(() => this.classList.remove('added'), 400);
        });

        // Explore button functionality
       
    });
}

// Product filtering and search functionality
function initializeProductFilters() {
    const filterButtons = document.querySelectorAll('.btn1');
    const productCards = document.querySelectorAll('.product-card');
    const searchInput = document.getElementById('product-search');

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            
            productCards.forEach(card => {
                // Reset animation
                card.style.animation = 'none';
                card.offsetHeight; // Force reflow
                card.style.animation = null;
                
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hide');
                    card.style.animation = 'fadeIn 0.5s ease-out';
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // Search functionality
    if (searchInput) {
        let debounceTimer;
        
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const searchTerm = searchInput.value.toLowerCase();
                
                productCards.forEach(card => {
                    const title = card.querySelector('h3').textContent.toLowerCase();
                    const category = card.getAttribute('data-category').toLowerCase();
                    
                    if (title.includes(searchTerm) || category.includes(searchTerm)) {
                        card.classList.remove('hide');
                        card.style.animation = 'fadeIn 0.5s ease-out';
                    } else {
                        card.classList.add('hide');
                    }
                });
            }, 300); // Debounce delay
        });
    }
}

function updateFilterScrollIndicator() {
    const container = document.querySelector('.filter-scroll-container');
    if (!container) return;

    const scrollPercentage = (container.scrollLeft / (container.scrollWidth - container.clientWidth)) * 100;
    container.style.setProperty('--scroll-width', `${scrollPercentage}%`);
}

function initializeFilterScroll() {
    const container = document.querySelector('.filter-scroll-container');
    const buttons = document.querySelector('.filter-buttons');
    const prevBtn = document.getElementById('scrollPrev');
    const nextBtn = document.getElementById('scrollNext');
    
    if (!container || !buttons || !prevBtn || !nextBtn) return;

    let scrollPosition = 0;
    const scrollAmount = 200;

    // Update scroll indicator on scroll
    container.addEventListener('scroll', () => {
        requestAnimationFrame(updateFilterScrollIndicator);
    });

    function updateScrollButtons() {
        prevBtn.classList.toggle('disabled', scrollPosition <= 0);
        nextBtn.classList.toggle('disabled', 
            scrollPosition >= buttons.scrollWidth - container.clientWidth);
        updateFilterScrollIndicator();
    }

    nextBtn.addEventListener('click', () => {
        scrollPosition = Math.min(
            scrollPosition + scrollAmount,
            buttons.scrollWidth - container.clientWidth
        );
        container.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        updateScrollButtons();
    });

    prevBtn.addEventListener('click', () => {
        scrollPosition = Math.max(scrollPosition - scrollAmount, 0);
        container.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        updateScrollButtons();
    });

    // Initialize button states and scroll indicator
    updateScrollButtons();
    updateFilterScrollIndicator();

    // Update on window resize
    window.addEventListener('resize', () => {
        scrollPosition = container.scrollLeft;
        updateScrollButtons();
    });
}
