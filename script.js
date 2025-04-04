// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Sticky Header
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Smooth Scrolling for Navigation Links
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
                
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Custom Itinerary Builder
    const itineraryForm = document.getElementById('generate-itinerary');
    const itineraryResult = document.getElementById('itinerary-result');
    
    if (itineraryForm) {
        itineraryForm.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get form values
            const duration = document.getElementById('duration').value;
            const interest = document.getElementById('interest').value;
            const season = document.getElementById('season').value;
            const style = document.getElementById('style').value;
            
            // Generate itinerary based on selections
            generateItinerary(duration, interest, season, style);
            
            // Show result container
            itineraryResult.style.display = 'block';
            
            // Scroll to result
            itineraryResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
    
    // Initialize Festival Timeline
    initializeFestivalTimeline();
    
    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput.value) {
                // Show success message
                const successMessage = document.createElement('p');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Thank you for subscribing to our newsletter!';
                successMessage.style.color = '#fff';
                successMessage.style.marginTop = '15px';
                
                // Remove any existing success message
                const existingMessage = document.querySelector('.success-message');
                if (existingMessage) {
                    existingMessage.remove();
                }
                
                this.after(successMessage);
                this.reset();
            }
        });
    }
    
    // Image Lazy Loading
    lazyLoadImages();
});

