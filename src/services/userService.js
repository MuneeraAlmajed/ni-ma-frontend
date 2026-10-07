
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

const currentUser = async () => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
    const res = await fetch(`${BASE_URL}/current_user`, config);

    const data = await res.json();

    if (data.detail) {
      throw new Error(data.detail);
    }

    return data
  } catch (err) {
    console.log(err);
    throw new Error(err, { cause: err });
  }
};

const updateProfile = async (formData) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    };

    const res = await fetch(`${BASE_URL}/auth`, {
      method: "PUT",
      headers: config.headers,
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (data.detail) {
      throw new Error(data.detail);
    }

    return data;
  } catch (err) {
    throw new Error("Unable to update profile. Please try again");
  }
};

const updatePassword = async (formData) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    };

    const res = await fetch(`${BASE_URL}/auth/password`, {
      method: "PUT",
      headers: config.headers,
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (data.detail) {
      throw new Error(data.detail);
    }

    return data;
  } catch (err) {
    throw new Error("Unable to update password. Please try again");
  }
};


const getCollectors = async () => {
  try {
    const config = {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    };

    const res = await fetch(`${BASE_URL}/collectors`, config);

    const data = await res.json();

    if (data.detail) {
      throw new Error(data.detail);
    }

    return data;
  } catch (err) {
    throw new Error("Unable to load collectors");
  }
};

const createCollector = async (collectorData) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    };

    const res = await fetch(`${BASE_URL}/collectors`, {
      method: "POST",
      headers: config.headers,
      body: JSON.stringify(collectorData)
    });

    const data = await res.json();

    if (data.detail) {
      throw new Error(data.detail);
    }

    return data;
  } catch (err) {
    throw new Error(err.message || "Unable to add collector");
  }
};

const updateCollector = async (userId, collectorData) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    };

    const res = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: config.headers,
      body: JSON.stringify(collectorData)
    });

    const data = await res.json();

    if (data.detail) {
      throw new Error(data.detail);
    }

    return data;
  } catch (err) {
    throw new Error(err.message || "Unable to update collector");
  }
};

const updateCollectorStatus = async (userId, isActive) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    };

    const res = await fetch(`${BASE_URL}/users/${userId}/status`, {
      method: "PUT",
      headers: config.headers,
      body: JSON.stringify({
        is_active: isActive
      })
    });

    const data = await res.json();

    if (data.detail) {
      throw new Error(data.detail);
    }

    return data;
  } catch (err) {
    throw new Error(err.message || "Unable to update collector status");
  }
};

export {
  currentUser, 
  updateProfile, 
  updatePassword, 
  getCollectors, 
  createCollector,
  updateCollector,
  updateCollectorStatus
};