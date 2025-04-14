// Task Management Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Task management elements
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const taskEmpty = document.getElementById('task-empty');
    const tasksTotal = document.getElementById('tasks-total');
    const tasksCompleted = document.getElementById('tasks-completed');
    
    // Timer elements
    const timerDisplay = document.getElementById('timer-display');
    const toggleTimer = document.getElementById('toggle-timer');
    const timerIcon = document.getElementById('timer-icon');
    const timerButtonText = document.getElementById('timer-button-text');
    const resetTimer = document.getElementById('reset-timer');
    const progressBar = document.getElementById('progress-bar');
    const pomodoroBtn = document.getElementById('pomodoro-btn');
    const shortBreakBtn = document.getElementById('short-break-btn');
    const longBreakBtn = document.getElementById('long-break-btn');
    const currentMode = document.querySelector('.current-mode');
    
    // Timer variables
    let timer;
    let timeLeft = 25 * 60; // 25 minutes in seconds
    let totalTime = 25 * 60; // Total time for the current timer mode
    let isTimerRunning = false;
    let timerMode = 'pomodoro';
    
    // Notification settings
    let notificationSettings = {
        sound: true,
        browser: false,
        soundType: 'bell' // Default sound
    };
    
    // Load settings from localStorage
    loadSettings();
    
    // Add notification settings section to the page
    createNotificationSettings();
    
    // Load tasks from localStorage
    loadTasks();
    updateTaskStats();
    
    // Task form submission
    if (taskForm) {
        taskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (taskInput.value.trim() !== '') {
                addTask(taskInput.value.trim());
                taskInput.value = '';
                updateEmptyState();
                updateTaskStats();
            }
        });
    }
    
    // Timer controls
    if (toggleTimer) {
        toggleTimer.addEventListener('click', toggleTimerFunction);
    }
    
    if (resetTimer) {
        resetTimer.addEventListener('click', resetTimerFunction);
    }
    
    // Timer mode buttons
    if (pomodoroBtn) {
        pomodoroBtn.addEventListener('click', function() {
            setTimerMode('pomodoro', 'Focus Session', 25 * 60);
        });
    }
    
    if (shortBreakBtn) {
        shortBreakBtn.addEventListener('click', function() {
            setTimerMode('shortBreak', 'Short Break', 5 * 60);
        });
    }
    
    if (longBreakBtn) {
        longBreakBtn.addEventListener('click', function() {
            setTimerMode('longBreak', 'Long Break', 15 * 60);
        });
    }
    
    // Function to create notification settings
    function createNotificationSettings() {
        // Create notification settings container after timer-mode-selector
        const timerModeSelector = document.querySelector('.timer-mode-selector');
        if (timerModeSelector) {
            const notificationSettingsDiv = document.createElement('div');
            notificationSettingsDiv.className = 'notification-settings';
            notificationSettingsDiv.innerHTML = `
                <h3>Notification Settings</h3>
                <div class="notification-options">
                    <div class="notification-option">
                        <input type="checkbox" id="sound-notification" ${notificationSettings.sound ? 'checked' : ''}>
                        <label for="sound-notification">Sound Alert</label>
                    </div>
                    <div class="notification-option">
                        <input type="checkbox" id="browser-notification" ${notificationSettings.browser ? 'checked' : ''}>
                        <label for="browser-notification">Browser Notification</label>
                    </div>
                </div>
                <div class="sound-selection">
                    <label for="sound-type">Sound Type:</label>
                    <select id="sound-type">
                        <option value="bell" ${notificationSettings.soundType === 'bell' ? 'selected' : ''}>Bell</option>
                        <option value="chime" ${notificationSettings.soundType === 'chime' ? 'selected' : ''}>Chime</option>
                        <option value="gentle" ${notificationSettings.soundType === 'gentle' ? 'selected' : ''}>Gentle Alarm</option>
                        <option value="nature" ${notificationSettings.soundType === 'nature' ? 'selected' : ''}>Nature</option>
                    </select>
                    <button id="test-sound" class="btn"><i class="fas fa-volume-up"></i> Test</button>
                </div>
            `;
            
            timerModeSelector.after(notificationSettingsDiv);
            
            // Add event listeners to notification settings
            document.getElementById('sound-notification').addEventListener('change', function() {
                notificationSettings.sound = this.checked;
                saveSettings();
            });
            
            document.getElementById('browser-notification').addEventListener('change', function() {
                notificationSettings.browser = this.checked;
                
                // Request permission for browser notifications if enabled
                if (this.checked) {
                    requestNotificationPermission();
                }
                
                saveSettings();
            });
            
            document.getElementById('sound-type').addEventListener('change', function() {
                notificationSettings.soundType = this.value;
                saveSettings();
            });
            document.getElementById('test-sound').addEventListener('click', function() {
                const btn = this;
                
                // If a test sound is already playing, stop it
                if (currentAudio && currentAudio.loop === false) {
                  stopSound();
                  btn.innerHTML = '<i class="fas fa-volume-up"></i> Test';
                } else {
                  // Play the test sound (non-looping)
                  playSound(notificationSettings.soundType, true);
                  btn.innerHTML = '<i class="fas fa-volume-mute"></i> Stop Test';
                  
                  // When the test sound ends naturally, reset the button label
                  if (currentAudio) {
                    currentAudio.addEventListener('ended', function() {
                      btn.innerHTML = '<i class="fas fa-volume-up"></i> Test';
                      currentAudio = null;
                    });
                  }
                }
              });
              
        }
    }
    
    // Function to add a new task
    function addTask(taskText) {
        // Create task item
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        
        // Create task checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        
        // Create task text
        const taskTextElement = document.createElement('span');
        taskTextElement.className = 'task-text';
        taskTextElement.textContent = taskText;
        
        // Create task actions
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.title = 'Delete task';
        
        // Add event listeners
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                taskTextElement.classList.add('completed');
            } else {
                taskTextElement.classList.remove('completed');
            }
            saveTasks();
            updateTaskStats();
        });
        
        deleteBtn.addEventListener('click', function() {
            taskItem.remove();
            saveTasks();
            updateEmptyState();
            updateTaskStats();
        });
        
        // Append elements
        taskActions.appendChild(deleteBtn);
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskTextElement);
        taskItem.appendChild(taskActions);
        
        // Add to task list
        taskList.appendChild(taskItem);
        
        // Save tasks to localStorage
        saveTasks();
    }
    
    // Function to update task statistics
    function updateTaskStats() {
        if (tasksTotal && tasksCompleted) {
            const totalTasks = document.querySelectorAll('.task-item').length;
            const completedTasks = document.querySelectorAll('.task-checkbox:checked').length;
            
            tasksTotal.textContent = `${totalTasks} task${totalTasks !== 1 ? 's' : ''}`;
            tasksCompleted.textContent = `${completedTasks} completed`;
        }
    }
    
    // Function to update empty state
    function updateEmptyState() {
        if (taskEmpty) {
            const hasTasks = document.querySelectorAll('.task-item').length > 0;
            taskEmpty.style.display = hasTasks ? 'none' : 'flex';
        }
    }
    
    // Function to save tasks to localStorage
    function saveTasks() {
        const tasks = [];
        
        document.querySelectorAll('.task-item').forEach(function(taskItem) {
            const taskText = taskItem.querySelector('.task-text').textContent;
            const isCompleted = taskItem.querySelector('.task-checkbox').checked;
            
            tasks.push({
                text: taskText,
                completed: isCompleted
            });
        });
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Function to save notification settings
    function saveSettings() {
        localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    }
    
    // Function to load notification settings
    function loadSettings() {
        const savedSettings = localStorage.getItem('notificationSettings');
        
        if (savedSettings) {
            notificationSettings = JSON.parse(savedSettings);
        }
    }
    
    // Function to load tasks from localStorage
    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        
        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);
            
            tasks.forEach(function(task) {
                // Create task item
                const taskItem = document.createElement('li');
                taskItem.className = 'task-item';
                
                // Create task checkbox
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'task-checkbox';
                checkbox.checked = task.completed;
                
                // Create task text
                const taskTextElement = document.createElement('span');
                taskTextElement.className = 'task-text';
                if (task.completed) {
                    taskTextElement.classList.add('completed');
                }
                taskTextElement.textContent = task.text;
                
                // Create task actions
                const taskActions = document.createElement('div');
                taskActions.className = 'task-actions';
                
                // Create delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                deleteBtn.title = 'Delete task';
                
                // Add event listeners
                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        taskTextElement.classList.add('completed');
                    } else {
                        taskTextElement.classList.remove('completed');
                    }
                    saveTasks();
                    updateTaskStats();
                });
                
                deleteBtn.addEventListener('click', function() {
                    taskItem.remove();
                    saveTasks();
                    updateEmptyState();
                    updateTaskStats();
                });
                
                // Append elements
                taskActions.appendChild(deleteBtn);
                taskItem.appendChild(checkbox);
                taskItem.appendChild(taskTextElement);
                taskItem.appendChild(taskActions);
                
                // Add to task list
                if (taskList) {
                    taskList.appendChild(taskItem);
                }
            });
        }
        
        updateEmptyState();
    }
    
    // Timer functions
    function toggleTimerFunction() {
        if (isTimerRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }
    
    function startTimer() {
        if (!isTimerRunning) {
            isTimerRunning = true;
            toggleTimer.classList.remove('paused');
            toggleTimer.classList.add('running');
            timerIcon.className = 'fas fa-pause';
            timerButtonText.textContent = 'Pause';
            timer = setInterval(updateTimer, 1000);
        }
    }
    
    function pauseTimer() {
        if (isTimerRunning) {
            isTimerRunning = false;
            toggleTimer.classList.remove('running');
            toggleTimer.classList.add('paused');
            timerIcon.className = 'fas fa-play';
            timerButtonText.textContent = 'Resume';
            clearInterval(timer);
        }
    }
    
    function resetTimerFunction() {
        pauseTimer();
        setTimerMode(timerMode, currentMode.textContent, totalTime);
    }
    
    function updateTimer() {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
            updateProgressBar();
        } else {
            pauseTimer();
            showNotifications();
            
            // Auto switch to break after pomodoro, or to pomodoro after break
            if (timerMode === 'pomodoro') {
                setTimerMode('shortBreak', 'Short Break', 5 * 60);
            } else {
                setTimerMode('pomodoro', 'Focus Session', 25 * 60);
            }
        }
    }
    
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update document title to show current timer
        document.title = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} - Focus`;
    }
    
    function updateProgressBar() {
        if (progressBar) {
            const progressPercentage = ((totalTime - timeLeft) / totalTime) * 100;
            progressBar.style.width = `${progressPercentage}%`;
        }
    }
    
    function setTimerMode(mode, modeText, duration) {
        pauseTimer();
        timerMode = mode;
        totalTime = duration;
        timeLeft = duration;
        
        // Update mode indicator text
        if (currentMode) {
            currentMode.textContent = modeText;
        }
        
        // Reset button text
        timerButtonText.textContent = 'Start';
        timerIcon.className = 'fas fa-play';
        toggleTimer.classList.remove('running');
        toggleTimer.classList.add('paused');
        
        // Reset active button styles
        pomodoroBtn.classList.remove('active');
        shortBreakBtn.classList.remove('active');
        longBreakBtn.classList.remove('active');
        
        // Set active button based on mode
        switch(mode) {
            case 'pomodoro':
                pomodoroBtn.classList.add('active');
                break;
            case 'shortBreak':
                shortBreakBtn.classList.add('active');
                break;
            case 'longBreak':
                longBreakBtn.classList.add('active');
                break;
        }
        
        updateTimerDisplay();
        updateProgressBar();
    }
    
    // Function to show notifications based on user settings
    function showNotifications() {
        // Sound alert is enabled
        if (notificationSettings.sound) {
            playSound(notificationSettings.soundType);
        }
        
        // Browser notification is enabled
        if (notificationSettings.browser) {
            showBrowserNotification();
        }
    }
    
    // Sound URLs for different sound types
    const soundUrls = {
        bell: './audio/mixkit-bell-notification-933.wav',
        // Note: For the chime sound, you may need to choose the most appropriate file from the available SoundJay selection.
        chime: './audio/mixkit-classic-alarm-995.wav',
        gentle: './audio/mixkit-tick-tock-clock-timer-1045.wav',
        nature: './audio/mixkit-little-birds-singing-in-the-trees-17.wav'
      };
      
      
    
    let currentAudio = null;
    
    // Function to play alarm sound
    function playSound(soundType, isTest = false) {
        // Stop any existing sounds
        stopSound();
        
        // Create an audio element for the alarm sound
        const audio = new Audio(soundUrls[soundType]);
        currentAudio = audio;
        
        // Only loop if it's not a test
        if (!isTest) {
            audio.loop = true;
        }
        
        audio.play();
        
        // Show the stop sound button if it's not a test
        if (!isTest) {
            showStopSoundButton();
        }
    }
    
    // Function to stop sound
    function stopSound() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }
        
        // Hide stop sound button
        const stopSoundBtn = document.getElementById('stop-sound-btn');
        if (stopSoundBtn) {
            stopSoundBtn.remove();
        }
    }
    
    // Function to show stop sound button
    function showStopSoundButton() {
        // Remove existing stop button if any
        const existingBtn = document.getElementById('stop-sound-btn');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        // Create stop sound button
        const stopSoundBtn = document.createElement('button');
        stopSoundBtn.id = 'stop-sound-btn';
        stopSoundBtn.className = 'btn btn-primary stop-sound';
        stopSoundBtn.innerHTML = '<i class="fas fa-volume-mute"></i> Stop Sound';
        stopSoundBtn.addEventListener('click', stopSound);
        
        // Add it to the timer controls
        const timerControls = document.querySelector('.timer-controls');
        if (timerControls) {
            timerControls.appendChild(stopSoundBtn);
        }
    }
    
    // Function to request browser notification permission
    function requestNotificationPermission() {
        if ('Notification' in window) {
            if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
                Notification.requestPermission();
            }
        }
    }
    
    // Function to show browser notification
    function showBrowserNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            let notificationTitle, notificationBody;
            
            if (timerMode === 'pomodoro') {
                notificationTitle = 'Focus Session Complete!';
                notificationBody = 'Time to take a break.';
            } else {
                notificationTitle = 'Break Time Complete!';
                notificationBody = 'Ready to focus again?';
            }
            
            const notification = new Notification(notificationTitle, {
                body: notificationBody,
                icon: '/favicon.ico' // You may need to update this path
            });
            
            // Close notification after 5 seconds
            setTimeout(() => {
                notification.close();
            }, 5000);
        }
    }
    
    // Initialize timer display
    if (timerDisplay) {
        updateTimerDisplay();
        updateProgressBar();
        toggleTimer.classList.add('paused');  // Set initial button state
    }
    
    // Add CSS styles for notification settings
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .notification-settings {
            background-color: #f9f9f9;
            border-radius: 6px;
            padding: 15px;
            margin-top: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .notification-settings h3 {
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 16px;
            color: #333;
        }
        
        .notification-options {
            display: flex;
            gap: 20px;
            margin-bottom: 15px;
        }
        
        .notification-option {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .sound-selection {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .sound-selection select {
            padding: 5px 10px;
            border-radius: 4px;
            border: 1px solid #ddd;
        }
        
        .stop-sound {
            margin-left: 10px;
            background-color: #ff5252;
            color: white;
        }
        
        #test-sound {
            padding: 5px 10px;
            font-size: 12px;
        }
    `;
    document.head.appendChild(styleElement);
});