// Functions
// Generate Itinerary based on user selections
function generateItinerary(duration, interest, season, style) {
    const itineraryResult = document.getElementById('itinerary-result');
    let html = '';
    
    // Title for the itinerary
    html += `<h3>Your Custom Karnataka Itinerary</h3>`;
    html += `<p class="itinerary-meta">Duration: ${getDurationText(duration)} | Focus: ${getInterestText(interest)} | Season: ${season} | Style: ${style}</p>`;
    
    // Base itinerary structure
    html += `<div class="itinerary-days">`;
    
    // Generate days based on duration
    const daysCount = getDaysCount(duration);
    
    for (let i = 1; i <= daysCount; i++) {
        const dayPlan = generateDayPlan(i, interest, season, style);
        html += `
            <div class="itinerary-day">
                <h4>Day ${i}</h4>
                <div class="day-content">
                    <div class="day-locations">
                        <h5>${dayPlan.location}</h5>
                        <p>${dayPlan.description}</p>
                    </div>
                    <div class="day-activities">
                        <h5>Activities</h5>
                        <ul>
                            ${dayPlan.activities.map(activity => `<li>${activity}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="day-stay">
                        <h5>Recommended Stay</h5>
                        <p>${dayPlan.accommodation}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    html += `</div>`;
    
    // Add tips and notes
    html += `
        <div class="itinerary-notes">
            <h4>Travel Notes</h4>
            <ul>
                <li>Best time to visit the selected destinations: ${getBestTimeForInterest(interest, season)}</li>
                <li>Estimated budget: ${getBudgetEstimate(style, daysCount)}</li>
                <li>Transportation: ${getTransportationTips(interest, daysCount)}</li>
            </ul>
        </div>
        <div class="itinerary-buttons">
            <button class="primary-btn">Save Itinerary</button>
            <button class="secondary-btn">Modify Preferences</button>
        </div>
    `;
    
    itineraryResult.innerHTML = html;
    
    // Style the itinerary result
    styleItineraryResult();
}

// Helper functions for itinerary generation
function getDurationText(duration) {
    const durationMap = {
        '2-3': '2-3 days',
        '4-5': '4-5 days',
        '6-7': '6-7 days',
        '8+': '8+ days'
    };
    return durationMap[duration] || duration;
}

function getInterestText(interest) {
    const interestMap = {
        'heritage': 'Heritage & History',
        'nature': 'Nature & Wildlife',
        'beaches': 'Beaches & Coastal Areas',
        'adventure': 'Adventure',
        'spiritual': 'Spiritual Journey',
        'mixed': 'Mix of Everything'
    };
    return interestMap[interest] || interest;
}

function getDaysCount(duration) {
    const durationMap = {
        '2-3': 3,
        '4-5': 5,
        '6-7': 7,
        '8+': 9
    };
    return durationMap[duration] || 3;
}

function generateDayPlan(day, interest, season, style) {
    // Sample itinerary data - in a real application, this would be more comprehensive
    const itineraryOptions = {
        'heritage': [
            { 
                location: 'Hampi', 
                description: 'Explore the ancient ruins of the Vijayanagara Empire, a UNESCO World Heritage Site.',
                activities: ['Visit Virupaksha Temple', 'Explore Hampi Bazaar', 'Discover Stone Chariot at Vittala Temple', 'Sunset at Matanga Hill'],
                accommodation: 'Heritage homestay near Hampi Bazaar'
            },
            { 
                location: 'Badami', 
                description: 'Discover cave temples and ancient architecture from the Chalukya dynasty.',
                activities: ['Explore Badami Cave Temples', 'Visit Bhutanatha Temple', 'Climb to North Fort', 'Photography at Agastya Lake'],
                accommodation: 'Mid-range hotel near Badami Bus Stand'
            },
            { 
                location: 'Pattadakal & Aihole', 
                description: 'Visit these UNESCO sites showcasing early Chalukyan architecture and experiemental temple designs.',
                activities: ['Tour Pattadakal Temple Complex', 'Visit Aihole Archaeological Museum', 'Explore Durga Temple Complex', 'Sunset photography'],
                accommodation: 'Guesthouse in Pattadakal village'
            },
            { 
                location: 'Mysore', 
                description: 'Experience the royal heritage of the former Wodeyar Kingdom and its magnificent palace.',
                activities: ['Tour Mysore Palace', 'Visit Chamundi Hills', 'Explore Devaraja Market', 'Evening light show at the Palace'],
                accommodation: 'Heritage hotel in central Mysore'
            },
            { 
                location: 'Srirangapatna', 
                description: 'Explore the historic island town that was the capital of Tipu Sultan\'s kingdom.',
                activities: ['Visit Tipu Sultan\'s Summer Palace', 'Explore Ranganathaswamy Temple', 'Tour Daria Daulat Bagh', 'Visit the Gumbaz'],
                accommodation: 'Riverside resort near Kaveri'
            },
            { 
                location: 'Bijapur', 
                description: 'Discover Islamic architecture from the Adil Shahi dynasty including the famous Gol Gumbaz.',
                activities: ['Visit Gol Gumbaz', 'Explore Ibrahim Rauza', 'Tour Malik-e-Maidan cannon', 'Visit Bara Kaman'],
                accommodation: 'Mid-range hotel in central Bijapur'
            },
            { 
                location: 'Belur & Halebidu', 
                description: 'Marvel at the intricate Hoysala temple architecture with their detailed carvings.',
                activities: ['Visit Chennakesava Temple at Belur', 'Explore Hoysaleswara Temple at Halebidu', 'Visit Archaeological Museum', 'Photography session'],
                accommodation: 'Heritage homestay in Belur'
            },
            { 
                location: 'Shravanabelagola', 
                description: 'Visit the important Jain pilgrimage site with its monolithic statue of Gommateshwara.',
                activities: ['Climb Vindhyagiri Hill', 'Visit Gomateshwara Statue', 'Explore Chandragiri Hill', 'Tour Jain Maths'],
                accommodation: 'Pilgrim guesthouse near the temple'
            },
            { 
                location: 'Bengaluru', 
                description: 'Explore the historical sites of Karnataka\'s capital city.',
                activities: ['Visit Bangalore Palace', 'Tour Tipu Sultan\'s Summer Palace', 'Explore Bangalore Fort', 'Evening at Cubbon Park'],
                accommodation: 'Heritage hotel in central Bengaluru'
            }
        ],
        'nature': [
            { 
                location: 'Coorg (Kodagu)', 
                description: 'Experience the misty landscapes, coffee plantations, and lush greenery of the Western Ghats.',
                activities: ['Visit Abbey Falls', 'Explore coffee plantations', 'Trek to Tadiandamol Peak', 'Birdwatching at Dubare Reserve'],
                accommodation: 'Plantation homestay in Madikeri'
            },
            { 
                location: 'Chikmagalur', 
                description: 'Discover the birthplace of coffee in India with its scenic mountains and plantations.',
                activities: ['Trek to Mullayanagiri Peak', 'Visit coffee estates', 'Explore Hebbe Falls', 'Sunset at Z Point'],
                accommodation: 'Eco-resort amidst coffee estates'
            },
            { 
                location: 'Agumbe', 
                description: 'Experience the rainforest ecosystem of the "Cherrapunji of South India".',
                activities: ['Sunset view from Sunset Point', 'Trek to Onake Abbi Falls', 'Wildlife photography', 'Visit Rainforest Research Station'],
                accommodation: 'Forest homestay with rainforest views'
            },
            { 
                location: 'Nagarhole National Park', 
                description: 'Witness diverse wildlife including tigers, elephants, and numerous bird species.',
                activities: ['Morning safari', 'Evening safari', 'Bird watching', 'Nature walk with guide'],
                accommodation: 'Wildlife resort at park periphery'
            },
            { 
                location: 'Bandipur National Park', 
                description: 'Explore one of India\'s premier tiger reserves with abundant wildlife.',
                activities: ['Jeep safari', 'Nature walk', 'Visit to elephant camp', 'Wildlife photography'],
                accommodation: 'Safari lodge near park entrance'
            },
            { 
                location: 'Kudremukh', 
                description: 'Trek through one of the most scenic mountain ranges in the Western Ghats.',
                activities: ['Kudremukh Peak trek', 'Visit Hanuman Gundi Falls', 'Explore shola forests', 'Photography'],
                accommodation: 'Forest guesthouse in Kudremukh'
            },
            { 
                location: 'Dandeli', 
                description: 'Adventure through the dense forests and experience water sports on the Kali River.',
                activities: ['White water rafting', 'Jungle safari', 'Visit to Syntheri Rocks', 'Kayaking'],
                accommodation: 'Jungle resort by the river'
            },
            { 
                location: 'Kemmanagundi', 
                description: 'Discover this scenic hill station with beautiful gardens and waterfalls.',
                activities: ['Visit Z Point', 'Explore Hebbe Falls', 'Tour Rose Garden', 'Trek to Shanti Falls'],
                accommodation: 'Mountain cottage with valley view'
            },
            { 
                location: 'B.R. Hills', 
                description: 'Experience the unique confluence of the Eastern and Western Ghats ecosystems.',
                activities: ['Wildlife safari', 'Visit tribal villages', 'Trek through BR Hills', 'Birdwatching'],
                accommodation: 'Eco-lodge in the wildlife sanctuary'
            }
        ],
        'beaches': [
            { 
                location: 'Gokarna', 
                description: 'Relax at this temple town with pristine beaches and a laid-back atmosphere.',
                activities: ['Trek between five beaches', 'Visit Mahabaleshwar Temple', 'Sunset at Om Beach', 'Boat tour to Paradise Beach'],
                accommodation: 'Beach huts at Kudle Beach'
            },
            { 
                location: 'Murudeshwar', 
                description: 'Visit the town known for its massive Shiva statue and beautiful coastal temple.',
                activities: ['Visit Murudeshwar Temple', 'Statue viewing tower', 'Water sports', 'Netrani Island snorkeling'],
                accommodation: 'Seaview hotel near temple'
            },
            { 
                location: 'Karwar', 
                description: 'Explore pristine beaches and clear waters at this coastal gem.',
                activities: ['Relax at Devbagh Beach', 'Visit Sadashivgad Fort', 'Boat ride to Oyster Rock Lighthouse', 'Coastal cuisine tasting'],
                accommodation: 'Beach resort at Devbagh'
            },
            { 
                location: 'Malpe & St. Mary\'s Islands', 
                description: 'Discover this coastal town and unique columnar basaltic lava formations at the nearby islands.',
                activities: ['Ferry to St. Mary\'s Islands', 'Water sports at Malpe', 'Visit Sea Walk', 'Fresh seafood dinner'],
                accommodation: 'Beach-facing hotel in Malpe'
            },
            { 
                location: 'Maravanthe', 
                description: 'Witness the unique sight of highway flanked by the Arabian Sea and Suparnika River.',
                activities: ['Beach relaxation', 'Photography at viewpoints', 'River boating', 'Sunset views'],
                accommodation: 'Riverside resort at Maravanthe'
            },
            { 
                location: 'Kaup (Kapu)', 
                description: 'Visit this quiet beach known for its historic lighthouse and peaceful surroundings.',
                activities: ['Visit Kaup Lighthouse', 'Beach relaxation', 'Coastal temple visit', 'Fishing village tour'],
                accommodation: 'Beach homestay near lighthouse'
            },
            { 
                location: 'Udupi', 
                description: 'Experience this coastal town known for its cuisine and Krishna Temple.',
                activities: ['Visit Sri Krishna Math', 'Tour local beaches', 'Culinary tour of Udupi cuisine', 'Local markets'],
                accommodation: 'Heritage stay near Krishna Temple'
            },
            { 
                location: 'Mangalore', 
                description: 'Explore the major port city with beautiful beaches and cultural sites.',
                activities: ['Visit Panambur Beach', 'Tour Mangaladevi Temple', 'Lighthouse Hill Garden visit', 'Local food tour'],
                accommodation: 'City hotel with coastal view'
            },
            { 
                location: 'Baindur', 
                description: 'Discover this hidden beach destination with pristine shores and few tourists.',
                activities: ['Relax at Ottinene Beach', 'Visit viewpoint', 'Explore Coastal Forest', 'Sunset photography'],
                accommodation: 'Beach cottage in quiet surroundings'
            }
        ],
        'adventure': [
            { 
                location: 'Dandeli', 
                description: 'Adventure hub with white water rafting, kayaking and jungle activities.',
                activities: ['White water rafting on Kali River', 'Jungle safari', 'Kayaking', 'Night camping'],
                accommodation: 'Adventure camp by the river'
            },
            { 
                location: 'Kodachadri', 
                description: 'Trek through shola forests to reach this peak in the Western Ghats.',
                activities: ['Kodachadri Peak trek', 'Visit Hidlumane Falls', 'Camping', 'Wildlife spotting'],
                accommodation: 'Trekkers hut or camping at Kodachadri'
            },
            { 
                location: 'Savandurga', 
                description: 'Climb one of the largest monolith hills in Asia for thrilling adventure.',
                activities: ['Rock climbing', 'Trekking to summit', 'Cave exploration', 'Rappelling'],
                accommodation: 'Adventure lodge near Savandurga'
            },
            { 
                location: 'Bheemeshwari', 
                description: 'Experience adventure activities along the Cauvery River.',
                activities: ['River rafting', 'Fishing', 'Zipline adventure', 'Jungle safari'],
                accommodation: 'Jungle lodge by Cauvery River'
            },
            { 
                location: 'Netrani Island', 
                description: 'Discover Karnataka\'s best destination for diving and underwater experiences.',
                activities: ['Scuba diving', 'Snorkeling', 'Island exploration', 'Underwater photography'],
                accommodation: 'Stay in Murudeshwar with day trips to the island'
            },
            { 
                location: 'Yana', 
                description: 'Rock climbing and trekking around the distinctive karst rock formations.',
                activities: ['Rock climbing', 'Cave exploration', 'Trekking', 'Photography of unique rock formations'],
                accommodation: 'Forest guest house near Yana'
            },
            { 
                location: 'Kumara Parvatha', 
                description: 'Challenging trek through Pushpagiri Wildlife Sanctuary to one of Karnataka\'s highest peaks.',
                activities: ['Two-day trek to summit', 'Camping', 'Wildlife spotting', 'Photography'],
                accommodation: 'Camping during trek, homestay in Kukke Subramanya'
            },
            { 
                location: 'Talakaveri', 
                description: 'Trek to the source of the River Cauvery with spiritual significance.',
                activities: ['Hiking to Brahmagiri Peak', 'Visit river source', 'Exploring Western Ghats', 'Temple visit'],
                accommodation: 'Pilgrim guest house in Talakaveri'
            },
            { 
                location: 'Gokarna Trek', 
                description: 'Coastal trek connecting five beautiful beaches with varying terrains.',
                activities: ['Beach trekking', 'Cliff climbing', 'Swimming', 'Coastal camping'],
                accommodation: 'Beach camping or beach huts'
            }
        ],
        'spiritual': [
            { 
                location: 'Sringeri', 
                description: 'Visit one of the four mathas established by Adi Shankaracharya, a major pilgrimage site.',
                activities: ['Visit Sharadamba Temple', 'Explore Vidyashankara Temple', 'Meditation by Tunga River', 'Participate in evening aarti'],
                accommodation: 'Pilgrim guest house near temple'
            },
            { 
                location: 'Udupi', 
                description: 'Experience the spiritual ambiance of the famous Krishna Temple and Ashta Mathas.',
                activities: ['Visit Sri Krishna Matha', 'Tour Ashta Mathas', 'Witness Paryaya ceremony (if timing aligns)', 'Temple cuisine tasting'],
                accommodation: 'Devotee accommodation near temple'
            },
            { 
                location: 'Dharmasthala', 
                description: 'Explore this important pilgrimage center with its Manjunatha Temple.',
                activities: ['Visit Manjunatha Temple', 'Tour Dharma Adhikari residence', 'Explore Car Museum', 'Participate in annadana'],
                accommodation: 'Temple guest house'
            },
            { 
                location: 'Kukke Subramanya', 
                description: 'Visit one of the most sacred abodes of Lord Subramanya (Murugan).',
                activities: ['Temple darshan', 'Kumara Dhara holy bath', 'Shesha darshana ritual', 'Meditation'],
                accommodation: 'Temple accommodation'
            },
            { 
                location: 'Gokarna', 
                description: 'Experience the spiritual side of this beach town with ancient temples.',
                activities: ['Visit Mahabaleshwar Temple', 'Morning rituals at Bhadrakali Temple', 'Koti Teertha sacred pond', 'Sunset meditation at Om Beach'],
                accommodation: 'Pilgrim guest house near temple'
            },
            { 
                location: 'Kollur', 
                description: 'Visit the famous Mookambika Temple dedicated to Goddess Parvati.',
                activities: ['Temple darshan', 'Participate in pujas', 'Visit Kodachadri peak (if able)', 'Meditation'],
                accommodation: 'Temple guest house'
            },
            { 
                location: 'Horanadu', 
                description: 'Experience the serene temple dedicated to Goddess Annapoorneshwari.',
                activities: ['Temple visit', 'Participate in annadana', 'River prayers', 'Evening aarti'],
                accommodation: 'Temple accommodation'
            },
            { 
                location: 'Shravanabelagola', 
                description: 'Important Jain pilgrimage site with the monolithic statue of Gommateshwara.',
                activities: ['Visit Gomateshwara statue', 'Explore Chandragiri Hill', 'Visit Jain Mathas', 'Learn about Jain history'],
                accommodation: 'Pilgrim guest house'
            },
            { 
                location: 'Talakaveri & Bhagamandala', 
                description: 'Visit the source of River Cauvery and important temple at Triveni Sangama.',
                activities: ['Visit Talakaveri temple', 'Witness river source', 'Visit Bhagamandala temple', 'Participate in river rituals'],
                accommodation: 'Pilgrim accommodation in Bhagamandala'
            }
        ],
        'mixed': [
            { 
                location: 'Bengaluru', 
                description: 'Experience Karnataka\'s capital with its mix of history, culture and modernity.',
                activities: ['Visit Bangalore Palace', 'Explore Lalbagh Botanical Garden', 'Shopping at Commercial Street', 'Culinary tour'],
                accommodation: 'City hotel in central location'
            },
            { 
                location: 'Mysore', 
                description: 'Discover the royal city with its palace, cultural heritage and nearby attractions.',
                activities: ['Tour Mysore Palace', 'Visit Chamundi Hills', 'Shop for Mysore silk', 'Experience Devaraja Market'],
                accommodation: 'Heritage hotel near palace'
            },
            { 
                location: 'Coorg', 
                description: 'Experience hill station charm with nature, adventure and local culture.',
                activities: ['Visit Abbey Falls', 'Explore coffee plantations', 'Trek to viewpoints', 'Try Kodava cuisine'],
                accommodation: 'Plantation homestay'
            },
            { 
                location: 'Hampi', 
                description: 'Explore ancient ruins in a unique boulder-strewn landscape.',
                activities: ['Visit Virupaksha Temple', 'Explore ruins', 'Sunset at Matanga Hill', 'Coracle ride on Tungabhadra'],
                accommodation: 'Riverside guest house'
            },
            { 
                location: 'Gokarna', 
                description: 'Experience both spiritual and beach vibes in this unique coastal town.',
                activities: ['Beach hopping', 'Visit Mahabaleshwar Temple', 'Water sports', 'Sunset viewing'],
                accommodation: 'Beach resort or temple guest house'
            },
            { 
                location: 'Badami, Aihole & Pattadakal', 
                description: 'Journey through ancient Chalukyan architectural marvels and cave temples.',
                activities: ['Explore Badami caves', 'Visit Pattadakal temples', 'Tour Aihole archaeological site', 'Photography'],
                accommodation: 'Heritage hotel in Badami'
            },
            { 
                location: 'Udupi & Malpe', 
                description: 'Combine spiritual visit to Krishna Temple with beach relaxation at Malpe.',
                activities: ['Visit Sri Krishna Matha', 'Relax at Malpe Beach', 'Day trip to St. Mary\'s Islands', 'Taste Udupi cuisine'],
                accommodation: 'Temple town hotel or beach resort'
            },
            { 
                location: 'Chikmagalur & Belur-Halebidu', 
                description: 'Experience coffee plantations and ancient Hoysala temple architecture.',
                activities: ['Visit coffee estates', 'Mullayanagiri trek', 'Explore Belur Chennakesava Temple', 'Tour Halebidu temples'],
                accommodation: 'Coffee estate homestay'
            },
            { 
                location: 'Kabini & Nagarhole', 
                description: 'Wildlife experience combined with riverside relaxation.',
                activities: ['Jungle safari', 'Boat ride on Kabini River', 'Bird watching', 'Nature walks'],
                accommodation: 'Wildlife lodge by river'
            }
        ]
    };
    
    // Logic to select from different itinerary options
    let interestOptions;
    
    if (interest === 'mixed') {
        interestOptions = itineraryOptions.mixed;
    } else if (season === 'Monsoon' && (interest === 'beaches' || interest === 'adventure')) {
        // During monsoon, beaches and adventure may not be ideal, redirect to heritage or spiritual
        interestOptions = Math.random() > 0.5 ? itineraryOptions.heritage : itineraryOptions.spiritual;
    } else {
        interestOptions = itineraryOptions[interest];
    }
    
    // Adjust for day number and avoid repeats
    const index = (day - 1) % interestOptions.length;
    const dayPlan = interestOptions[index];
    
    // Adjust accommodation based on travel style
    if (style === 'Luxury') {
        dayPlan.accommodation = dayPlan.accommodation.replace('homestay', 'luxury resort')
            .replace('guest house', 'heritage hotel')
            .replace('cottage', 'premium villa');
    } else if (style === 'Budget') {
        dayPlan.accommodation = dayPlan.accommodation.replace('resort', 'budget hotel')
            .replace('heritage hotel', 'guesthouse')
            .replace('villa', 'hostel dormitory');
    }
    
    return dayPlan;
}

function getBestTimeForInterest(interest, season) {
    const bestTimeMap = {
        'heritage': 'October to March (avoiding summer heat)',
        'nature': 'During and right after monsoon (July to November for lush greenery)',
        'beaches': 'October to February (avoiding monsoon season)',
        'adventure': 'Depends on specific activity - winter for most treks, post-monsoon for water sports',
        'spiritual': 'Year-round, but festival times offer unique experiences',
        'mixed': 'October to February (comfortable weather throughout Karnataka)'
    };
    
    if (season === 'Monsoon' && interest === 'beaches') {
        return 'Current season (Monsoon) is not ideal for beaches. Consider visiting from October onwards.';
    }
    
    return bestTimeMap[interest] || 'October to February (pleasant weather throughout Karnataka)';
}

function getBudgetEstimate(style, days) {
    let basePerDay;
    
    switch(style) {
        case 'Luxury':
            basePerDay = 8000;
            break;
        case 'Budget':
            basePerDay = 2000;
            break;
        default: // Mid-range
            basePerDay = 4000;
            break;
    }
    
    const totalEstimate = basePerDay * days;
    const formattedEstimate = new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(totalEstimate);
    
    return `${formattedEstimate} for ${days} days (approximately ${formattedEstimate.replace(/,/g, '')/days}/day)`;
}

function getTransportationTips(interest, days) {
    if (days <= 3) {
        return 'Self-drive car or hired taxi recommended for short trips';
    }
    
    const transportationTips = {
        'heritage': 'Combination of train between major cities and local taxis for heritage sites',
        'nature': '4x4 vehicle recommended for visiting wildlife sanctuaries and hill stations',
        'beaches': 'Self-drive along the coastal highway with stops at beaches',
        'adventure': 'Combination of public transport and specialized transportation for adventure spots',
        'spiritual': 'Public transportation connects most major temples, taxis recommended for comfort',
        'mixed': 'Self-drive car or private vehicle with driver for maximum flexibility'
    };
    
    return transportationTips[interest] || 'Self-drive car or private vehicle with driver recommended';
}

function styleItineraryResult() {
    // Add some styling to make the itinerary results more appealing
    const daysElements = document.querySelectorAll('.itinerary-day');
    
    daysElements.forEach((day, index) => {
        // Add alternating background colors
        if (index % 2 === 0) {
            day.style.backgroundColor = '#f8f8f8';
        }
        
        // Add some padding and margin
        day.style.padding = '20px';
        day.style.marginBottom = '15px';
        day.style.borderRadius = '8px';
        day.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    });
    
    // Style the headings
    const headings = document.querySelectorAll('#itinerary-result h3, #itinerary-result h4');
    headings.forEach(heading => {
        heading.style.color = '#06603a';
    });
    
    // Style the buttons
    const buttons = document.querySelectorAll('.itinerary-buttons button');
    buttons.forEach(button => {
        button.style.margin = '10px 10px 10px 0';
    });
}

// Initialize Festival Timeline
function initializeFestivalTimeline() {
    const timelineContainer = document.querySelector('.festival-timeline');
    if (!timelineContainer) return;
    
    // Festival data
    const festivals = [
        {
            month: 'January',
            name: 'Kambala Buffalo Race',
            location: 'Coastal Karnataka',
            description: 'Traditional buffalo race held in paddy fields filled with water.'
        },
        {
            month: 'January-February',
            name: 'Pattadakal Dance Festival',
            location: 'Pattadakal',
            description: 'Classical dance performances against the backdrop of UNESCO World Heritage temples.'
        },
        {
            month: 'February',
            name: 'Kichchu Haisodu',
            location: 'Coorg',
            description: 'Fire-walking ritual observed by the Kodava community.'
        },
        {
            month: 'March-April',
            name: 'Karaga Festival',
            location: 'Bengaluru',
            description: 'Ancient festival honoring Draupadi, featuring a priest carrying a floral pyramid.'
        },
        {
            month: 'April',
            name: 'Ugadi',
            location: 'Statewide',
            description: 'Kannada New Year celebration with special food, decorations and festivities.'
        },
        {
            month: 'June-July',
            name: 'Tula Sankramana',
            location: 'Talakaveri',
            description: 'Ritual bathing at the source of River Cauvery during its birth moment.'
        },
        {
            month: 'August-September',
            name: 'Mysore Dasara',
            location: 'Mysore',
            description: 'Royal 10-day celebration featuring illuminated palace, processions, and cultural events.'
        },
        {
            month: 'October',
            name: 'Hampi Utsav',
            location: 'Hampi',
            description: 'Cultural extravaganza celebrating the glory of the Vijayanagara Empire.'
        },
        {
            month: 'November',
            name: 'Kadalekai Parishe',
            location: 'Bengaluru',
            description: 'Traditional groundnut fair held near Bull Temple with cultural significance.'
        },
        {
            month: 'December',
            name: 'Kadambari Dance Festival',
            location: 'Belur',
            description: 'Classical dance performances at the ancient Chennakesava Temple.'
        }
    ];
    
    // Generate timeline HTML
    let timelineHTML = '<div class="timeline-wrapper">';
    festivals.forEach((festival, index) => {
        const isEven = index % 2 === 0;
        timelineHTML += `
            <div class="timeline-item ${isEven ? 'left' : 'right'}">
                <div class="timeline-content">
                    <div class="timeline-date">${festival.month}</div>
                    <h3 class="timeline-title">${festival.name}</h3>
                    <div class="timeline-location">${festival.location}</div>
                    <p class="timeline-description">${festival.description}</p>
                </div>
            </div>
        `;
    });
    timelineHTML += '</div>';
    
    // Insert into the DOM
    timelineContainer.innerHTML = timelineHTML;
    
    // Add animation on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const animateTimeline = () => {
        timelineItems.forEach(item => {
            const itemPosition = item.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (itemPosition < windowHeight * 0.9) {
                item.classList.add('visible');
            }
        });
    };
    
    // Initial check and scroll listener
    animateTimeline();
    window.addEventListener('scroll', animateTimeline);
}

