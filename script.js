document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px)';
        this.style.background = 'rgba(255, 255, 255, 0.05)';
        this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.background = 'rgba(255, 255, 255, 0.03)';
        this.style.borderColor = 'rgba(255, 255, 255, 0.06)';
    });

    let isDragging = false;
    let startX;
    let scrollLeft;

    card.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - card.offsetLeft;
        scrollLeft = card.parentElement.scrollLeft;
        card.style.cursor = 'grabbing';
    });

    card.addEventListener('mouseleave', () => {
        isDragging = false;
        card.style.cursor = 'pointer';
    });

    card.addEventListener('mouseup', () => {
        isDragging = false;
        card.style.cursor = 'pointer';
    });

    card.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - card.offsetLeft;
        const walk = (x - startX) * 3;
        card.parentElement.scrollLeft = scrollLeft - walk;
    });

    card.addEventListener('click', function() {
        const title = this.getAttribute('data-title');
        const description = this.getAttribute('data-description');
        const images = this.getAttribute('data-images').split(',');

        const projectDetails = getProjectDetails(title);
        if (projectDetails.hasMLLayout) {
            const popupOverlay = createPopupOverlay();
            const popupContent = createMLLayout(title, projectDetails);
            popupOverlay.innerHTML = popupContent;
            popupOverlay.style.display = 'flex';
            
            document.body.style.overflow = 'hidden';
            
            const closeBtn = popupOverlay.querySelector('.close-btn');
            closeBtn.addEventListener('click', closePopup);
            return; 
        } else if (projectDetails.hasPDFLayout) {
            const popupOverlay = createPopupOverlay();
            let popupContent;
            
            if (title === "Fit4Less") {
                popupContent = createPDFLayout(title, projectDetails);
            } else if (title === "Inventory Control System") {
                popupContent = createInventoryPDFLayout(title, projectDetails);
            } else if (title === "MatchIt") {
                popupContent = createMatchItPDFLayout(title, projectDetails);
            }
            
            popupOverlay.innerHTML = popupContent;
            popupOverlay.style.display = 'flex';
            
            document.body.style.overflow = 'hidden';
            
            const closeBtn = popupOverlay.querySelector('.close-btn');
            closeBtn.addEventListener('click', closePopup);
            return; 
        }

        const projectDisplay = document.querySelector('.project-display');
        projectDisplay.querySelector('h2').textContent = title;
        projectDisplay.querySelector('p').textContent = description;

        updateProjectDetails(projectDetails);

        const mainImageContainer = document.querySelector('.main-image');
        const thumbnailsContainer = projectDisplay.querySelector('.image-thumbnails');
        
        if (images.length > 0) {
            const firstImageSrc = images[0].includes('/') ? images[0] : `images/cardimages/${images[0]}`;
            const isFirstVideo = images[0].endsWith('.mp4') || images[0].endsWith('.webm') || images[0].endsWith('.mov');
            
            mainImageContainer.innerHTML = '';
            
            if (isFirstVideo) {
                const mainVideo = document.createElement('video');
                mainVideo.src = firstImageSrc;
                mainVideo.controls = true;
                mainVideo.style.maxWidth = '100%';
                mainVideo.style.maxHeight = '100%';
                mainVideo.style.borderRadius = '8px';
                mainVideo.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
                mainImageContainer.appendChild(mainVideo);
            } else {
                const mainImg = document.createElement('img');
                mainImg.src = firstImageSrc;
                mainImg.alt = "Main Project Image";
                mainImg.style.maxWidth = '100%';
                mainImg.style.maxHeight = '100%';
                mainImg.style.objectFit = 'contain';
                mainImg.style.borderRadius = '8px';
                mainImg.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
                mainImageContainer.appendChild(mainImg);
            }
        }

        thumbnailsContainer.innerHTML = '';
        images.forEach((src, index) => {
            const thumbnailSrc = src.includes('/') ? src : `images/cardimages/${src}`;
            const isVideo = src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov');
            
            if (isVideo) {
                const videoElement = document.createElement('video');
                videoElement.src = thumbnailSrc;
                videoElement.className = 'thumbnail video-thumbnail';
                videoElement.muted = true;
                videoElement.preload = 'metadata';
                if (index === 0) videoElement.classList.add('active');
                
                videoElement.addEventListener('click', () => {
                    const mainImageContainer = document.querySelector('.main-image');
                    
                    mainImageContainer.innerHTML = '';
                    
                    const mainVideo = document.createElement('video');
                    mainVideo.src = thumbnailSrc;
                    mainVideo.controls = true;
                    mainVideo.autoplay = true;
                    mainVideo.style.maxWidth = '100%';
                    mainVideo.style.maxHeight = '100%';
                    mainVideo.style.borderRadius = '8px';
                    mainVideo.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
                    
                    mainImageContainer.appendChild(mainVideo);
                    
                    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                    videoElement.classList.add('active');
                });
                
                thumbnailsContainer.appendChild(videoElement);
            } else {
                const thumbnail = document.createElement('img');
                thumbnail.src = thumbnailSrc;
                thumbnail.className = 'thumbnail';
                if (index === 0) thumbnail.classList.add('active');
                
                thumbnail.addEventListener('click', () => {
                    const mainImageContainer = document.querySelector('.main-image');
                    
                    mainImageContainer.innerHTML = '';
                    
                    const mainImg = document.createElement('img');
                    mainImg.src = thumbnail.src;
                    mainImg.alt = "Main Project Image";
                    mainImg.style.maxWidth = '100%';
                    mainImg.style.maxHeight = '100%';
                    mainImg.style.objectFit = 'contain';
                    mainImg.style.borderRadius = '8px';
                    mainImg.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
                    
                    mainImageContainer.appendChild(mainImg);
                    
                    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                    thumbnail.classList.add('active');
                });
                
                thumbnailsContainer.appendChild(thumbnail);
            }
        });

        let projectOverlay = document.getElementById('project-overlay');
        if (!projectOverlay) {
            projectOverlay = document.createElement('div');
            projectOverlay.id = 'project-overlay';
            projectOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(10px);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                padding: 20px;
                box-sizing: border-box;
            `;
            document.body.appendChild(projectOverlay);
            
            projectOverlay.addEventListener('click', function(e) {
                if (e.target === projectOverlay) {
                    closePopup();
                }
            });
        }
        
        projectOverlay.style.display = 'flex';
        projectDisplay.style.display = 'block';
        
        document.body.style.overflow = 'hidden';
    });
});

const projectDisplay = document.querySelector('.project-display');
const closeBtn = document.querySelector('.close-btn');

if (closeBtn && projectDisplay) { 
    closeBtn.addEventListener('click', closePopup);
}

const gameGrid = document.querySelector('.game-grid');
const arrowLeft = document.querySelector('.arrow-left');
const arrowRight = document.querySelector('.arrow-right');

arrowLeft.addEventListener('click', () => {
    gameGrid.scrollBy({ left: -200, behavior: 'smooth' });
});

arrowRight.addEventListener('click', () => {
    gameGrid.scrollBy({ left: 200, behavior: 'smooth' });
});

document.querySelector('.search-input').addEventListener('focus', function() {
    this.parentElement.style.border = '1px solid #00ffff';
    this.parentElement.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
});

document.querySelector('.search-input').addEventListener('blur', function() {
    this.parentElement.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    this.parentElement.style.boxShadow = 'none';
});

function getProjectDetails(projectTitle) {
    const projectData = {
        "Stajsis.com": {
            techStack: ".NET, Blazor WASM, Neo4j",
            devTime: "6 months",
            teamSize: "3 developers",
            projectType: "Web Application",
            platform: "VPS Server",
            database: "Neo4j Graph Database",
            framework: "Blazor WebAssembly"
        },
        "Google Oyun ve Uygulama Akademisi": {
            techStack: "Unity, C#, Mobile Development",
            devTime: "3 months",
            teamSize: "Solo + Mentorship",
            projectType: "Educational Program",
            platform: "Multi-platform",
            achievement: "Selected among top 25",
            role: "Team Leader & Developer"
        },
        "Academy Invasion": {
            techStack: "Unity, C#, .NET",
            devTime: "48 hours",
            teamSize: "5 developers",
            projectType: "Game Jam Project",
            platform: "HTML5",
            gameGenre: "Top-down Action Game",
            role: "Team Captain & Developer",
            organizer: "Google Game Jam 2023",
            concept: "Academy Adventures",
            hasGameLinks: true,
            itchioLink: "https://sisedess.itch.io/akademi-istilasi",
            youtubeLink: "https://www.youtube.com/watch?v=tQJxbMJJFWI"
        },
        "Humanity Survival": {
            techStack: "Unity, C#, .NET, 3D Graphics",
            devTime: "30 days",
            teamSize: "5 developers",
            projectType: "Bootcamp Final Project",
            platform: "Multi-platform",
            gameGenre: "3D Action Shooter",
            role: "Team Developer",
            organizer: "Google Play & App Academy 2023",
            achievement: "Ranked among Top 25",
            theme: "Environmental Technology Conflict",
            gameplayMechanics: "Combat, Strategy, Moral Choices",
            hasGameLinks: true,
            reportLink: "https://docs.google.com/document/d/1OmGltQbiItrAYsOtMvvCLExn34T5AwVcZfGZSvQX_S8/edit?resourcekey=0-zrzSgBFK1WABuMY8ZKRENw&tab=t.0#heading=h.wri23awpennh"
        },
        "AstroAR": {
            techStack: "Unity, C#, .NET, ARKit, ARCore, ARFoundation",
            projectType: "Educational AR Application",
            platform: "iOS & Android",
            targetAudience: "Elementary School Children",
            category: "Augmented Reality Education",
            subject: "Solar System & Astronomy",
            framework: "ARFoundation (ARKit/ARCore)",
            features: "3D Planet Visualization, Interactive Quizzes, Gamification",
            learningMethod: "Visual & Interactive Learning",
            content: "Detailed Planet Information, Rotation Animations, Puzzles",
            objective: "Making Astronomy Fun and Accessible for Children"
        },
        "Class Schedule System with Augmented Reality": {
            techStack: "Unity, C#, .NET, Vuforia Engine, PHP, SQL",
            projectType: "Educational Management System",
            platform: "Mobile Application",
            targetAudience: "Students, Teachers, Administrators",
            category: "Augmented Reality School Management",
            database: "SQL Database",
            backend: "PHP Backend Integration",
            arFramework: "Vuforia Engine",
            features: "AR Class Recognition, Schedule Management, Real-time Updates",
            functionality: "View, Edit, Update Class Schedules",
            interface: "Intuitive User-friendly Interface",
            arCapability: "Scan Classroom Names for Schedule Access",
            dataIntegration: "Database Integration with Instant Feedback",
            userRoles: "Multi-user Access (Students/Teachers/Admins)",
            objective: "Making School Schedule Management Accessible and User-friendly"
        },
        "Fit4Less": {
            techStack: "Android Studio, Kotlin, Firebase, Gson, OkHttp, Retrofit",
            projectType: "Health & Fitness Mobile Application",
            platform: "Android",
            targetAudience: "Athletes and Fitness Enthusiasts",
            category: "Health & Fitness",
            database: "Google Firebase",
            apiFramework: "Retrofit, OkHttp, Gson",
            features: "Water Reminder, Calorie Checker, BMI Calculator, Exercise Demonstrations",
            functionality: "Track Health Metrics, Nutritional Information, Workout Guidance",
            healthFeatures: "Hydration Tracking, Nutritional Analysis, Body Mass Index",
            exerciseContent: "Various Workout Exercise Demonstrations",
            dataStorage: "Cloud-based Firebase Integration",
            hasPDFLayout: true,
            pdfPath: "docs/fit4less_rapor.pdf",
            objective: "Comprehensive Health and Fitness Tracking for Athletes"
        },
        "Inventory Control System": {
            techStack: "Android Studio, Java, PHP, SQL, Volley, Retrofit",
            projectType: "Warehouse Management System",
            platform: "Android",
            targetAudience: "Warehouse Managers, Inventory Staff, Business Owners",
            category: "Business Management",
            database: "SQL Database",
            backend: "PHP Backend",
            programmingLanguage: "Java",
            apiFramework: "Volley, Retrofit",
            features: "Product Management, Inventory Tracking, Warehouse Operations",
            functionality: "Manage New Products, Perform Inventory Checks",
            inventoryFeatures: "Product Addition, Stock Monitoring, Warehouse Control",
            systemCapabilities: "Real-time Inventory Updates, Product Database Management",
            businessFunctions: "Stock Level Monitoring, Product Registration, Inventory Reports",
            networkLibraries: "Volley and Retrofit for API connections",
            dataConnectivity: "Database connections via API endpoints",
            hasPDFLayout: true,
            pdfPath: "docs/envanter_rapor.pdf",
            objective: "Efficient Warehouse and Inventory Management System"
        },

        "Smart Stop Navigation System": {
            techStack: "Android Studio, Kotlin, XML, Google APIs",
            projectType: "Accessibility Navigation System",
            platform: "Android",
            targetAudience: "Individuals with Visual Impairments, Elderly Users, General Public",
            category: "Accessibility & Navigation",
            programmingLanguage: "Kotlin",
            markupLanguage: "XML",
            apiIntegration: "Google APIs",
            features: "Voice Commands, Smart Navigation, Audio Guidance, Accessibility Support",
            functionality: "Voice-based Search, Navigation, Information Services",
            accessibilityFeatures: "Voice Commands, Audio Feedback, Intuitive UI, User Privacy",
            navigationCapabilities: "Fastest Route Finding, Traffic Updates, Safety-focused Routing",
            voiceFeatures: "Voice Command Navigation, Audio Directions, Interactive Voice Experience",
            systemGoals: "Accessible Navigation for All Users",
            userExperience: "Intuitive and Accessible Interface Design",
            privacySecurity: "Data Security and User Privacy Priority",
            images: ["images/navigasyon/1.png", "images/navigasyon/2.png", "images/navigasyon/3.png", "images/navigasyon/4.png"],
            hasImages: true,
            imageCount: 4,
            objective: "Voice-based Navigation System for Enhanced Accessibility"
        },

        "MatchIt": {
            techStack: "HTML, CSS, JavaScript, PHP, Docker, AWS",
            projectType: "Social Impact Web Application",
            platform: "Web Application",
            targetAudience: "Children with Autism, Educators, Families",
            category: "Social Impact & Education",
            programmingLanguages: "PHP, JavaScript",
            markupLanguages: "HTML, CSS",
            cloudTechnology: "Docker, AWS",
            deploymentPlatform: "Amazon Web Services (AWS)",
            virtualizationTech: "Docker Containers, Type-1 Hypervisor",
            features: "Card Matching Game, Web Interface, Autism Development Support, Awareness Building",
            functionality: "Interactive Card Matching Game for Autism Development",
            socialImpact: "Contributing to autism awareness and child development",
            gameFeatures: "Card Matching Mechanics, Educational Gameplay, Child-friendly Interface",
            technicalArchitecture: "Dockerized Backend, Cloud Deployment, Scalable Web Application",
            cloudInfrastructure: "AWS Cloud Services, Docker Containerization",
            educationalGoals: "Autism Development Support, Awareness Creation",
            webTechnologies: "Frontend and Backend Web Development",
            containerization: "Docker Virtualization for Backend Services",
            hasPDFLayout: true,
            pdfPath: "docs/matchit_rapor.pdf",
            objective: "Web-based Card Matching Game for Autism Development and Awareness"
        },

        "Oyun Kutusu": {
            techStack: "HTML, CSS, JavaScript",
            projectType: "E-commerce Website",
            platform: "Web Application",
            targetAudience: "Board Game Enthusiasts, Families, Gamers",
            category: "Web Development & E-commerce",
            programmingLanguage: "JavaScript",
            markupLanguages: "HTML, CSS",
            features: "Product Catalog, Shopping Cart, User Authentication, Responsive Design",
            functionality: "Complete E-commerce Solution for Board Game Sales",
            ecommerceFeatures: "Product Categories, Shopping Cart, User Accounts, Order Management",
            designFeatures: "Modern UI/UX, Responsive Layout, Interactive Elements",
            productCategories: "Card Games, Board Games, Kids Games, Accessories",
            businessFeatures: "Campaign Management, Announcements, Customer Support",
            webFeatures: "Contact Forms, About Pages, Blog Section, FAQ",
            uiComponents: "Navigation Menu, Product Grid, Search Functionality",
            designPrinciples: "User-friendly Interface, Professional Layout, Mobile Responsive",
            projectScope: "Full-featured Board Game Sales Website",
            liveWebsite: "https://sisedes.github.io/KutuOyunu-Satis-Sitesi/",
            hasLiveLink: true,
            images: ["images/kutuoyun/1.png", "images/kutuoyun/2.png"],
            hasImages: true,
            imageCount: 2,
            objective: "Professional E-commerce Website for Board Game Sales"
        },

        "Umuttepe Turizm": {
            techStack: "CodeIgniter 4, PHP, SQL, JavaScript, HTML, CSS",
            projectType: "Transportation Booking System",
            platform: "Web Application",
            targetAudience: "Travelers, Bus Passengers, Transportation Companies",
            category: "Tourism & Transportation",
            framework: "CodeIgniter 4",
            programmingLanguages: "PHP, JavaScript",
            markupLanguages: "HTML, CSS",
            database: "SQL Database",
            features: "Online Ticket Booking, Route Management, Reservation System, Customer Management",
            functionality: "Complete Bus Ticket Sales and Reservation System",
            bookingFeatures: "Route Search, Ticket Purchase, Online Reservations, Seat Selection",
            customerFeatures: "User Registration, Booking History, Reservation Management",
            businessFeatures: "Route Management, Schedule Planning, Revenue Tracking",
            systemFeatures: "Secure Data Management, Payment Processing, Booking Confirmation",
            userExperience: "User-friendly Interface, Easy Navigation, Customer Satisfaction",
            dataManagement: "Secure Bus Schedules, Customer Data, Reservation Records",
            deploymentStatus: "Deployed on Live Server",
            travelServices: "Intercity Bus Ticket Sales, Travel Planning, Route Information",
            reservationCapabilities: "Real-time Booking, Seat Availability, Schedule Management",
            securityFeatures: "Secure Payment Processing, Data Protection, User Authentication",
            images: ["images/umuttepe/1.png", "images/umuttepe/2.png", "images/umuttepe/3.png", "images/umuttepe/4.png"],
            hasImages: true,
            imageCount: 4,
            objective: "Professional Bus Ticket Booking and Reservation System"
        },

        "A Digitalized Business Wargame Model for Foresight-based Future Planning and Decision-Making": {
            techStack: "Unity, C#, .NET, PostgreSQL, NLP",
            database: "PostgreSQL",
            framework: "Unity Game Engine",
            aiFeatures: "Classification, Prediction, NLP",
            collaboration: "TUSAŞ LIFT UP",
            conference: "ICHORA 2025 (IEEE Indexed)",
            hasAcademic: true,
            ieeeLink: "https://ieeexplore.ieee.org/document/11017175",
            posterPdf: "docs/tusas_poster.pdf"
        },
        "A Computer Vision-Based Physical Activity Application for Children with Autism": {
            techStack: "Unity, C#, Python, OpenCV, MediaPipe",
            database: "PostgreSQL",
            framework: "Unity Game Engine",
            collaboration: "İzmit Municipality Autism Center",
            patent: "Patent Application Filed",
            conference: "ICHORA 2025 (IEEE Indexed)",
            hasAcademic: true,
            ieeeLink: "https://ieeexplore.ieee.org/document/11017104",
            posterPdf: "docs/otizm_poster.pdf"
        },
        "Buried Conquest": {
            techStack: "Unity, C#, .NET",
            framework: "Unity Game Engine",
            gameGenre: "Rogue-like, Deck-building",
            company: "FingerPrintStudio",
            exhibition: "6. Doğu Marmara Project Fair",
            program: "Digiage Gaming Startup Program",
            hasEntrepreneurship: true,
            exhibitionPoster: "docs/fps_poster.pdf",
            demoVideo: "images/buried/1.mp4"
        },
        "MACHINE LEARNING - Poetry Project": {
            techStack: "Python, Selenium, BERT, RoBERTa, DistilBERT",
            framework: "Transformers, TensorFlow, PyTorch",
            algorithms: "BERT, RoBERTa, DistilBERT, Electra, GPT",
            dataSource: "Turkish Literature Poems",
            classification: "Literary Movements Classification",
            accuracy: "94.2% Best Model Performance",
            hasMLLayout: true,
            models: ["BERT", "RoBERTa", "DistilBERT", "Electra", "GPT"],
            results: {
                "BERT": "91.8%",
                "RoBERTa": "94.2%",
                "DistilBERT": "89.5%",
                "Electra": "92.1%",
                "GPT": "88.7%"
            }
        },
        "default": {
            techStack: "Various Technologies",
            devTime: "Variable",
            teamSize: "1-5 developers",
            projectType: "Software Project",
            platform: "Multi-platform",
            status: "Completed"
        }
    };

    return projectData[projectTitle] || projectData["default"];
}

function updateProjectDetails(details) {
    document.getElementById('tech-stack').textContent = details.techStack;
    
    const detailsContainer = document.querySelector('.project-details');
    
    const extraRows = detailsContainer.querySelectorAll('.extra-detail');
    extraRows.forEach(row => row.remove());
    
    if (details.database) {
        addDetailRow(detailsContainer, 'Database:', details.database);
    }
    if (details.framework) {
        addDetailRow(detailsContainer, 'Framework:', details.framework);
    }
    if (details.achievement) {
        addDetailRow(detailsContainer, 'Achievement:', details.achievement);
    }
    if (details.role) {
        addDetailRow(detailsContainer, 'Role:', details.role);
    }
    if (details.aiFeatures) {
        addDetailRow(detailsContainer, 'AI Features:', details.aiFeatures);
    }
    if (details.collaboration) {
        addDetailRow(detailsContainer, 'Collaboration:', details.collaboration);
    }
    if (details.patent) {
        addDetailRow(detailsContainer, 'Patent Status:', details.patent);
    }
    if (details.conference) {
        addDetailRow(detailsContainer, 'Publication:', details.conference);
    }
    if (details.gameGenre) {
        addDetailRow(detailsContainer, 'Game Genre:', details.gameGenre);
    }
    if (details.company) {
        addDetailRow(detailsContainer, 'Company:', details.company);
    }
    if (details.exhibition) {
        addDetailRow(detailsContainer, 'Exhibition:', details.exhibition);
    }
    if (details.program) {
        addDetailRow(detailsContainer, 'Program:', details.program);
    }
    if (details.organizer) {
        addDetailRow(detailsContainer, 'Organizer:', details.organizer);
    }
    if (details.concept) {
        addDetailRow(detailsContainer, 'Concept:', details.concept);
    }
    if (details.theme) {
        addDetailRow(detailsContainer, 'Theme:', details.theme);
    }
    if (details.gameplayMechanics) {
        addDetailRow(detailsContainer, 'Gameplay:', details.gameplayMechanics);
    }
    if (details.targetAudience) {
        addDetailRow(detailsContainer, 'Target Audience:', details.targetAudience);
    }
    if (details.category) {
        addDetailRow(detailsContainer, 'Category:', details.category);
    }
    if (details.subject) {
        addDetailRow(detailsContainer, 'Subject:', details.subject);
    }
    if (details.features) {
        addDetailRow(detailsContainer, 'Features:', details.features);
    }
    if (details.learningMethod) {
        addDetailRow(detailsContainer, 'Learning Method:', details.learningMethod);
    }
    if (details.content) {
        addDetailRow(detailsContainer, 'Content:', details.content);
    }
    if (details.objective) {
        addDetailRow(detailsContainer, 'Objective:', details.objective);
    }
    if (details.backend) {
        addDetailRow(detailsContainer, 'Backend:', details.backend);
    }
    if (details.arFramework) {
        addDetailRow(detailsContainer, 'AR Framework:', details.arFramework);
    }
    if (details.functionality) {
        addDetailRow(detailsContainer, 'Functionality:', details.functionality);
    }
    if (details.interface) {
        addDetailRow(detailsContainer, 'Interface:', details.interface);
    }
    if (details.arCapability) {
        addDetailRow(detailsContainer, 'AR Capability:', details.arCapability);
    }
    if (details.dataIntegration) {
        addDetailRow(detailsContainer, 'Data Integration:', details.dataIntegration);
    }
    if (details.userRoles) {
        addDetailRow(detailsContainer, 'User Roles:', details.userRoles);
    }
    if (details.apiFramework) {
        addDetailRow(detailsContainer, 'API Framework:', details.apiFramework);
    }
    if (details.healthFeatures) {
        addDetailRow(detailsContainer, 'Health Features:', details.healthFeatures);
    }
    if (details.exerciseContent) {
        addDetailRow(detailsContainer, 'Exercise Content:', details.exerciseContent);
    }
    if (details.dataStorage) {
        addDetailRow(detailsContainer, 'Data Storage:', details.dataStorage);
    }
    if (details.programmingLanguage) {
        addDetailRow(detailsContainer, 'Programming Language:', details.programmingLanguage);
    }
    if (details.inventoryFeatures) {
        addDetailRow(detailsContainer, 'Inventory Features:', details.inventoryFeatures);
    }
    if (details.systemCapabilities) {
        addDetailRow(detailsContainer, 'System Capabilities:', details.systemCapabilities);
    }
    if (details.businessFunctions) {
        addDetailRow(detailsContainer, 'Business Functions:', details.businessFunctions);
    }
    
    const gameLinksSection = document.querySelector('.game-links-section');
    if (details.hasGameLinks) {
        gameLinksSection.style.display = 'block';
        
        const itchioItem = document.querySelector('.game-link-item.playable');
        const videoItem = document.querySelector('.game-link-item.video');
        
        if (details.itchioLink) {
            itchioItem.style.display = 'flex';
            document.getElementById('itchio-link').href = details.itchioLink;
        } else if (details.reportLink) {
            itchioItem.style.display = 'flex';
            itchioItem.querySelector('.game-link-title').textContent = 'Project Report';
            itchioItem.querySelector('.game-link-subtitle').textContent = 'View detailed report';
            itchioItem.querySelector('.game-link-icon').textContent = '📄';
            document.getElementById('itchio-link').href = details.reportLink;
            document.getElementById('itchio-link').textContent = 'View Report';
        } else {
            itchioItem.style.display = 'none';
        }
        
        if (details.youtubeLink) {
            videoItem.style.display = 'flex';
            document.getElementById('youtube-link').href = details.youtubeLink;
        } else {
            videoItem.style.display = 'none';
        }
    } else {
        gameLinksSection.style.display = 'none';
    }
    
    const academicSection = document.querySelector('.academic-section');
    if (details.hasAcademic) {
        academicSection.style.display = 'block';
        
        if (details.ieeeLink) {
            document.getElementById('ieee-link').href = details.ieeeLink;
        }
        
        if (details.posterPdf) {
            document.getElementById('poster-link').href = details.posterPdf;
        }
    } else {
        academicSection.style.display = 'none';
    }
    
    const entrepreneurshipSection = document.querySelector('.entrepreneurship-section');
    if (details.hasEntrepreneurship) {
        entrepreneurshipSection.style.display = 'block';
        
        if (details.exhibitionPoster) {
            document.getElementById('exhibition-poster').href = details.exhibitionPoster;
        }
        
        if (details.demoVideo) {
            document.getElementById('demo-video').href = details.demoVideo;
        }
    } else {
        entrepreneurshipSection.style.display = 'none';
    }
    
    const liveWebsiteSection = document.querySelector('.live-website-section');
    if (details.hasLiveLink && details.liveWebsite) {
        if (!liveWebsiteSection) {
            const projectInfo = document.querySelector('.project-info');
            const newSection = document.createElement('div');
            newSection.className = 'live-website-section';
            newSection.innerHTML = `
                <h3>🌐 Live Website</h3>
                <div class="live-website-items">
                    <div class="live-website-item">
                        <div class="live-website-icon">🔗</div>
                        <div class="live-website-content">
                            <div class="live-website-title">Visit Live Website</div>
                            <div class="live-website-subtitle">Experience the project online</div>
                            <a href="${details.liveWebsite}" class="live-website-link" target="_blank">View Live Site</a>
                        </div>
                    </div>
                </div>
            `;
            
            const insertAfter = document.querySelector('.entrepreneurship-section') || document.querySelector('.project-details');
            insertAfter.after(newSection);
        } else {
            liveWebsiteSection.style.display = 'block';
            liveWebsiteSection.querySelector('.live-website-link').href = details.liveWebsite;
        }
    } else if (liveWebsiteSection) {
        liveWebsiteSection.style.display = 'none';
    }
}

function addDetailRow(container, label, value) {
    const row = document.createElement('div');
    row.className = 'detail-row extra-detail';
    row.innerHTML = `
        <span class="detail-label">${label}</span>
        <span class="detail-value">${value}</span>
    `;
    container.appendChild(row);
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    document.querySelector('.time').textContent = timeString.toLowerCase();
}

updateTime();
setInterval(updateTime, 1000); 

function createMLLayout(gameTitle, gameInfo) {
    return `
        <div class="popup-container ml-layout">
            <button class="close-btn">×</button>
            <div class="popup-content">
                <div class="ml-left-panel">
                    <div class="ml-header">
                        <h2>${gameTitle}</h2>
                        <div class="project-description">
                            <p>In the first phase of the project, text mining was performed using Selenium to collect poems from Turkish literature. The collected data was then augmented using natural language processing techniques. Following this, five different transformer models—BERT, RoBERTa, DistilBERT, Electra, and GPT—were trained to classify the poems according to their literary movements (e.g., Second New, Garip Movement, etc.), and the results were documented and reported.</p>
                        </div>
                        <div class="ml-stats">
                            <div class="stat-item">
                                <span class="stat-label">Best Model:</span>
                                <span class="stat-value">RoBERTa (94.2%)</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Dataset:</span>
                                <span class="stat-value">${gameInfo.dataSource}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Project Report:</span>
                                <span class="stat-value">Detailed Analysis</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="ml-section pdf-section">
                        <h3>📄 Project Report</h3>
                        <div class="pdf-container">
                            <embed src="docs/makine_rapor.pdf" type="application/pdf" width="100%" height="600px">
                            <p>If PDF cannot be displayed, <a href="docs/makine_rapor.pdf" target="_blank" class="pdf-link">click here to open the report</a></p>
                        </div>
                    </div>
                </div>
                
                <div class="ml-right-panel">
                    <div class="ml-details">
                        <div class="detail-section">
                            <h3>🔧 Technology Stack</h3>
                            <div class="tech-stack">${gameInfo.techStack}</div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>🏗️ Framework</h3>
                            <div class="framework">${gameInfo.framework}</div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>🎯 Project Objective</h3>
                            <div class="objective">
                                Classification of Turkish literature poems according to literary movements
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>📈 Methodology</h3>
                            <div class="methodology">
                                <div class="method-step">
                                    <div class="step-number">1</div>
                                    <div class="step-content">
                                        <strong>Data Collection:</strong> Web scraping with Selenium
                                    </div>
                                </div>
                                <div class="method-step">
                                    <div class="step-number">2</div>
                                    <div class="step-content">
                                        <strong>Data Augmentation:</strong> Dataset expansion using NLP techniques
                                    </div>
                                </div>
                                <div class="method-step">
                                    <div class="step-number">3</div>
                                    <div class="step-content">
                                        <strong>Model Training:</strong> 5 different transformer models
                                    </div>
                                </div>
                                <div class="method-step">
                                    <div class="step-number">4</div>
                                    <div class="step-content">
                                        <strong>Evaluation:</strong> Comparative performance analysis
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>🏆 Results</h3>
                            <div class="results-summary">
                                <div class="result-item">
                                    <span class="result-icon">🥇</span>
                                    <span>Best performing model: <strong>RoBERTa (94.2%)</strong></span>
                                </div>
                                <div class="result-item">
                                    <span class="result-icon">📊</span>
                                    <span>Average accuracy: <strong>91.3%</strong></span>
                                </div>
                                <div class="result-item">
                                    <span class="result-icon">🎯</span>
                                    <span>Classification: <strong>${gameInfo.classification}</strong></span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>📚 Literary Movements</h3>
                            <div class="literary-movements">
                                <div class="movement-tag">İkinci Yeni</div>
                                <div class="movement-tag">Garip Hareketi</div>
                                <div class="movement-tag">Toplumcu Gerçekçilik</div>
                                <div class="movement-tag">Birinci Yeni</div>
                                <div class="movement-tag">Hece Vezni</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}



function createPDFLayout(gameTitle, gameInfo) {
    return `
        <div class="popup-container ml-layout">
            <button class="close-btn">×</button>
            <div class="popup-content">
                <div class="ml-left-panel">
                    <div class="ml-header">
                        <h2>${gameTitle}</h2>
                        <div class="project-description">
                            <p>A comprehensive health and fitness application developed for athletes using Android Studio, Kotlin, and Firebase. The app includes essential features like water reminder notifications, a food calorie content checker, a body mass index (BMI) calculator, and a comprehensive section demonstrating various workout exercises to help users maintain their fitness goals.</p>
                        </div>
                        <div class="ml-stats">
                            <div class="stat-item">
                                <span class="stat-label">Platform:</span>
                                <span class="stat-value">${gameInfo.platform}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Database:</span>
                                <span class="stat-value">${gameInfo.database}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Target Users:</span>
                                <span class="stat-value">${gameInfo.targetAudience}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="ml-section pdf-section">
                        <h3>📄 Project Report</h3>
                        <div class="pdf-container">
                            <embed src="${gameInfo.pdfPath}" type="application/pdf" width="100%" height="600px">
                            <p>If PDF cannot be displayed, <a href="${gameInfo.pdfPath}" target="_blank" class="pdf-link">click here to open the report</a></p>
                        </div>
                    </div>
                </div>
                
                <div class="ml-right-panel">
                    <div class="ml-details">
                        <div class="detail-section">
                            <h3>📱 Technology Stack</h3>
                            <div class="tech-stack">${gameInfo.techStack}</div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>🔥 Key Features</h3>
                            <div class="features-list">
                                <div class="feature-item">
                                    <span class="feature-icon">💧</span>
                                    <span class="feature-text">Water Reminder System</span>
                                </div>
                                <div class="feature-item">
                                    <span class="feature-icon">🍎</span>
                                    <span class="feature-text">Food Calorie Checker</span>
                                </div>
                                <div class="feature-item">
                                    <span class="feature-icon">⚖️</span>
                                    <span class="feature-text">BMI Calculator</span>
                                </div>
                                <div class="feature-item">
                                    <span class="feature-icon">💪</span>
                                    <span class="feature-text">Exercise Demonstrations</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>⚙️ Technical Implementation</h3>
                            <div class="tech-implementation">
                                <div class="tech-step">
                                    <div class="step-number">1</div>
                                    <div class="step-content">
                                        <strong>Android Development:</strong> Built with Android Studio and Kotlin
                                    </div>
                                </div>
                                <div class="tech-step">
                                    <div class="step-number">2</div>
                                    <div class="step-content">
                                        <strong>Cloud Storage:</strong> Firebase integration for data management
                                    </div>
                                </div>
                                <div class="tech-step">
                                    <div class="step-number">3</div>
                                    <div class="step-content">
                                        <strong>API Integration:</strong> Retrofit, OkHttp, and Gson for network calls
                                    </div>
                                </div>
                                <div class="tech-step">
                                    <div class="step-number">4</div>
                                    <div class="step-content">
                                        <strong>Data Processing:</strong> Real-time health metrics tracking
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>🎯 Health Features</h3>
                            <div class="health-features">
                                <div class="health-feature">
                                    <div class="health-title">Hydration Tracking</div>
                                    <div class="health-desc">Smart water reminder notifications</div>
                                </div>
                                <div class="health-feature">
                                    <div class="health-title">Nutritional Analysis</div>
                                    <div class="health-desc">Comprehensive food calorie database</div>
                                </div>
                                <div class="health-feature">
                                    <div class="health-title">Body Mass Index</div>
                                    <div class="health-desc">BMI calculation and health insights</div>
                                </div>
                                <div class="health-feature">
                                    <div class="health-title">Exercise Guidance</div>
                                    <div class="health-desc">Step-by-step workout demonstrations</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>🏆 Project Goals</h3>
                            <div class="goals-summary">
                                <div class="goal-item">
                                    <span class="goal-icon">🎯</span>
                                    <span>Comprehensive fitness tracking for athletes</span>
                                </div>
                                <div class="goal-item">
                                    <span class="goal-icon">📊</span>
                                    <span>Real-time health metrics monitoring</span>
                                </div>
                                <div class="goal-item">
                                    <span class="goal-icon">💡</span>
                                    <span>User-friendly fitness companion app</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createInventoryPDFLayout(gameTitle, gameInfo) {
    return `
        <div class="popup-container ml-layout">
            <button class="close-btn">×</button>
            <div class="popup-content">
                <div class="ml-left-panel">
                    <div class="ml-header">
                        <h2>${gameTitle}</h2>
                        <div class="project-description">
                            <p>A comprehensive inventory control system application developed using Android Studio, Java, PHP, and SQL. This warehouse management system enables users to efficiently manage new products and perform detailed warehouse inventory checks. The application provides robust functionality for inventory tracking, product management, and real-time warehouse operations, making it an essential tool for business owners, warehouse managers, and inventory staff.</p>
                        </div>
                        <div class="ml-stats">
                            <div class="stat-item">
                                <span class="stat-label">Platform:</span>
                                <span class="stat-value">${gameInfo.platform}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Language:</span>
                                <span class="stat-value">${gameInfo.programmingLanguage}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Database:</span>
                                <span class="stat-value">${gameInfo.database}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="ml-section pdf-section">
                        <h3>📄 Project Report</h3>
                        <div class="pdf-container">
                            <embed src="${gameInfo.pdfPath}" type="application/pdf" width="100%" height="600px">
                            <p>If PDF cannot be displayed, <a href="${gameInfo.pdfPath}" target="_blank" class="pdf-link">click here to open the report</a></p>
                        </div>
                    </div>
                </div>
                
                <div class="ml-right-panel">
                    <div class="ml-details">
                        <div class="detail-section">
                            <h3>💻 Technology Stack</h3>
                            <div class="tech-stack">${gameInfo.techStack}</div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>📦 Key Features</h3>
                            <div class="features-list">
                                <div class="feature-item">
                                    <span class="feature-icon">📦</span>
                                    <span class="feature-text">Product Management</span>
                                </div>
                                <div class="feature-item">
                                    <span class="feature-icon">📊</span>
                                    <span class="feature-text">Inventory Tracking</span>
                                </div>
                                <div class="feature-item">
                                    <span class="feature-icon">🏭</span>
                                    <span class="feature-text">Warehouse Operations</span>
                                </div>
                                <div class="feature-item">
                                    <span class="feature-icon">🔍</span>
                                    <span class="feature-text">Inventory Checks</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>⚙️ System Architecture</h3>
                            <div class="tech-implementation">
                                <div class="tech-step">
                                    <div class="step-number">1</div>
                                    <div class="step-content">
                                        <strong>Android Frontend:</strong> Built with Android Studio and Java
                                    </div>
                                </div>
                                <div class="tech-step">
                                    <div class="step-number">2</div>
                                    <div class="step-content">
                                        <strong>API Connections:</strong> Volley and Retrofit for network operations
                                    </div>
                                </div>
                                <div class="tech-step">
                                    <div class="step-number">3</div>
                                    <div class="step-content">
                                        <strong>Backend API:</strong> PHP server-side processing
                                    </div>
                                </div>
                                <div class="tech-step">
                                    <div class="step-number">4</div>
                                    <div class="step-content">
                                        <strong>Database:</strong> SQL database for inventory data storage
                                    </div>
                                </div>
                                <div class="tech-step">
                                    <div class="step-number">5</div>
                                    <div class="step-content">
                                        <strong>Integration:</strong> Real-time data synchronization via API endpoints
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>📋 Business Functions</h3>
                            <div class="health-features">
                                <div class="health-feature">
                                    <div class="health-title">Product Registration</div>
                                    <div class="health-desc">Add and manage new products in the system</div>
                                </div>
                                <div class="health-feature">
                                    <div class="health-title">Stock Level Monitoring</div>
                                    <div class="health-desc">Real-time tracking of inventory levels</div>
                                </div>
                                <div class="health-feature">
                                    <div class="health-title">Warehouse Control</div>
                                    <div class="health-desc">Comprehensive warehouse management operations</div>
                                </div>
                                <div class="health-feature">
                                    <div class="health-title">Inventory Reports</div>
                                    <div class="health-desc">Generate detailed inventory status reports</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>👥 Target Users</h3>
                            <div class="user-roles">
                                <div class="user-role">
                                    <span class="role-icon">👨‍💼</span>
                                    <span class="role-title">Warehouse Managers</span>
                                </div>
                                <div class="user-role">
                                    <span class="role-icon">👷‍♂️</span>
                                    <span class="role-title">Inventory Staff</span>
                                </div>
                                <div class="user-role">
                                    <span class="role-icon">💼</span>
                                    <span class="role-title">Business Owners</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>🏆 Project Goals</h3>
                            <div class="goals-summary">
                                <div class="goal-item">
                                    <span class="goal-icon">🎯</span>
                                    <span>Efficient warehouse and inventory management</span>
                                </div>
                                <div class="goal-item">
                                    <span class="goal-icon">📊</span>
                                    <span>Real-time inventory tracking and reporting</span>
                                </div>
                                <div class="goal-item">
                                    <span class="goal-icon">💡</span>
                                    <span>User-friendly business management solution</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createMatchItPDFLayout(gameTitle, gameInfo) {
    return `
        <div class="popup-container ml-layout">
            <button class="close-btn">×</button>
            <div class="popup-content">
                <div class="ml-left-panel">
                    <div class="ml-header">
                        <h2>${gameTitle}</h2>
                        <div class="project-description">
                            <p>A web-based social impact application developed to contribute to the development of children with autism and create awareness. The project includes a comprehensive website and an interactive card matching game designed specifically for autism development support. Developed using modern web technologies including PHP, HTML, JavaScript, and CSS, this project represents a meaningful contribution to autism awareness and child development through technology.</p>
                        </div>
                        <div class="ml-stats">
                            <div class="stat-item">
                                <span class="stat-label">Platform:</span>
                                <span class="stat-value">${gameInfo.platform}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Languages:</span>
                                <span class="stat-value">${gameInfo.programmingLanguages}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Cloud:</span>
                                <span class="stat-value">${gameInfo.cloudTechnology}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="ml-section pdf-section">
                        <h3>📄 Project Report</h3>
                        <div class="pdf-container">
                            <embed src="${gameInfo.pdfPath}" type="application/pdf" width="100%" height="600px">
                            <p>If PDF cannot be displayed, <a href="${gameInfo.pdfPath}" target="_blank" class="pdf-link">click here to open the report</a></p>
                        </div>
                    </div>
                </div>
                
                <div class="ml-right-panel">
                    <div class="ml-details">
                        <div class="detail-section">
                            <h3>💻 Technology Stack</h3>
                            <div class="tech-stack">${gameInfo.techStack}</div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>🎯 Project Features</h3>
                            <div class="features-list">
                                <div class="feature-item">
                                    <span class="feature-icon">🃏</span>
                                    <span class="feature-text">Card Matching Game</span>
                                </div>
                                <div class="feature-item">
                                    <span class="feature-icon">🌐</span>
                                    <span class="feature-text">Web Interface</span>
                                </div>
                                <div class="feature-item">
                                    <span class="feature-icon">🧩</span>
                                    <span class="feature-text">Autism Development Support</span>
                                </div>
                                <div class="feature-item">
                                    <span class="feature-icon">💡</span>
                                    <span class="feature-text">Awareness Building</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>☁️ Cloud Architecture</h3>
                            <div class="tech-implementation">
                                <div class="tech-step">
                                    <div class="step-number">1</div>
                                    <div class="step-content">
                                        <strong>Frontend Development:</strong> HTML, CSS, JavaScript interface
                                    </div>
                                </div>
                                <div class="tech-step">
                                    <div class="step-number">2</div>
                                    <div class="step-content">
                                        <strong>Backend Processing:</strong> PHP server-side development
                                    </div>
                                </div>
                                <div class="tech-step">
                                    <div class="step-number">3</div>
                                    <div class="step-content">
                                        <strong>Containerization:</strong> Docker virtualization for backend services
                                    </div>
                                </div>
                                <div class="tech-step">
                                    <div class="step-number">4</div>
                                    <div class="step-content">
                                        <strong>Cloud Deployment:</strong> AWS platform deployment with Docker containers
                                    </div>
                                </div>
                                <div class="tech-step">
                                    <div class="step-number">5</div>
                                    <div class="step-content">
                                        <strong>Virtualization:</strong> Type-1 hypervisor for optimal performance
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>🎮 Game Features</h3>
                            <div class="health-features">
                                <div class="health-feature">
                                    <div class="health-title">Card Matching Mechanics</div>
                                    <div class="health-desc">Interactive card-based gameplay designed for autism development</div>
                                </div>
                                <div class="health-feature">
                                    <div class="health-title">Educational Gameplay</div>
                                    <div class="health-desc">Learning-focused game mechanics for skill development</div>
                                </div>
                                <div class="health-feature">
                                    <div class="health-title">Child-friendly Interface</div>
                                    <div class="health-desc">Intuitive and accessible design for young users</div>
                                </div>
                                <div class="health-feature">
                                    <div class="health-title">Development Support</div>
                                    <div class="health-desc">Specifically designed to aid autism development process</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>👥 Target Audience</h3>
                            <div class="user-roles">
                                <div class="user-role">
                                    <span class="role-icon">🧒</span>
                                    <span class="role-title">Children with Autism</span>
                                </div>
                                <div class="user-role">
                                    <span class="role-icon">👨‍🏫</span>
                                    <span class="role-title">Educators</span>
                                </div>
                                <div class="user-role">
                                    <span class="role-icon">👨‍👩‍👧‍👦</span>
                                    <span class="role-title">Families</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>🌟 Social Impact Goals</h3>
                            <div class="goals-summary">
                                <div class="goal-item">
                                    <span class="goal-icon">🎯</span>
                                    <span>Contributing to autism awareness and understanding</span>
                                </div>
                                <div class="goal-item">
                                    <span class="goal-icon">📈</span>
                                    <span>Supporting child development through technology</span>
                                </div>
                                <div class="goal-item">
                                    <span class="goal-icon">💡</span>
                                    <span>Creating inclusive educational gaming experiences</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createPopupOverlay() {
    let overlay = document.getElementById('popup-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'popup-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
            box-sizing: border-box;
        `;
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closePopup();
            }
        });
    }
    return overlay;
}

