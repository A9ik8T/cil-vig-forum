// XAMPP Backend API Configuration
// Update this URL if your ngrok URL changes
export const API_BASE_URL = "https://clarinda-brushlike-nonvocally.ngrok-free.dev/coal_india";

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/api/login.php`,
  register: `${API_BASE_URL}/api/register.php`,
  submitComplaint: `${API_BASE_URL}/api/submit_complaint.php`,
};

// Helper function to make API calls with ngrok headers
export const apiCall = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true', // Skip ngrok warning page
      ...options.headers,
    },
  });
  return response;
};