// Lazy Loading Images
function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Weather Widget Implementation
function initializeWeatherWidget() {
    const weatherWidget = document.getElementById('weather-widget');
    if (!weatherWidget) return;
    
    // Sample weather data - in a real application, this would come from an API
    const weatherData = {
        'Bengaluru': { temp: 24, condition: 'Partly Cloudy', icon: 'cloudy' },
        'Mysore': { temp: 26, condition: 'Sunny', icon: 'sunny' },
        'Hampi': { temp: 32, condition: 'Clear', icon: 'sunny' },
        'Coorg': { temp: 22, condition: 'Rainy', icon: 'rainy' },
        'Chikmagalur': { temp: 20, condition: 'Foggy', icon: 'foggy' },
        'Gokarna': { temp: 29, condition: 'Partly Cloudy', icon: 'cloudy' },
        'Udupi': { temp: 28, condition: 'Humid', icon: 'humid' }
    };
    
    // Generate widget HTML
    let weatherHTML = '<h3>Current Weather</h3><div class="weather-cities">';
    
    for (const [city, data] of Object.entries(weatherData)) {
        weatherHTML += `
            <div class="weather-city">
                <h4>${city}</h4>
                <div class="weather-icon ${data.icon}"></div>
                <div class="weather-temp">${data.temp}°C</div>
                <div class="weather-condition">${data.condition}</div>
            </div>
        `;
    }
    
    weatherHTML += '</div>';
    weatherWidget.innerHTML = weatherHTML;
    
    // Add toggle functionality
    const weatherTitle = weatherWidget.querySelector('h3');
    const weatherCities = weatherWidget.querySelector('.weather-cities');
    
    weatherTitle.addEventListener('click', function() {
        weatherCities.classList.toggle('collapsed');
        weatherTitle.classList.toggle('collapsed');
    });
}

