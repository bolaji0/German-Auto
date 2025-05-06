/**
 * German Auto Works - Main JavaScript
 * Handles interactive elements, animations, and form validation
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initHeader();
  initMobileMenu();
  initScrollAnimations();
  initBackToTop();
  initTestimonialSlider();
  initContactForm();
  
  // For Google Maps initialization, this will be called by the Google Maps API
  window.initMap = initMap;
});

/**
 * Header scroll effect
 */
function initHeader() {
  const header = document.getElementById('header');
  const scrollThreshold = 50;
  
  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  // Initial check
  handleScroll();
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);
  
  // Add click event to navigation links for smooth scrolling
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Close mobile menu if open
        const navMenu = document.querySelector('.nav-menu');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          mobileMenuToggle.classList.remove('mobile-menu-open');
        }
        
        // Smooth scroll to target section
        window.scrollTo({
          top: targetSection.offsetTop - header.offsetHeight,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  mobileMenuToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    this.classList.toggle('mobile-menu-open');
  });
}

/**
 * Scroll animations
 */
function initScrollAnimations() {
  // 1️⃣ First tag all the things that should animate
  document.querySelectorAll(
    '.section-header, .service-card, .about-content, .gallery-item, .stat-item'
  ).forEach(el => {
    el.classList.add('animate-fade-in');
  });

  // 2️⃣ Now grab them
  const animatedElements = document.querySelectorAll('.animate-fade-in');

  // 3️⃣ Define your visibility check
  function checkVisibility() {
    animatedElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const elementVisibleThreshold = 150;
      if (elementTop < window.innerHeight - elementVisibleThreshold) {
        el.classList.add('visible');
      }
    });
  }

  // 4️⃣ Run it once (in case some are already in-view)
  checkVisibility();

  // 5️⃣ …and again on scroll
  window.addEventListener('scroll', checkVisibility);
}

// Make sure to kick it off after the DOM is loaded
document.addEventListener('DOMContentLoaded', initScrollAnimations);


/**
 * Back to top button
 */
function initBackToTop() {
  const backToTopButton = document.getElementById('backToTop');
  const scrollThreshold = 300;
  
  function toggleBackToTopButton() {
    if (window.scrollY > scrollThreshold) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  }
  
  // Initial check
  toggleBackToTopButton();
  
  // Add scroll event listener
  window.addEventListener('scroll', toggleBackToTopButton);
  
  // Add click event listener
  backToTopButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Testimonial slider
 */
function initTestimonialSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevArrow = document.querySelector('.prev-arrow');
  const nextArrow = document.querySelector('.next-arrow');
  let currentSlide = 0;
  let slideInterval;
  
  function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
      dot.classList.remove('active');
    });
    
    // Show the current slide
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }
  
  function nextSlide() {
    showSlide(currentSlide + 1);
  }
  
  function prevSlide() {
    showSlide(currentSlide - 1);
  }
  
  // Add click event listeners to dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      resetSlideInterval();
    });
  });
  
  // Add click event listeners to arrows
  prevArrow.addEventListener('click', () => {
    prevSlide();
    resetSlideInterval();
  });
  
  nextArrow.addEventListener('click', () => {
    nextSlide();
    resetSlideInterval();
  });
  
  // Start auto-slide
  function startSlideInterval() {
    slideInterval = setInterval(nextSlide, 5000);
  }
  
  // Reset auto-slide timer
  function resetSlideInterval() {
    clearInterval(slideInterval);
    startSlideInterval();
  }
  
  // Initialize slider
  showSlide(0);
  startSlideInterval();
}

/**
 * Contact form handling and validation
 */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  const toastMessage = toast.querySelector('.toast-message');
  const toastIcon = toast.querySelector('.toast-icon');
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const vehicle = document.getElementById('vehicle').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();
    
    // Validate form
    if (!validateForm(name, email, phone, service)) {
      return;
    }
    
    // Simulate form submission (in a real implementation, this would be an API call)
    // For demonstration, we'll just show a success message
    simulateFormSubmission({
      name,
      email,
      phone,
      vehicle,
      service,
      message
    });
  });
  
  function validateForm(name, email, phone, service) {
    // Check if required fields are empty
    if (!name || !email || !phone || !service) {
      showToast('Please fill in all required fields.', 'error');
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return false;
    }
    
    // Validate phone number (simple validation)
    const phoneRegex = /^[0-9()\-\s+]{7,20}$/;
    if (!phoneRegex.test(phone)) {
      showToast('Please enter a valid phone number.', 'error');
      return false;
    }
    
    return true;
  }
  
  function simulateFormSubmission(formData) {
    // In a real implementation, this would be an API call to your backend
    // For now, we'll just simulate a successful submission after a short delay
    
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
      // Reset form
      contactForm.reset();
      
      // Reset button
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      
      // Show success message
      showToast('Your request has been submitted successfully. We will contact you shortly.', 'success');
      
      console.log('Form submission data:', formData);
    }, 1500);
  }
  
  function showToast(message, type) {
    // Set message
    toastMessage.textContent = message;
    
    // Set icon based on type
    toastIcon.className = 'toast-icon';
    if (type === 'success') {
      toastIcon.classList.add('success');
      toastIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
    } else {
      toastIcon.classList.add('error');
      toastIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

/**
 * Google Maps initialization
 * Note: This function will be called by the Google Maps API
 */
function initMap() {
  // Default location (Beverly Hills)
  const location = { lat: 34.073620, lng: -118.400352 };
  
  // Create map
  const map = new google.maps.Map(document.getElementById('map'), {
    center: location,
    zoom: 15,
    styles: [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#212121"
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#212121"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#bdbdbd"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#181818"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#1b1b1b"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#2c2c2c"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#8a8a8a"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#373737"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#3c3c3c"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#4e4e4e"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#000000"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#3d3d3d"
          }
        ]
      }
    ]
  });
  
  // Check if AdvancedMarkerElement is available
  if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
    // Create advanced marker
    const markerContent = document.createElement('div');
    markerContent.style.width = '20px';
    markerContent.style.height = '20px';
    markerContent.style.borderRadius = '50%';
    markerContent.style.backgroundColor = '#FF0000';
    
    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: location,
      map: map,
      title: 'German Auto Works',
      content: markerContent
    });
    
    // Create info window
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 10px; max-width: 200px;">
          <h3 style="margin: 0 0 5px; color: #000;">German Auto Works</h3>
          <p style="margin: 0; font-size: 14px;">123 Luxury Lane<br>Beverly Hills, CA 90210</p>
        </div>
      `
    });
    
    // Open info window on marker click
    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
  } else {
    // Fallback to regular marker if AdvancedMarkerElement isn't available
    const marker = new google.maps.Marker({
      position: location,
      map: map,
      title: 'German Auto Works',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#FF0000',
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 10
      }
    });
    
    // Create info window
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 10px; max-width: 200px;">
          <h3 style="margin: 0 0 5px; color: #000;">German Auto Works</h3>
          <p style="margin: 0; font-size: 14px;">123 Luxury Lane<br>Beverly Hills, CA 90210</p>
        </div>
      `
    });
    
    // Open info window on marker click
    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
  }
}