// API Interface wrapper for the Horizontal Learning Platform

// In production on Vercel, the backend endpoints are served from the same origin under /api
// In local development, they will be routed by Vite or can target absolute hosts
const API_BASE = '/api';

function getHeaders() {
  const token = localStorage.getItem('user_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {})
    }
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Server request execution failed.');
  }
  return data;
}

// 1. AUTHENTICATION HANDLERS
export async function login(email, password) {
  const data = await request('/auth', {
    method: 'POST',
    body: JSON.stringify({ action: 'login', email, password })
  });
  // Save credentials in local storage
  localStorage.setItem('user_token', data.token);
  localStorage.setItem('user_session', JSON.stringify({ email: data.user.email }));
  return data;
}

export async function register(firstName, lastName, email, password, department, role) {
  return request('/auth', {
    method: 'POST',
    body: JSON.stringify({
      action: 'register',
      firstName,
      lastName,
      email,
      password,
      department,
      role
    })
  });
}

export function logout() {
  localStorage.removeItem('user_token');
  localStorage.removeItem('user_session');
}

// 2. PROFILE & ENROLLMENT HANDLERS
export async function fetchProfile() {
  return request('/profile');
}

export async function updateProfile(firstName, lastName, phone, role, avatarUrl, department) {
  return request('/profile', {
    method: 'PUT',
    body: JSON.stringify({
      action: 'update-profile',
      firstName,
      lastName,
      phone,
      role,
      avatarUrl,
      department
    })
  });
}

export async function enrollInTrack(primary, target) {
  return request('/profile', {
    method: 'PUT',
    body: JSON.stringify({
      action: 'enroll-track',
      primary,
      target
    })
  });
}

export async function disenrollTrack() {
  return request('/profile', {
    method: 'DELETE'
  });
}

// 3. COURSES & PLAYLISTS PROGRESS HANDLERS
export async function fetchCourse(courseId) {
  return request(`/courses?id=${courseId}`);
}

export async function markVideoWatched(courseId, videoId) {
  return request('/courses', {
    method: 'POST',
    body: JSON.stringify({
      courseId,
      videoId
    })
  });
}

// 4. EXAMS & ACCREDITATION HANDLERS
export async function checkExamEligibility(examId) {
  return request(`/exams?examId=${examId}`);
}

export async function saveExamScore(examId, score, title, totalQuestions) {
  return request('/exams', {
    method: 'POST',
    body: JSON.stringify({
      examId,
      score,
      title,
      totalQuestions
    })
  });
}
