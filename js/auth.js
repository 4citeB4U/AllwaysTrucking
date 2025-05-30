/**
 * Authentication functionality for Always Trucking & Loading LLC Training Hub
 * 
 * This file handles user authentication including:
 * - Login
 * - Registration
 * - Password reset
 * - Session management
 * - Offline authentication using IndexedDB
 */

// Initialize Firebase (will be connected to a real Firebase instance later)
const firebaseConfig = {
  // This will be replaced with actual Firebase configuration
  // when setting up the production environment
};

// IndexedDB setup for offline functionality
const DB_NAME = 'alwaysTruckingDB';
const DB_VERSION = 1;
const USERS_STORE = 'users';
const COURSES_STORE = 'courses';
const PROGRESS_STORE = 'progress';

// Initialize the database
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('Database error:', event.target.error);
      reject(event.target.error);
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      console.log('Database opened successfully');
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create users store
      if (!db.objectStoreNames.contains(USERS_STORE)) {
        const usersStore = db.createObjectStore(USERS_STORE, { keyPath: 'email' });
        usersStore.createIndex('name', 'name', { unique: false });
        usersStore.createIndex('phone', 'phone', { unique: false });
      }
      
      // Create courses store
      if (!db.objectStoreNames.contains(COURSES_STORE)) {
        const coursesStore = db.createObjectStore(COURSES_STORE, { keyPath: 'id' });
        coursesStore.createIndex('title', 'title', { unique: false });
        coursesStore.createIndex('category', 'category', { unique: false });
      }
      
      // Create progress store
      if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
        const progressStore = db.createObjectStore(PROGRESS_STORE, { keyPath: 'id', autoIncrement: true });
        progressStore.createIndex('userEmail', 'userEmail', { unique: false });
        progressStore.createIndex('courseId', 'courseId', { unique: false });
        progressStore.createIndex('userCourse', ['userEmail', 'courseId'], { unique: true });
      }
    };
  });
}

