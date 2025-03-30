// Slideshow functionality for Pin Shuffle
class PinSlideshow {
	constructor(pins, container, options = {}) {
		this.pins = pins;
		this.container = container;
		this.currentIndex = 0;
		this.isPlaying = false;
		this.slideInterval = null;

		// Default options
		this.options = {
			interval: 1000, // Default: 1 second per slide
			transition: 'fade', // Default transition
			fullscreen: false, // Start in normal mode
			shuffle: true, // Shuffle by default
			...options,
		};

		// Create slideshow elements
		this.setupSlideshow();

		// Setup keyboard shortcuts
		document.addEventListener('keydown', (e) => this.handleKeyPress(e));
	}

	setupSlideshow() {
		// Create slideshow container if not provided
		if (!this.container) {
			this.container = document.createElement('div');
			this.container.id = 'pin-slideshow-container';
			document.body.appendChild(this.container);
		}

		// Add classes and styles
		this.container.classList.add('pin-slideshow');
		this.container.classList.add('consistent-size'); // Add class for consistent sizing

		// Create slideshow elements
		this.createControls();
		this.createSlideElement();

		// Hide slideshow initially
		this.container.style.display = 'none';
	}

	createSlideElement() {
		// Create main slide element
		this.slideElement = document.createElement('div');
		this.slideElement.classList.add('pin-slide');
		this.container.appendChild(this.slideElement);

		// Create image element
		this.imageElement = document.createElement('img');
		this.imageElement.classList.add('pin-slide-image');
		this.slideElement.appendChild(this.imageElement);

		// Create caption element
		this.captionElement = document.createElement('div');
		this.captionElement.classList.add('pin-slide-caption');
		this.slideElement.appendChild(this.captionElement);
	}

	createControls() {
		// Create control panel
		this.controlPanel = document.createElement('div');
		this.controlPanel.classList.add('pin-slideshow-controls');
		this.container.appendChild(this.controlPanel);

		// Previous button
		this.prevButton = document.createElement('button');
		this.prevButton.innerHTML = '⟨';
		this.prevButton.classList.add('pin-slideshow-btn', 'prev-btn');
		this.prevButton.addEventListener('click', () => this.prevSlide());
		this.controlPanel.appendChild(this.prevButton);

		// Play/Pause button
		this.playPauseButton = document.createElement('button');
		this.playPauseButton.innerHTML = '▶';
		this.playPauseButton.classList.add('pin-slideshow-btn', 'play-pause-btn');
		this.playPauseButton.addEventListener('click', () =>
			this.togglePlayPause()
		);
		this.controlPanel.appendChild(this.playPauseButton);

		// Next button
		this.nextButton = document.createElement('button');
		this.nextButton.innerHTML = '⟩';
		this.nextButton.classList.add('pin-slideshow-btn', 'next-btn');
		this.nextButton.addEventListener('click', () => this.nextSlide());
		this.controlPanel.appendChild(this.nextButton);

		// Speed control
		this.speedControl = document.createElement('div');
		this.speedControl.classList.add('pin-slideshow-speed');
		this.controlPanel.appendChild(this.speedControl);

		// Speed label
		const speedLabel = document.createElement('span');
		speedLabel.textContent = 'Speed: ';
		this.speedControl.appendChild(speedLabel);

		// Speed input
		this.speedInput = document.createElement('input');
		this.speedInput.type = 'range';
		this.speedInput.min = '0';
		this.speedInput.max = '100';
		this.speedInput.value = '50';
		this.speedInput.addEventListener('input', () => this.updateSpeed());
		this.speedControl.appendChild(this.speedInput);

		// Speed value
		this.speedValue = document.createElement('span');
		this.speedValue.textContent = `1000ms`;
		this.speedControl.appendChild(this.speedValue);

		// Shuffle button
		this.shuffleButton = document.createElement('button');
		this.shuffleButton.innerHTML = this.options.shuffle ? '🔀' : '↔️';
		this.shuffleButton.title = this.options.shuffle
			? 'Shuffle is ON'
			: 'Shuffle is OFF';
		this.shuffleButton.classList.add('pin-slideshow-btn', 'shuffle-btn');
		this.shuffleButton.addEventListener('click', () => this.toggleShuffle());
		this.controlPanel.appendChild(this.shuffleButton);

		// Fullscreen button
		this.fullscreenButton = document.createElement('button');
		this.fullscreenButton.innerHTML = '⛶';
		this.fullscreenButton.classList.add('pin-slideshow-btn', 'fullscreen-btn');
		this.fullscreenButton.addEventListener('click', () =>
			this.toggleFullscreen()
		);
		this.controlPanel.appendChild(this.fullscreenButton);

		// Close button - moved outside the control panel to avoid overlap
		this.closeButton = document.createElement('button');
		this.closeButton.innerHTML = '✕';
		this.closeButton.classList.add('pin-slideshow-btn', 'close-btn');
		this.closeButton.addEventListener('click', () => this.close());
		this.container.appendChild(this.closeButton); // Attach directly to container
	}

