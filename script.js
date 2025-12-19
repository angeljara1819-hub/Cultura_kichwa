// script.js - Funcionalidad interactiva para YachayTech

document.addEventListener('DOMContentLoaded', function() {
    // ===== VARIABLES GLOBALES =====
    let currentSlide = 0;
    let cart = [];
    let quizAnswers = [];
    let currentQuestion = 1;
    const totalQuestions = 3;
    
    // ===== ELEMENTOS DEL DOM =====
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const enterSiteBtn = document.getElementById('enterSite');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    const culturalCarousel = document.getElementById('culturalCarousel');
    const prevCarouselBtn = document.getElementById('prevCarousel');
    const nextCarouselBtn = document.getElementById('nextCarousel');
    const carouselDots = document.querySelectorAll('.dot');
    const exploreBtn = document.getElementById('exploreBtn');
    const learnBtn = document.getElementById('learnBtn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const openCartBtn = document.getElementById('openCart');
    const closeCartBtn = document.getElementById('closeCart');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const quizOptions = document.querySelectorAll('.quiz-option');
    const prevQuestionBtn = document.getElementById('prevQuestion');
    const nextQuestionBtn = document.getElementById('nextQuestion');
    const submitQuizBtn = document.getElementById('submitQuiz');
    const quizProgress = document.getElementById('quizProgress');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    const quizResults = document.getElementById('quizResults');
    const quizScore = document.getElementById('quizScore');
    const scoreMessage = document.getElementById('scoreMessage');
    const retryQuizBtn = document.getElementById('retryQuiz');
    const communityBtns = document.querySelectorAll('.community-btn');
    const mapPoints = document.querySelectorAll('.map-point');
    const langBtns = document.querySelectorAll('.lang-btn');
    const floatingElements = document.querySelectorAll('.floating-element');
    
    // ===== FUNCIONALIDAD DE BIENVENIDA =====
    enterSiteBtn.addEventListener('click', function() {
        welcomeOverlay.style.opacity = '0';
        setTimeout(() => {
            welcomeOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 1000);
        document.body.style.overflow = 'auto';
    });
    
    // ===== MENÚ MÓVIL =====
    mobileMenuBtn.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        mobileMenuBtn.innerHTML = mainNav.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // ===== CARRUSEL CULTURAL =====
    function showSlide(n) {
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.dot');
        
        // Asegurarse de que el índice esté dentro de los límites
        if (n >= slides.length) currentSlide = 0;
        if (n < 0) currentSlide = slides.length - 1;
        
        // Ocultar todas las slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remover clase active de todos los dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Mostrar slide actual y activar dot correspondiente
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    // Event listeners para controles del carrusel
    prevCarouselBtn.addEventListener('click', () => {
        currentSlide--;
        showSlide(currentSlide);
    });
    
    nextCarouselBtn.addEventListener('click', () => {
        currentSlide++;
        showSlide(currentSlide);
    });
    
    // Event listeners para dots
    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Auto-avance del carrusel cada 5 segundos
    setInterval(() => {
        currentSlide++;
        showSlide(currentSlide);
    }, 5000);
    
    // ===== BOTONES DE ACCIÓN =====
    exploreBtn.addEventListener('click', function() {
        document.getElementById('interactivo').scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    learnBtn.addEventListener('click', function() {
        document.getElementById('comunidad').scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    // ===== FILTROS DE PRODUCTOS =====
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filterBtns.forEach(b => b.classList.remove('active'));
            // Añadir clase active al botón clickeado
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filtrar productos
            productCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // ===== CARRITO DE COMPRAS =====
    // Añadir productos al carrito
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('$', ''));
            const productImg = productCard.querySelector('.product-img img').src;
            
            addToCart(productId, productName, productPrice, productImg);
            showCartNotification();
        });
    });
    
    function addToCart(id, name, price, image) {
        // Verificar si el producto ya está en el carrito
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: id,
                name: name,
                price: price,
                image: image,
                quantity: 1
            });
        }
        
        updateCart();
    }
    
    function updateCart() {
        // Actualizar contador del carrito
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Actualizar lista de productos en el carrito
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Tu carrito está vacío</p>
                </div>
            `;
            cartTotal.textContent = '$0.00';
        } else {
            let total = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-actions">
                            <div class="cart-item-quantity">
                                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn increase" data-id="${item.id}">+</button>
                            </div>
                            <button class="remove-item" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                
                cartItems.appendChild(cartItem);
            });
            
            // Añadir event listeners a los botones de cantidad y eliminar
            document.querySelectorAll('.quantity-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    const action = this.classList.contains('increase') ? 'increase' : 'decrease';
                    
                    updateCartQuantity(productId, action);
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    removeFromCart(productId);
                });
            });
            
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }
        
        // Guardar carrito en localStorage
        localStorage.setItem('yachaytech-cart', JSON.stringify(cart));
    }
    
    function updateCartQuantity(productId, action) {
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            if (action === 'increase') {
                item.quantity += 1;
            } else if (action === 'decrease' && item.quantity > 1) {
                item.quantity -= 1;
            } else if (action === 'decrease' && item.quantity === 1) {
                removeFromCart(productId);
                return;
            }
            
            updateCart();
        }
    }
    
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }
    
    function showCartNotification() {
        // Animación simple de notificación
        cartCount.style.transform = 'scale(1.5)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Abrir y cerrar carrito
    openCartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        cartSidebar.classList.add('active');
    });
    
    closeCartBtn.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
    });
    
    // Cerrar carrito al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        if (!cartSidebar.contains(event.target) && !openCartBtn.contains(event.target) && cartSidebar.classList.contains('active')) {
            cartSidebar.classList.remove('active');
        }
    });
    
    // Botón de pago
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        alert(`¡Gracias por tu compra! Total: $${total.toFixed(2)}\n\nTu pedido ha sido procesado. Nos pondremos en contacto contigo pronto.`);
        
        // Vaciar carrito después de la compra
        cart = [];
        updateCart();
        cartSidebar.classList.remove('active');
    });
    
    // Cargar carrito desde localStorage al iniciar
    const savedCart = localStorage.getItem('yachaytech-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
    
    // ===== QUIZ CULTURAL =====
    // Manejar selección de respuestas
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remover selección anterior en esta pregunta
            const question = this.closest('.quiz-question');
            question.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Marcar esta opción como seleccionada
            this.classList.add('selected');
            
            // Guardar respuesta
            const questionId = question.id;
            const answerIndex = Array.from(this.parentNode.children).indexOf(this);
            const isCorrect = this.getAttribute('data-correct') === 'true';
            
            quizAnswers[questionId] = {
                answerIndex: answerIndex,
                isCorrect: isCorrect
            };
            
            // Habilitar botón siguiente si no es la última pregunta
            if (currentQuestion < totalQuestions) {
                nextQuestionBtn.disabled = false;
            } else {
                submitQuizBtn.style.display = 'block';
                nextQuestionBtn.style.display = 'none';
            }
        });
    });
    
    // Navegación entre preguntas
    prevQuestionBtn.addEventListener('click', function() {
        if (currentQuestion > 1) {
            currentQuestion--;
            showQuestion(currentQuestion);
        }
    });
    
    nextQuestionBtn.addEventListener('click', function() {
        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            showQuestion(currentQuestion);
        }
    });
    
    submitQuizBtn.addEventListener('click', function() {
        showQuizResults();
    });
    
    retryQuizBtn.addEventListener('click', function() {
        resetQuiz();
    });
    
    function showQuestion(questionNum) {
        // Ocultar todas las preguntas
        document.querySelectorAll('.quiz-question').forEach(question => {
            question.classList.remove('active');
        });
        
        // Mostrar pregunta actual
        document.getElementById(`question${questionNum}`).classList.add('active');
        
        // Actualizar progreso
        const progressPercent = ((questionNum - 1) / totalQuestions) * 100;
        quizProgress.style.width = `${progressPercent}%`;
        currentQuestionSpan.textContent = questionNum;
        
        // Actualizar estado de botones de navegación
        prevQuestionBtn.disabled = (questionNum === 1);
        nextQuestionBtn.disabled = (questionNum === totalQuestions);
        submitQuizBtn.style.display = (questionNum === totalQuestions) ? 'block' : 'none';
        nextQuestionBtn.style.display = (questionNum === totalQuestions) ? 'none' : 'block';
        
        // Restaurar selección previa si existe
        const questionId = `question${questionNum}`;
        if (quizAnswers[questionId]) {
            const options = document.querySelectorAll(`#${questionId} .quiz-option`);
            options[quizAnswers[questionId].answerIndex].classList.add('selected');
        }
    }
    
    function showQuizResults() {
        // Calcular puntaje
        let score = 0;
        for (let i = 1; i <= totalQuestions; i++) {
            if (quizAnswers[`question${i}`] && quizAnswers[`question${i}`].isCorrect) {
                score++;
            }
        }
        
        // Mostrar resultados
        quizScore.textContent = score;
        
        let message = '';
        if (score === totalQuestions) {
            message = '¡Excelente! Conoces muy bien la cultura Kichwa.';
        } else if (score >= totalQuestions / 2) {
            message = '¡Buen trabajo! Tienes un buen conocimiento de la cultura Kichwa.';
        } else {
            message = '¡Sigue aprendiendo! La cultura Kichwa tiene mucho que ofrecer.';
        }
        scoreMessage.textContent = message;
        
        // Ocultar preguntas y mostrar resultados
        document.querySelectorAll('.quiz-question').forEach(question => {
            question.classList.remove('active');
        });
        quizResults.style.display = 'block';
        quizProgress.style.width = '100%';
        prevQuestionBtn.style.display = 'none';
        nextQuestionBtn.style.display = 'none';
        submitQuizBtn.style.display = 'none';
    }
    
    function resetQuiz() {
        // Reiniciar variables
        quizAnswers = [];
        currentQuestion = 1;
        
        // Reiniciar selecciones
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Ocultar resultados y mostrar primera pregunta
        quizResults.style.display = 'none';
        showQuestion(1);
        
        // Restaurar botones de navegación
        prevQuestionBtn.style.display = 'block';
        nextQuestionBtn.style.display = 'block';
        submitQuizBtn.style.display = 'none';
        nextQuestionBtn.disabled = true;
    }
    
    // Inicializar quiz
    showQuestion(1);
    
    // ===== INTERACTIVIDAD DE COMUNIDAD =====
    communityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            let message = '';
            
            switch(target) {
                case 'eventos':
                    message = 'Próximos eventos culturales:\n\n• Inti Raymi: 21 de Junio\n• Pawkar Raymi: 21 de Marzo\n• Killa Raymi: 21 de Septiembre\n\n¡Te esperamos!';
                    break;
                case 'historias':
                    message = 'Escucha las historias ancestrales en nuestro canal de YouTube. Las leyendas del Amaru, el origen de los pueblos y más.';
                    break;
                case 'aprender':
                    message = 'Comienza a aprender Kichwa con nuestras lecciones interactivas. Vocabulario básico, saludos y frases útiles.';
                    break;
            }
            
            alert(message);
        });
    });
    
    // Interactividad del mapa
    mapPoints.forEach(point => {
        point.addEventListener('click', function() {
            const community = this.closest('.map-region').getAttribute('data-community');
            let info = '';
            
            switch(community) {
                case 'otavalo':
                    info = 'Comunidad Otavalo\nConocida por sus textiles, música y el mercado de ponchos más grande de Sudamérica.';
                    break;
                case 'cotacachi':
                    info = 'Comunidad Cotacachi\nFamosa por su trabajo en cuero y por la conservación de la laguna de Cuicocha.';
                    break;
                case 'chimborazo':
                    info = 'Comunidad Chimborazo\nGuardianes de las tradiciones agrícolas andinas y del volcán Chimborazo.';
                    break;
                case 'sarayaku':
                    info = 'Comunidad Sarayaku\nDefensores de la selva amazónica y conocidos por su resistencia cultural.';
                    break;
            }
            
            alert(info);
        });
    });
    
    // ===== SELECTOR DE IDIOMA =====
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase active de todos los botones
            langBtns.forEach(b => b.classList.remove('active'));
            // Añadir clase active al botón clickeado
            this.classList.add('active');
            
            const lang = this.getAttribute('data-lang');
            
            // Aquí podrías implementar la traducción de la página
            // Por ahora solo mostramos un mensaje
            if (lang === 'qu') {
                alert('¡Kichwa simipi rimashka! (¡Ahora hablamos en Kichwa!)');
            }
        });
    });
    
    // ===== ELEMENTOS FLOTANTES INTERACTIVOS =====
    floatingElements.forEach(element => {
        element.addEventListener('click', function() {
            const tooltip = this.querySelector('.element-tooltip').textContent;
            let info = '';
            
            switch(tooltip) {
                case 'Andes':
                    info = 'Los Andes: Cordillera sagrada que atraviesa Ecuador, hogar de las comunidades Kichwa.';
                    break;
                case 'Pachamama':
                    info = 'Pachamama: Madre Tierra, fuente de vida y sustento en la cosmovisión andina.';
                    break;
                case 'Inti':
                    info = 'Inti: Dios del Sol, dador de vida y energía en la cultura Kichwa.';
                    break;
                case 'Chacra':
                    info = 'Chacra: Sistema agrícola tradicional que combina cultivos en armonía con la naturaleza.';
                    break;
                case 'Mink\'a':
                    info = 'Mink\'a: Sistema de trabajo comunitario y reciprocidad que fortalece los lazos sociales.';
                    break;
            }
            
            // Crear un tooltip mejorado
            const enhancedTooltip = document.createElement('div');
            enhancedTooltip.className = 'enhanced-tooltip';
            enhancedTooltip.textContent = info;
            enhancedTooltip.style.position = 'absolute';
            enhancedTooltip.style.backgroundColor = 'var(--dark)';
            enhancedTooltip.style.color = 'white';
            enhancedTooltip.style.padding = '1rem';
            enhancedTooltip.style.borderRadius = '10px';
            enhancedTooltip.style.zIndex = '1000';
            enhancedTooltip.style.maxWidth = '300px';
            enhancedTooltip.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            
            // Posicionar tooltip
            const rect = this.getBoundingClientRect();
            enhancedTooltip.style.top = `${rect.top - enhancedTooltip.offsetHeight - 10}px`;
            enhancedTooltip.style.left = `${rect.left + rect.width/2 - 150}px`;
            
            document.body.appendChild(enhancedTooltip);
            
            // Remover tooltip después de 3 segundos
            setTimeout(() => {
                if (document.body.contains(enhancedTooltip)) {
                    document.body.removeChild(enhancedTooltip);
                }
            }, 3000);
        });
    });
    
    // ===== SCROLL SUAVE =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Ajustar para el header fijo
                const headerHeight = document.querySelector('.cultural-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== EFECTO DE SCROLL EN HEADER =====
    let lastScrollTop = 0;
    const header = document.querySelector('.cultural-header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scroll hacia abajo
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scroll hacia arriba
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // ===== INICIALIZACIÓN =====
    console.log('YachayTech - Cultura Kichwa interactiva cargada correctamente');
});