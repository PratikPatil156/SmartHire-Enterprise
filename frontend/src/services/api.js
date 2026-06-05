import axios from 'axios';

// Hamare Python FastAPI backend ka URL
const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Agar localstorage me token milega, 
// toh ye use har request ke header me automatic attach kar dega.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// AUTH SERVICES (Login, Register aur Resume Upload ke calls yahan se jayenge)
export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Registration failed. Server Error!";
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Login failed. Invalid Credentials!";
    }
  },

  // Resume Upload karne ka live Axios function
  uploadResume: async (userId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file); // Asli file ko Form Data me add kiya

      // Is request ke liye content-type ko multipart/form-data kiya hai
      const response = await api.post(`/auth/upload-resume/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "File upload failed. Server Error!";
    }
  }
};

// JOBS SERVICES
export const jobsService = {
  getAll: async () => {
    try {
      const response = await api.get('/jobs');
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to fetch jobs.";
    }
  },

  create: async (jobData) => {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to create job.";
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to delete job.";
    }
  },

  update: async (id, jobData) => {
    try {
      const response = await api.put(`/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to update job.";
    }
  }
};

// APPLICATIONS SERVICES
export const appsService = {
  apply: async (jobId) => {
    try {
      const response = await api.post(`/jobs/${jobId}/apply`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to apply for job.";
    }
  },

  getAll: async () => {
    try {
      const response = await api.get('/applications');
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to fetch applications.";
    }
  },

  updateStatus: async (appId, status) => {
    try {
      const payload = typeof status === 'object' ? status : { status };
      const response = await api.put(`/applications/${appId}/status`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to update status.";
    }
  }
};

// SAVED JOBS SERVICES
export const savedService = {
  toggle: async (jobId) => {
    try {
      const response = await api.post(`/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to save job.";
    }
  },

  getAll: async () => {
    try {
      const response = await api.get('/jobs/saved');
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to fetch saved jobs.";
    }
  }
};

// HR DASHBOARD & INTERVIEWS SERVICES
export const hrService = {
  getDashboard: async () => {
    try {
      const response = await api.get('/hr/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to fetch HR dashboard statistics.";
    }
  },

  getInterviews: async () => {
    try {
      const response = await api.get('/hr/interviews');
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to fetch HR interviews.";
    }
  }
};

// LOGS SERVICES
export const logsService = {
  getAll: async () => {
    try {
      const response = await api.get('/activity-logs');
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to fetch activity logs.";
    }
  },
  clear: async () => {
    try {
      const response = await api.delete('/activity-logs/clear');
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to clear logs.";
    }
  }
};

// SKILLS & TAGS SERVICES
export const skillsTagsService = {
  getTags: async () => {
    try {
      const response = await api.get('/skills-tags/tags');
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to fetch tags.";
    }
  },
  addTag: async (tagName) => {
    try {
      const response = await api.post('/skills-tags/tags', { name: tagName });
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to add tag.";
    }
  },
  deleteTag: async (tagName) => {
    try {
      const response = await api.delete(`/skills-tags/tags/${tagName}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to delete tag.";
    }
  },
  assignTag: async (appId, tagName) => {
    try {
      const response = await api.post(`/skills-tags/applications/${appId}/tags`, { tag_name: tagName });
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to assign tag.";
    }
  },
  removeTag: async (appId, tagName) => {
    try {
      const response = await api.delete(`/skills-tags/applications/${appId}/tags/${tagName}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to remove tag.";
    }
  },
  getSkills: async () => {
    try {
      const response = await api.get('/skills-tags/skills');
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to fetch dynamic skills.";
    }
  }
};

// PROFILE SERVICES
export const profileService = {
  getProfile: async (userId) => {
    try {
      const response = await api.get(`/profile/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to fetch profile.";
    }
  },
  updateProfile: async (userId, profileData) => {
    try {
      const response = await api.put(`/profile/${userId}`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to update profile.";
    }
  }
};

// RESUME SERVICES
export const resumeService = {
  getMyScore: async () => {
    try {
      const response = await api.get('/resume/my-score');
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to fetch resume match index.";
    }
  },
  getAnalysis: async (jobId = null) => {
    try {
      const url = jobId ? `/resume/analysis?job_id=${jobId}` : '/resume/analysis';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Failed to fetch resume analysis report.";
    }
  }
};

export default api;