// Initialize Google Maps (placeholder function)
function initializeMap() {
    const mapContainer = document.getElementById('karnataka-map');
    if (!mapContainer) return;
    
    // In a real application, this would initialize a Google Map
    // For now, just add a placeholder
    mapContainer.innerHTML = `
        <div class="map-placeholder">
            <p>Interactive Karnataka Tourism Map</p>
            <p class="small">(Map integration would be implemented here)</p>
        </div>
    `;
}

// Initialize everything on window load
window.addEventListener('load', function() {
    initializeWeatherWidget();
    initializeMap();
    
    // Initialize any sliders or carousels
    if (document.querySelector('.testimonial-slider')) {
        // Simple slider functionality
        const testimonials = document.querySelectorAll('.testimonial-item');
        const prevBtn = document.querySelector('.slider-prev');
        const nextBtn = document.querySelector('.slider-next');
        let currentIndex = 0;
        
        function showTestimonial(index) {
            testimonials.forEach((item, i) => {
                item.style.display = i === index ? 'block' : 'none';
            });
        }
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', function() {
                currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
                showTestimonial(currentIndex);
            });
            
            nextBtn.addEventListener('click', function() {
                currentIndex = (currentIndex + 1) % testimonials.length;
                showTestimonial(currentIndex);
            });
        }
        
        // Initialize with first testimonial
        showTestimonial(currentIndex);
    }
    
    // Add share buttons functionality
    const shareButtons = document.querySelectorAll('.share-button');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const shareType = this.getAttribute('data-share');
            const pageUrl = encodeURIComponent(window.location.href);
            const pageTitle = encodeURIComponent(document.title);
            
            let shareUrl;
            
            switch(shareType) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://api.whatsapp.com/send?text=${pageTitle} ${pageUrl}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=${pageTitle}&body=Check out this link: ${pageUrl}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
});