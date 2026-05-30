const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://marketplace-jy5t.onrender.com/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const api = {
  login(payload) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  register(payload) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  submitKYB(token, payload) {
    return request("/kyb", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    });
  },

  submitKYC(token, payload) {
    return request("/kyc", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    });
  },

  getDashboard(token) {
    return request("/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  listProjects(token, mine = false) {
    return request(`/projects${mine ? "?mine=true" : ""}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  createProject(token, payload) {
    return request("/projects", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  submitBid(token, projectId, payload) {
    return request(`/projects/${projectId}/bids`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },
};