	updateSpeed() {
		const sliderValue = parseInt(this.speedInput.value);

		// Exponential scale: 0-100 slider value to 5-5000ms
		// At slider 0: 5ms (extremely fast)
		// At slider 50: ~250ms (moderate)
		// At slider 100: 5000ms (very slow)
		let newInterval;

		if (sliderValue <= 20) {
			// 5-100ms range (super fast)
			newInterval = 5 + sliderValue * 4.75;
		} else if (sliderValue <= 50) {
			// 100-500ms range (fast to moderate)
			newInterval = 100 + (sliderValue - 20) * (400 / 30);
		} else {
			// 500-5000ms range (moderate to very slow)
			newInterval = 500 + (sliderValue - 50) * (4500 / 50);
		}

		// Round to whole number
		newInterval = Math.round(newInterval);

		this.options.interval = newInterval;
		this.speedValue.textContent = `${newInterval}ms`;

		// Restart the slideshow with new speed if it's currently playing
		if (this.isPlaying) {
			this.pause();
			this.play();
		}
	}

	showSlide(index) {
		// Ensure index is within bounds
		if (index < 0) {
			index = this.pins.length - 1;
		} else if (index >= this.pins.length) {
			index = 0;
		}

		this.currentIndex = index;
		const pin = this.pins[this.currentIndex];

		// Get the appropriate resolution based on fullscreen mode
		let imageUrl;
		if (this.options.fullscreen) {
			// Use highest resolution available
			imageUrl = pin.imageURL;
		} else {
			imageUrl = pin.imageURL;
		}

		// Clean cut - directly update image with no transition
		this.imageElement.src = imageUrl;

		// Update caption with board name
		this.captionElement.textContent = pin.board?.name || '';
	}

	nextSlide() {
		this.showSlide(this.currentIndex + 1);
	}

	prevSlide() {
		this.showSlide(this.currentIndex - 1);
	}

	play() {
		if (!this.isPlaying) {
			this.isPlaying = true;
			this.playPauseButton.innerHTML = '⏸';
			this.slideInterval = setInterval(() => {
				this.nextSlide();
			}, this.options.interval);
		}
	}

	pause() {
		if (this.isPlaying) {
			this.isPlaying = false;
			this.playPauseButton.innerHTML = '▶';
			clearInterval(this.slideInterval);
		}
	}

	togglePlayPause() {
		if (this.isPlaying) {
			this.pause();
		} else {
			this.play();
		}
	}

	toggleFullscreen() {
		this.options.fullscreen = !this.options.fullscreen;

		if (this.options.fullscreen) {
			this.container.classList.add('fullscreen');
			this.fullscreenButton.innerHTML = '⛶';
		} else {
			this.container.classList.remove('fullscreen');
			this.fullscreenButton.innerHTML = '⛶';
		}

		// Refresh current slide to load appropriate resolution
		this.showSlide(this.currentIndex);
	}

	toggleShuffle() {
		this.options.shuffle = !this.options.shuffle;
		this.shuffleButton.innerHTML = this.options.shuffle ? '🔀' : '↔️';
		this.shuffleButton.title = this.options.shuffle
			? 'Shuffle is ON'
			: 'Shuffle is OFF';

		// If shuffle was turned on, shuffle the images
		if (this.options.shuffle) {
			// Store current image to keep it visible after shuffle
			const currentPin = this.pins[this.currentIndex];

			// Shuffle
			this.shuffleImages();

			// Find the current image in the new order
			this.currentIndex = this.pins.findIndex(
				(pin) => pin.id === currentPin.id
			);
			if (this.currentIndex === -1) this.currentIndex = 0;

			// If playing, restart to use new order
			if (this.isPlaying) {
				this.pause();
				this.play();
			}
		}
	}

	open() {
		// Show the slideshow
		this.container.style.display = 'flex';

		// Shuffle the images if the option is enabled
		if (this.options.shuffle) {
			this.shuffleImages();
		}

		// Load the first slide
		this.showSlide(0);

		// Set initial speed
		this.updateSpeed();

		// Start playing automatically
		this.play();
	}

	close() {
		// Stop the slideshow
		this.pause();

		// Hide the container
		this.container.style.display = 'none';
	}

	handleKeyPress(e) {
		if (this.container.style.display === 'none') {
			return;
		}

		switch (e.key) {
			case 'ArrowRight':
				this.nextSlide();
				break;
			case 'ArrowLeft':
				this.prevSlide();
				break;
			case ' ':
				this.togglePlayPause();
				e.preventDefault();
				break;
			case 'f':
				this.toggleFullscreen();
				break;
			case 's':
				this.toggleShuffle();
				break;
			case 'r':
				if (this.options.shuffle) {
					this.shuffleImages();
					this.showSlide(0);
				}
				break;
			case 'Escape':
				this.close();
				break;
		}
	}

	// Randomize the pins array
	shuffleImages() {
		// Fisher-Yates shuffle algorithm
		for (let i = this.pins.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.pins[i], this.pins[j]] = [this.pins[j], this.pins[i]];
		}
		console.log('Images shuffled');
	}
}

// Initialize slideshow when document is ready
document.addEventListener('DOMContentLoaded', function () {
	// The slideshow will be initialized when the "Start Slideshow" button is clicked
	// See the integration in app.js
});