// User registration - IndexedDB implementation
async function registerUser(name, email, phone, password) {
  try {
    const db = await initDB();
    const transaction = db.transaction([USERS_STORE], 'readwrite');
    const store = transaction.objectStore(USERS_STORE);
    
    // Check if user already exists
    const getUserRequest = store.get(email);
    
    return new Promise((resolve, reject) => {
      getUserRequest.onsuccess = (event) => {
        if (event.target.result) {
          reject(new Error('User already exists'));
          return;
        }
        
        // Create new user
        const user = {
          email,
          name,
          phone,
          password: hashPassword(password), // In real app, use proper hashing
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        
        const addRequest = store.add(user);
        
        addRequest.onsuccess = () => {
          // Set current user in localStorage
          localStorage.setItem('currentUser', JSON.stringify({
            email,
            name,
            phone,
            isLoggedIn: true,
            lastLogin: user.lastLogin
          }));
          
          resolve(user);
        };
        
        addRequest.onerror = (event) => {
          reject(event.target.error);
        };
      };
      
      getUserRequest.onerror = (event) => {
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// User login - IndexedDB implementation
async function loginUser(email, password) {
  try {
    const db = await initDB();
    const transaction = db.transaction([USERS_STORE], 'readwrite');
    const store = transaction.objectStore(USERS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.get(email);
      
      request.onsuccess = (event) => {
        const user = event.target.result;
        
        if (!user) {
          reject(new Error('User not found'));
          return;
        }
        
        if (user.password !== hashPassword(password)) {
          reject(new Error('Invalid password'));
          return;
        }
        
        // Update last login
        user.lastLogin = new Date().toISOString();
        store.put(user);
        
        // Set current user in localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          email: user.email,
          name: user.name,
          phone: user.phone,
          isLoggedIn: true,
          lastLogin: user.lastLogin
        }));
        
        resolve(user);
      };
      
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// User logout
function logoutUser() {
  localStorage.removeItem('currentUser');
  // Redirect to login page
  window.location.href = 'index.html';
}

// Check if user is logged in
function isLoggedIn() {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    const user = JSON.parse(currentUser);
    return user.isLoggedIn === true;
  }
  return false;
}

// Get current user
function getCurrentUser() {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    return JSON.parse(currentUser);
  }
  return null;
}

// Simple password hashing (NOTE: In a production environment, use a proper hashing library)
function hashPassword(password) {
  // This is a very basic hash function and should NOT be used in production
  let hash = 0;
  if (password.length === 0) return hash;
  
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return hash.toString();
}

// Initialize demo courses
async function initDemoCourses() {
  try {
    const db = await initDB();
    const transaction = db.transaction([COURSES_STORE], 'readwrite');
    const store = transaction.objectStore(COURSES_STORE);
    
    // Sample courses based on requirements
    const demoCourses = [
      {
        id: 1,
        title: 'CDL Continuing Education & Refresher Course',
        description: 'Helps experienced drivers stay current with regulations, safety, and industry best practices. Not for new CDL or first-time endorsements.',
        image: 'images/g8ba2d307f143232b093ded7e55e1dc96509fb0dfcb66fdf69190d5f5abc569932a38eca480252667d9bc1c5779cf98b73d32317d510f527b8aee1db69d7950ed_1280.jpg',
        category: 'cdl',
        modules: 8,
        duration: '8 hours',
        price: 99
      },
      {
        id: 2,
        title: 'Dispatcher Training & Load Management',
        description: 'Teaches load planning, communication, TMS software, customer service, and regulatory compliance for dispatchers and logistics staff.',
        image: 'images/g7a2bae640c1282b789b5265b172b96a3e17d37e02763c8f9c2e89b5704588a5e77ec7533337fca4595c39f6f8837cb06aed2d31293b51c6e07f0a3ef193f3f82_1280.jpg',
        category: 'dispatcher',
        modules: 6,
        duration: '6 hours',
        price: 79
      },
      {
        id: 3,
        title: 'Hours of Service & Logbook Compliance',
        description: 'Covers federal and state hours-of-service rules, ELD use, and proper recordkeeping for drivers and dispatchers.',
        image: 'images/g8ba2d307f143232b093ded7e55e1dc96509fb0dfcb66fdf69190d5f5abc569932a38eca480252667d9bc1c5779cf98b73d32317d510f527b8aee1db69d7950ed_1280.jpg',
        category: 'compliance',
        modules: 4,
        duration: '4 hours',
        price: 59
      },
      {
        id: 4,
        title: 'Vehicle Inspection & Preventative Maintenance',
        description: 'Focuses on pre-trip, en-route, and post-trip inspections, plus basic maintenance and troubleshooting.',
        image: 'images/g7a2bae640c1282b789b5265b172b96a3e17d37e02763c8f9c2e89b5704588a5e77ec7533337fca4595c39f6f8837cb06aed2d31293b51c6e07f0a3ef193f3f82_1280.jpg',
        category: 'maintenance',
        modules: 5,
        duration: '5 hours',
        price: 69
      },
      {
        id: 5,
        title: 'Defensive Driving & Accident Prevention',
        description: 'Teaches safe driving techniques, hazard perception, and strategies to avoid accidents and violations.',
        image: 'images/g8ba2d307f143232b093ded7e55e1dc96509fb0dfcb66fdf69190d5f5abc569932a38eca480252667d9bc1c5779cf98b73d32317d510f527b8aee1db69d7950ed_1280.jpg',
        category: 'safety',
        modules: 6,
        duration: '6 hours',
        price: 79
      },
      {
        id: 6,
        title: 'Transportation Management System (TMS) Training',
        description: 'Hands-on instruction for dispatchers and drivers on using modern TMS software for load management, tracking, and communication.',
        image: 'images/g7a2bae640c1282b789b5265b172b96a3e17d37e02763c8f9c2e89b5704588a5e77ec7533337fca4595c39f6f8837cb06aed2d31293b51c6e07f0a3ef193f3f82_1280.jpg',
        category: 'technology',
        modules: 7,
        duration: '7 hours',
        price: 89
      },
      {
        id: 7,
        title: 'Customer Service & Communication for Drivers & Dispatchers',
        description: 'Develops skills for interacting with customers, shippers, and receivers, including conflict resolution and professional communication.',
        image: 'images/gcba07076e5cd180258ca987572f567a93845296c4c058c12885724e0e722b21f52db32ab7b2142e00c47b4c5084740728964120fe274b1ab47d20debf43aa7a6_1280.png',
        category: 'customer-service',
        modules: 5,
        duration: '5 hours',
        price: 69
      },
      {
        id: 8,
        title: 'Fleet Safety & Compliance Overview',
        description: 'Provides a comprehensive look at fleet safety programs, DOT compliance, drug and alcohol testing, and safety management systems.',
        image: 'images/gcba07076e5cd180258ca987572f567a93845296c4c058c12885724e0e722b21f52db32ab7b2142e00c47b4c5084740728964120fe274b1ab47d20debf43aa7a6_1280.png',
        category: 'safety',
        modules: 8,
        duration: '8 hours',
        price: 99
      }
    ];
    
    // Add courses to the store
    return new Promise((resolve, reject) => {
      let count = 0;
      
      demoCourses.forEach(course => {
        const addRequest = store.put(course);
        
        addRequest.onsuccess = () => {
          count++;
          if (count === demoCourses.length) {
            resolve();
          }
        };
        
        addRequest.onerror = (event) => {
          reject(event.target.error);
        };
      });
    });
  } catch (error) {
    console.error('Error initializing demo courses:', error);
    throw error;
  }
}

// Get all courses
async function getAllCourses() {
  try {
    const db = await initDB();
    const transaction = db.transaction([COURSES_STORE], 'readonly');
    const store = transaction.objectStore(COURSES_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error getting courses:', error);
    throw error;
  }
}

// Get course by ID
async function getCourseById(courseId) {
  try {
    const db = await initDB();
    const transaction = db.transaction([COURSES_STORE], 'readonly');
    const store = transaction.objectStore(COURSES_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.get(courseId);
      
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error getting course by ID:', error);
    throw error;
  }
}

// Update user progress
async function updateUserProgress(userEmail, courseId, progress, completed = false) {
  try {
    const db = await initDB();
    const transaction = db.transaction([PROGRESS_STORE], 'readwrite');
    const store = transaction.objectStore(PROGRESS_STORE);
    const index = store.index('userCourse');
    
    return new Promise((resolve, reject) => {
      const request = index.get([userEmail, courseId]);
      
      request.onsuccess = (event) => {
        const userProgress = event.target.result;
        
        if (userProgress) {
          // Update existing progress
          userProgress.progress = progress;
          userProgress.completed = completed;
          userProgress.updatedAt = new Date().toISOString();
          
          const updateRequest = store.put(userProgress);
          
          updateRequest.onsuccess = () => {
            resolve(userProgress);
          };
          
          updateRequest.onerror = (event) => {
            reject(event.target.error);
          };
        } else {
          // Create new progress record
          const newProgress = {
            userEmail,
            courseId,
            progress,
            completed,
            startedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          const addRequest = store.add(newProgress);
          
          addRequest.onsuccess = () => {
            resolve(newProgress);
          };
          
          addRequest.onerror = (event) => {
            reject(event.target.error);
          };
        }
      };
      
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
}

// Get user's course progress
async function getUserCourseProgress(userEmail) {
  try {
    const db = await initDB();
    const transaction = db.transaction([PROGRESS_STORE], 'readonly');
    const store = transaction.objectStore(PROGRESS_STORE);
    const index = store.index('userEmail');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(userEmail);
      
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error getting user course progress:', error);
    throw error;
  }
}

// Initialize the application
async function initApp() {
  try {
    // Initialize the database
    await initDB();
    
    // Initialize demo courses
    await initDemoCourses();
    
    console.log('Application initialized successfully');
    
    // Check if user is logged in
    if (isLoggedIn()) {
      // Redirect to dashboard if on login page
      if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        window.location.href = 'dashboard.html';
      }
    } else {
      // Redirect to login if trying to access protected pages
      if (window.location.pathname.includes('dashboard.html') || 
          window.location.pathname.includes('course.html')) {
        window.location.href = 'index.html';
      }
    }
  } catch (error) {
    console.error('Error initializing application:', error);
  }
}

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the application
  initApp();
  
  // Login form submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      try {
        await loginUser(email, password);
        window.location.href = 'dashboard.html';
      } catch (error) {
        alert(error.message);
      }
    });
  }
  
  // Registration form submission
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const phone = document.getElementById('register-phone').value;
      const password = document.getElementById('register-password').value;
      
      try {
        await registerUser(name, email, phone, password);
        window.location.href = 'dashboard.html';
      } catch (error) {
        alert(error.message);
      }
    });
  }
  
  // Logout button
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', function(e) {
      e.preventDefault();
      logoutUser();
    });
  }
});