function closePopup() {
    const overlay = document.getElementById('popup-overlay');
    const projectOverlay = document.getElementById('project-overlay');
    const projectDisplay = document.querySelector('.project-display');
    
    if (overlay) {
        overlay.style.display = 'none';
        overlay.innerHTML = '';
    }
    
    if (projectOverlay) {
        projectOverlay.style.display = 'none';
    }
    
    if (projectDisplay) {
        projectDisplay.style.display = 'none';
    }
    
    document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePopup();
        closeImagePopup();
    }
});

function openImagePopup(imageSrc) {
    const overlay = document.getElementById('imagePopup');
    const popupImage = document.getElementById('popupImage');
    
    if (!overlay || !popupImage) {
        console.error('Popup elements not found!');
        return;
    }
    
    popupImage.src = imageSrc;
    overlay.style.display = 'flex';
    
    setTimeout(() => {
        overlay.classList.add('active');
    }, 10);
    
    document.body.style.overflow = 'hidden';
}

function closeImagePopup() {
    const overlay = document.getElementById('imagePopup');
    
    overlay.classList.remove('active');
    
    setTimeout(() => {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

const imagePopupElement = document.getElementById('imagePopup');
if (imagePopupElement) {
    imagePopupElement.addEventListener('click', function(e) {
        if (e.target === this) {
            closeImagePopup();
        }
    });
} else {
    console.error('imagePopup element not found!');
}

document.addEventListener('DOMContentLoaded', function() {
    const projectPreviews = document.querySelectorAll('.project-preview');
    
    projectPreviews.forEach((img) => {
        const jellywopContainer = img.closest('.jellywop-container');
        if (!jellywopContainer) {
            if (!img.onclick) {
                img.addEventListener('click', function() {
                    openImagePopup(this.src);
                });
            }
            img.style.cursor = 'pointer';
        }
    });
    
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    let cursorX = 0, cursorY = 0;
    let outlineX = 0, outlineY = 0;
    
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        
        cursorDot.style.left = cursorX + 'px';
        cursorDot.style.top = cursorY + 'px';
    });
    
    function animateOutline() {
        outlineX += (cursorX - outlineX) * 0.15;
        outlineY += (cursorY - outlineY) * 0.15;
        
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        
        requestAnimationFrame(animateOutline);
    }
    animateOutline();
    
    const interactiveElements = document.querySelectorAll('a, button, .game-card, .social-link, .info-item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('hover');
            cursorDot.style.transform = 'scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hover');
            cursorDot.style.transform = 'scale(1)';
        });
    });
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

window.addEventListener('scroll', () => {
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.experience-section, .projects-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'all 0.8s ease';
    observer.observe(section);
}); 