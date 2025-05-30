/**
 * Dashboard functionality for Always Trucking & Loading LLC Training Hub
 * 
 * This file handles dashboard-related functions including:
 * - Displaying user course progress
 * - Loading available courses
 * - Course enrollment
 * - Progress tracking
 */

// Document ready function
document.addEventListener('DOMContentLoaded', async function() {
  // Check if user is logged in
  if (!isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }
  
  // Get current user
  const currentUser = getCurrentUser();
  
  // Update user welcome message
  const userWelcome = document.getElementById('user-welcome');
  if (userWelcome && currentUser) {
    userWelcome.textContent = `Welcome back, ${currentUser.name}`;
  }
  
  // Load user's course progress
  await loadUserCourses();
});

// Load user's courses and progress
async function loadUserCourses() {
  try {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      throw new Error('User not logged in');
    }
    
    // Get all courses
    const courses = await getAllCourses();
    
    // Get user progress
    const userProgress = await getUserCourseProgress(currentUser.email);
    
    // Create a map of course progress
    const progressMap = {};
    userProgress.forEach(progress => {
      progressMap[progress.courseId] = progress;
    });
    
    // Display courses with progress
    const courseGrid = document.getElementById('course-grid');
    
    if (courseGrid) {
      courseGrid.innerHTML = '';
      
      courses.forEach(course => {
        const progress = progressMap[course.id];
        let statusClass = '';
        let statusText = '';
        let progressPercent = 0;
        
        if (progress) {
          if (progress.completed) {
            statusClass = 'status-completed';
            statusText = 'Completed';
            progressPercent = 100;
          } else {
            statusClass = 'status-progress';
            statusText = 'In Progress';
            progressPercent = progress.progress || 0;
          }
        } else {
          statusClass = 'status-locked';
          statusText = 'Not Started';
        }
        
        const courseCard = document.createElement('div');
        courseCard.className = 'card';
        courseCard.innerHTML = `
          <img src="${course.image}" alt="${course.title}" class="card-img">
          <div class="card-body">
            <span class="course-status ${statusClass}">${statusText}</span>
            <h3 class="card-title">${course.title}</h3>
            <p class="card-text">${course.description}</p>
            <div class="progress-bar">
              <div class="progress" style="width: ${progressPercent}%"></div>
            </div>
            <p class="progress-text">${progressPercent}% Complete</p>
            <div class="card-details">
              <span><i class="fas fa-book"></i> ${course.modules} Modules</span>
              <span><i class="fas fa-clock"></i> ${course.duration}</span>
            </div>
            <a href="course.html?id=${course.id}" class="btn btn-primary">
              ${progress && progress.completed ? 'Review Course' : progress ? 'Continue Course' : 'Start Course'}
            </a>
          </div>
        `;
        
        courseGrid.appendChild(courseCard);
      });
    }
  } catch (error) {
    console.error('Error loading user courses:', error);
    alert('Error loading courses. Please try again.');
  }
}

// Add progress tracking styles (to be added to the head)
const progressStyles = `
  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: #e9ecef;
    border-radius: 4px;
    margin: 10px 0;
    overflow: hidden;
  }
  
  .progress {
    height: 100%;
    background-color: var(--primary-color);
    transition: width 0.3s ease;
  }
  
  .progress-text {
    font-size: 0.875rem;
    color: #6c757d;
    margin-bottom: 15px;
  }
  
  .card-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    font-size: 0.875rem;
    color: #6c757d;
  }
  
  .card-details i {
    margin-right: 5px;
    color: var(--primary-color);
  }
`;

// Add the styles to the document head
const styleElement = document.createElement('style');
styleElement.textContent = progressStyles;
document.head.appendChild(styleElement);