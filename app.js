// Función para mostrar y ocultar los detalles de los proyectos
function mostrarDetalles(id) {
    const detalle = document.getElementById(id);
    detalle.style.display = (detalle.style.display === "none" || detalle.style.display === "") ? "block" : "none";
}

// Verifica si MetaMask está instalado y conecta la wallet
async function conectarWallet() {
    // Verifica si MetaMask (window.ethereum) está presente en el navegador
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Solicita acceso a la cuenta de MetaMask
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Wallet conectada: ", accounts[0]);
            alert("¡Wallet conectada exitosamente! Dirección: " + accounts[0]);
        } catch (error) {
            console.error("Error al conectar la wallet", error);
            alert("Error al conectar la wallet. Intenta nuevamente.");
        }
    } else {
        // Si MetaMask no está instalado
        alert("MetaMask no está instalado. Por favor, instálalo para continuar.");
    }
}

// Función para realizar un pago en criptomoneda
async function pagarConCrypto() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const direccionReceptor = "0xTuDireccionDeWallet";  // Reemplaza con la dirección de tu wallet de destino

        try {
            // Configura y envía la transacción
            const transaccion = await signer.sendTransaction({
                to: direccionReceptor,
                value: ethers.utils.parseEther("0.01") // Monto de la transacción en ETH
            });
            console.log("Transacción exitosa:", transaccion);
            alert("Pago realizado exitosamente!");
        } catch (error) {
            console.error("Error en la transacción", error);
            alert("Hubo un error en el pago. Intenta nuevamente.");
        }
    } else {
        alert("MetaMask no está instalado. Por favor, instálalo para continuar.");
    }
}

// Cambio de videos de fondo al hacer scroll
const backgroundVideos = document.querySelectorAll('.bg-video');
let currentVideoIndex = 0;
const totalPoints = 4; // Número total de puntos (incluyendo el último estático)

// Función para activar el video correcto
function updateBackgroundVideo(scrollDirection) {
    // Calcular el nuevo índice del video
    if (scrollDirection === 'down') {
        currentVideoIndex = (currentVideoIndex + 1) % totalPoints;
    } else if (scrollDirection === 'up') {
        currentVideoIndex = (currentVideoIndex - 1 + totalPoints) % totalPoints;
    }

    // Determinar qué video mostrar
    const videoToShow = currentVideoIndex < 3 ? currentVideoIndex : 2; // Último punto usa el tercer video

    // Actualizar la clase de los videos
    backgroundVideos.forEach((video, index) => {
        if (index === videoToShow) {
            video.classList.add('active');
            video.play();
        } else {
            video.classList.remove('active');
            video.pause();
        }
    });
}

// Detectar la dirección del scroll
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
    lastScrollY = currentScrollY;

    // Cambiar el video al alcanzar un nuevo punto
    if (Math.abs(currentScrollY % 500) < 5) {
        updateBackgroundVideo(scrollDirection);
    }
});

// Inicialización
updateBackgroundVideo('down'); // Muestra el primer video al cargar

// Reproducción automática de videos de los proyectos al pasar el ratón
const projectVideos = document.querySelectorAll('.proyecto-video');

projectVideos.forEach(video => {
    video.addEventListener('mouseenter', () => {
        video.play();
    });

    video.addEventListener('mouseleave', () => {
        video.pause();
    });
});

// Reproducción automática de videos de proyectos al estar visibles
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.play();
        } else {
            entry.target.pause();
        }
    });
}, { threshold: 0.5 });

projectVideos.forEach(video => observer.observe(video));

// Eventos de botón para wallet
document.getElementById('btnConectar').addEventListener('click', conectarWallet);
document.getElementById('btnPagar').addEventListener('click', pagarConCrypto);
