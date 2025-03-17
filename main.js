document.addEventListener('DOMContentLoaded', () => {
  // Initialize variables
  const cities = ['Ho Chi Minh City', 'Seoul','Hanoi','California'];
  let currentCityIndex = cities.indexOf('Hanoi'); // Start with Hanoi as shown in the HTML
  
  // Get existing elements from the HTML
  const card = document.querySelector('.card');
  const imageContainer = document.querySelector('.image-container');
  const cityDisplay = document.querySelector('.footer-text');
  const prevButton = document.querySelector('.buttons .button:first-child');
  const nextButton = document.querySelector('.buttons .button:last-child');
  
  // Create a cat container div
  const catContainer = document.createElement('div');
  catContainer.id = 'cat-container';
  catContainer.style.position = 'relative';
  catContainer.style.height = '40px';
  catContainer.style.width = '40px';
  catContainer.style.display = 'inline-block';
  catContainer.style.margin = '10px 10px';

  // Modify the buttons container
  const buttonsContainer = document.querySelector('.buttons');
  buttonsContainer.style.display = 'flex';
  buttonsContainer.style.justifyContent = 'center';
  buttonsContainer.style.alignItems = 'center';
  buttonsContainer.insertBefore(catContainer, nextButton);

  // Create a cat image for animation and add to the cat container
  const catImage = document.createElement('img');
  catImage.id = 'cat-animation';
  catImage.alt = 'Cat Animation';
  catImage.style.position = 'flexible';
  catImage.style.imageRendering = 'pixelated';
  catImage.style.cursor = 'pointer';
  catContainer.appendChild(catImage);

  // Create a movable cat
  const catMove = document.createElement('img');

  
  // Create a weather info div and add it to the card
  const weatherInfo = document.createElement('div');
  weatherInfo.id = 'weather-info';
  weatherInfo.innerHTML = '<p>Loading weather data...</p>';
  card.insertBefore(weatherInfo, document.querySelector('.buttons'));
  
  // Move the cat message to the new container
  const catMessage = document.createElement('div');
  catMessage.id = 'cat-message';
  catMessage.style.display = 'none';
  catContainer.appendChild(catMessage);
  
  // Create a water reminder button
  const waterButton = document.createElement('button');
  waterButton.id = 'water-button';
  waterButton.textContent = '물 마셔요! (Drink water!)';
  waterButton.style.display = 'none';
  card.insertBefore(waterButton, document.querySelector('.buttons'));
  
  // Create audio elements for sounds
  const waterSound = document.createElement('audio');
  waterSound.id = 'water-sound';
  waterSound.preload = 'auto';
  waterSound.src = 'sound.m4a'; // Using the new sound file
  document.body.appendChild(waterSound);
  
  const stopSound = document.createElement('audio');
  stopSound.id = 'stop-sound';
  stopSound.preload = 'auto';
  stopSound.src = 'https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3';
  document.body.appendChild(stopSound);
  
  const meowSound = document.createElement('audio');
  meowSound.id = 'meow-sound';
  meowSound.preload = 'auto';
  meowSound.src = 'https://assets.mixkit.co/sfx/preview/mixkit-domestic-cat-hungry-meow-45.mp3';
  document.body.appendChild(meowSound);
  
  const popSound = document.createElement('audio');
  popSound.id = 'pop-sound';
  popSound.preload = 'auto';
  popSound.src = 'https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3';
  popSound.volume = 0.4; // Lower volume for this sound
  document.body.appendChild(popSound);
  
  const birthdaySound = document.createElement('audio');
  birthdaySound.id = 'birthday-sound';
  birthdaySound.preload = 'auto';
  birthdaySound.src = 'https://assets.mixkit.co/sfx/preview/mixkit-birthday-crowd-party-cheer-531.mp3';
  document.body.appendChild(birthdaySound);
  
  // Function to play water sound
  function playWaterSound() {
    // Reset sound to the beginning if it's already playing
    waterSound.currentTime = 0;
    waterSound.play().catch(e => console.log('Audio playback failed:', e));
  }
  
  // Function to play stop sound
  function playStopSound() {
    stopSound.currentTime = 0;
    stopSound.play().catch(e => console.log('Audio playback failed:', e));
  }
  
  // Function to play meow sound
  function playMeowSound() {
    meowSound.currentTime = 0;
    meowSound.play().catch(e => console.log('Audio playback failed:', e));
  }
  
  // Function to play pop sound
  function playPopSound() {
    popSound.currentTime = 0;
    popSound.play().catch(e => console.log('Audio playback failed:', e));
  }
  
  // Function to play birthday sound
  function playBirthdaySound() {
    birthdaySound.currentTime = 0;
    birthdaySound.play().catch(e => console.log('Audio playback failed:', e));
  }
  
  // Variable to track if water reminder is active
  let waterReminderActive = false;
  let waterReminderInterval;
  
  // Add click event to water button
  waterButton.addEventListener('click', () => {
    showCatMessage('물 마셔요! 건강을 위해서!', false); // "Drink water! For your health!" in Korean
  });
  
  // Enhanced Cat animation function
  function animateCat() {
    // Use the Box3_m1.png through Box3_m4.png files
    const totalFrames = 4;
    let currentFrame = 1;
    let direction = 1; // 1 for forward, -1 for backward
    let animationSpeed = 200; // milliseconds between frames
    let bounceEffect = true; // enables ping-pong animation
    let animationId;
    // Add a flag to track special animation mode
    let specialMode = false;
    
    // Preload images for smoother animation
    const images = [];
    for(let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `charactor_ani/Box3_m${i}.png`;
      images.push(img);
    }


    // Set initial frame
    catImage.src = `charactor_ani/Box3_m${currentFrame}.png`;
    
    // Weather-based animation adjustments
    function adjustAnimation(weatherCondition) {
      if (weatherCondition === 'rain' || weatherCondition === 'drizzle') {
        animationSpeed = 300; // Slower when raining
        bounceEffect = false;
      } else if (weatherCondition === 'clear') {
        animationSpeed = 150; // Faster when sunny
        bounceEffect = true;
      } else if (weatherCondition === 'snow') {
        animationSpeed = 400; // Very slow in snow
        bounceEffect = false;
      } else {
        animationSpeed = 200; // Default speed
        bounceEffect = true;
      }
      
      // Restart animation with new settings
      clearInterval(animationId);
      startAnimation();
    }
    
    function startAnimation() {
      // Create animation loop
      animationId = setInterval(() => {
        if (bounceEffect) {
          // Ping-pong animation: 1->2->3->4->3->2->1
          currentFrame += direction;
          
          // Change direction at endpoints
          if (currentFrame >= totalFrames || currentFrame <= 1) {
            direction *= -1;
          }
        } else {
          // Loop animation: 1->2->3->4->1->2...
          currentFrame = currentFrame >= totalFrames ? 1 : currentFrame + 1;
        }
        
        // Update image
        catImage.src = `charactor_ani/Box3_m${currentFrame}.png`;
      }, animationSpeed);
    }
    
    // Function to toggle water reminder only
    function toggleWaterReminder() {
      // Add a small visual feedback without changing animation
      catImage.style.filter = 'brightness(1.2) drop-shadow(0 2px 4px rgba(0,0,0,0.4))';
      
      // Reset the filter after a brief moment
      setTimeout(() => {
        catImage.style.filter = 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))';
      }, 300);
      
      // Toggle water reminder
      waterReminderActive = !waterReminderActive;
      
      if (waterReminderActive) {
        // Show the button when active
        waterButton.style.display = 'block';
        showCatMessage('물 마셔요! 알림을 시작했어요!', false); // "Water drinking reminder started!" in Korean
        
        // Set up random reminder interval (between 15-30 minutes)
        function scheduleNextReminder() {
          const minTime = 15 * 60 * 1000; // 15 minutes
          const maxTime = 30 * 60 * 1000; // 30 minutes
          const randomTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
          
          waterReminderInterval = setTimeout(() => {
            showCatMessage('물 마셔요!', true); // "Drink water!" in Korean with sound
            // Make the water button pulse
            waterButton.classList.add('pulse');
            setTimeout(() => {
              waterButton.classList.remove('pulse');
            }, 3000);
            
            // Schedule next reminder
            scheduleNextReminder();
          }, randomTime);
        }
        
        // Start the random reminder cycle
        scheduleNextReminder();
        
      } else {
        // Hide the button when inactive
        waterButton.style.display = 'none';
        showCatMessage('물 알림을 중지했어요.', false); // "Water reminder stopped" in Korean
        playStopSound(); // Play stop sound when reminder is deactivated
        clearTimeout(waterReminderInterval);
      }
    }
    
    // Add click event listener to the cat image for water reminder only
    catImage.addEventListener('click', () => {
      toggleWaterReminder();
      playMeowSound(); // Always play meow sound when cat is clicked
    });
    
    // Start the animation
    startAnimation();
    
    // Return the function to control animation based on weather
    return adjustAnimation;
  }
  
  // Function to show cat message
  function showCatMessage(text, playSound = true) {
    // Array of possible cat messages
    const catMessages = [
      'Meow! Hello there!',
      'Nice weather today!',
      'Pet me please!',
      'I like this city!',
      'Feeling purr-fect!',
      'Weather looks interesting!',
      '안녕하세요!',
      '행복한 하루 되세요!',
      '오늘 기분이 어때요? How are you today?',
      '좋은 밤 되세요! Good night!'
    ];
    
    // Check if today is March 20 (birthday)
    const today = new Date();
    const isBirthday = today.getDate() === 20 && today.getMonth() === 2; // Month is 0-indexed, so 2 = March
    
    // If it's the birthday and no specific message is provided, show birthday message
    if (isBirthday && !text) {
      text = '생일 축하해요! Happy Birthday!';
    }
    
    // Choose a random message if text not provided
    const message = text || catMessages[Math.floor(Math.random() * catMessages.length)];
    
    catMessage.textContent = message;
    catMessage.style.display = 'block';
    
    // Play a sound based on message content and playSound flag
    if (message.includes('생일 축하해요')) {
      playBirthdaySound();
    } else if (message.includes('물 마셔요') || message.includes('Drink water')) {
      if (playSound) {
        playWaterSound(); // Only play water sound when playSound is true
      }
    } else {
      playPopSound();
    }
    
    // Auto-hide message after 3 seconds
    setTimeout(() => {
      hideCatMessage();
    }, 3000);
  }
  
  // Function to hide cat message
  function hideCatMessage() {
    catMessage.style.display = 'none';
  }
  
  // Initialize the animation function and get the controller
  const animationController = animateCat();
  
  // Set up automatic message display (every 15 seconds)
  setInterval(() => {
    showCatMessage(); // Show a random message from the pool
  }, 15000);
  
  // Show an initial message with a slight delay
  setTimeout(() => {
    showCatMessage();
  }, 2000);
  
  // Show birthday message if it's March 20
  const today = new Date();
  if (today.getDate() === 20 && today.getMonth() === 2) { // Month is 0-indexed, so 2 = March
    // Set up birthday specific styling and show message
    setTimeout(() => {
      showCatMessage('생일 축하해요! Happy Birthday!');
      // Play birthday sound
      playBirthdaySound();
      // Add some celebration styling
      catImage.style.filter = 'drop-shadow(0 0 5px gold)';
      document.body.style.background = 'linear-gradient(135deg, #d8c1d6 0%, #ffd7f1 100%)';
    }, 1000);
  }
  
  // Event listeners for navigation buttons
  prevButton.addEventListener('click', () => {
    currentCityIndex = (currentCityIndex - 1 + cities.length) % cities.length;
    updateCity();
  });
  
  nextButton.addEventListener('click', () => {
    currentCityIndex = (currentCityIndex + 1) % cities.length;
    updateCity();
  });
  
  // Function to get weather data for a city
  function getWeatherData(city) {
    weatherInfo.innerHTML = '<p>Loading weather data...</p>';
    
    // WeatherAPI.com API key and URL
    const apiKey = 'c463e2a717ad468aa6f43136251703'; // Replace with your actual API key
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
    
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Weather data not available');
        }
        return response.json();
      })
      .then(data => {
        // Extract weather data from the API response
        const weatherData = {
          temp: Math.round(data.current.temp_c),
          humidity: data.current.humidity,
          windSpeed: Math.round(data.current.wind_kph),
          condition: data.current.condition.text.toLowerCase()
        };
        
        // Map the API condition to one of our categories
        let weatherCondition = 'clouds'; // default
        if (weatherData.condition.includes('rain') || weatherData.condition.includes('drizzle')) {
          weatherCondition = 'rain';
        } else if (weatherData.condition.includes('clear') || weatherData.condition.includes('sunny')) {
          weatherCondition = 'clear';
        } else if (weatherData.condition.includes('snow') || weatherData.condition.includes('sleet')) {
          weatherCondition = 'snow';
        } else if (weatherData.condition.includes('fog') || weatherData.condition.includes('mist')) {
          weatherCondition = 'fog';
        }
        
        // Update animation based on weather
        animationController(weatherCondition);
        
        // Get the existing background image or create a new one
        let backgroundImg = imageContainer.querySelector('img');
        if (!backgroundImg) {
          backgroundImg = document.createElement('img');
          imageContainer.appendChild(backgroundImg);
        }
        
        // Set background image properties
        backgroundImg.style.position = 'absolute';
        backgroundImg.style.top = '0';
        backgroundImg.style.left = '0';
        backgroundImg.style.width = '100%';
        backgroundImg.style.height = '100%';
        backgroundImg.style.objectFit = 'cover';
        backgroundImg.style.borderRadius = '10px';
        
        // Set background image based on temperature
        if (weatherData.temp >= 20) {
          backgroundImg.src = 'sunny.gif';
        } else {
          backgroundImg.src = 'rainy.gif';
        }
        
        // Display weather data with the condition text from API
        weatherInfo.innerHTML = `
          <div class="weather-details">
            <div class="temp">${weatherData.temp}°C</div>
            <div class="description">${data.current.condition.text}</div>
            <div class="weather-info-row">
              <div>Humidity: ${weatherData.humidity}%</div>
              <div>Wind: ${weatherData.windSpeed} km/h</div>
            </div>
          </div>
        `;
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        
        // Fallback to random data if API fails
        const conditions = ['clear', 'clouds', 'rain', 'snow', 'drizzle', 'fog'];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        const temperature = Math.floor(Math.random() * 30) + 5; // 5-35°C
        
        const weatherData = {
          temp: temperature,
          humidity: Math.floor(Math.random() * 60) + 30, // 30-90%
          windSpeed: Math.floor(Math.random() * 30) + 5, // 5-35km/h
          condition: randomCondition
        };
        
        // Update animation based on weather
        animationController(randomCondition);
        
        // Get the existing background image or create a new one
        let backgroundImg = imageContainer.querySelector('img');
        if (!backgroundImg) {
          backgroundImg = document.createElement('img');
          imageContainer.appendChild(backgroundImg);
        }
        
        // Set background image properties
        backgroundImg.style.position = 'absolute';
        backgroundImg.style.top = '0';
        backgroundImg.style.left = '0';
        backgroundImg.style.width = '100%';
        backgroundImg.style.height = '100%';
        backgroundImg.style.objectFit = 'cover';
        backgroundImg.style.borderRadius = '10px';
        
        // Set background image based on temperature
        if (weatherData.temp >= 20) {
          backgroundImg.src = 'sunny.gif';
        } else {
          backgroundImg.src = 'rainy.gif';
        }
        
        // Display weather data
        weatherInfo.innerHTML = `
          <div class="weather-details">
            <div class="temp">${weatherData.temp}°C</div>
            <div class="description">${weatherData.condition}</div>
            <div class="weather-info-row">
              <div>Humidity: ${weatherData.humidity}%</div>
              <div>Wind: ${weatherData.windSpeed} km/h</div>
            </div>
          </div>
        `;
      });
  }
  
  // Function to update displayed city
  function updateCity() {
    cityDisplay.textContent = cities[currentCityIndex];
    getWeatherData(cities[currentCityIndex]);
  }
  
  // Add some additional styling for the new elements
  const style = document.createElement('style');
  style.textContent = `
    #cat-animation {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-height: 40px;
      width: auto;
      z-index: 2;
      image-rendering: pixelated;
      filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
      cursor: pointer;
      transition: transform 0.2s ease-in-out, filter 0.3s ease;
    }
    
    #cat-container {
      position: relative;
      height: 40px;
      width: 40px;
      display: inline-block;
      margin: 0 10px;
    }
    
    #cat-animation:hover {
      transform: translate(-50%, -50%) scale(1.3) !important;
      filter: brightness(1.2) drop-shadow(0 3px 3px rgba(0,0,0,0.3));
    }
    
    #cat-animation:active {
      transform: translate(-50%, -50%) scale(1.1) !important;
    }
    
    #cat-message {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      background-color: white;
      border-radius: 10px;
      padding: 12px 16px;
      font-family: "Press Start 2P", cursive;
      font-size: 12px;
      color: #a0709a;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      z-index: 3;
      width: 200px;
      text-align: center;
      animation: pop-in 0.3s ease-out;
      margin-top: 10px;
    }
    
    @keyframes pop-in {
      0% { transform: translateX(-50%) scale(0); opacity: 0; }
      80% { transform: translateX(-50%) scale(1.1); opacity: 1; }
      100% { transform: translateX(-50%) scale(1); opacity: 1; }
    }
    
    #weather-info {
      margin: 15px 0;
      min-height: 80px;
      padding: 10px;
    }
    
    .weather-details {
      background-color: rgba(245, 245, 245, 0.8);
      border-radius: 6px;
      padding: 15px;
      margin: 0 auto;
      max-width: 80%;
    }
    
    .temp {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .description {
      font-size: 18px;
      margin-bottom: 10px;
      text-transform: capitalize;
    }
    
    .weather-info-row {
      display: flex;
      justify-content: space-around;
      font-size: 14px;
    }
    
    .button {
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    
    .button:hover {
      transform: scale(1.1);
    }
    
    #water-button {
      background-color: #7aceff;
      color: white;
      border: none;
      border-radius: 20px;
      padding: 8px 15px;
      margin: 10px auto;
      font-family: "Press Start 2P", cursive;
      font-size: 8px;
      cursor: pointer;
      display: block;
      transition: all 0.3s ease;
    }
    
    #water-button:hover {
      background-color: #5ab7ff;
      transform: scale(1.05);
    }
    
    #water-button.pulse {
      animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(122, 206, 255, 0.7); }
      50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(122, 206, 255, 0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(122, 206, 255, 0); }
    }
    
    .buttons {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
      gap: 10px;
    }
  `;
  
  document.head.appendChild(style);
  
  // Load weather data for the initial city
  updateCity();
});