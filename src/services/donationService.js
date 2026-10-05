const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

const getDonations = async() => {
    try{
        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };
        const res = await fetch(`${BASE_URL}/donations`, config);

        const data = await res.json();

        if (data.detail){
            throw new Error(data.detail);
        }
        return data;
    }catch(err){
        throw new Error('Unable to load donations. Please try again')

    }
}

const getDonationById = async (id) => {
    try{
        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }
        const res = await fetch(`${BASE_URL}/donations/${id}`, config)

        const data = await res.json()

        if (data.detail){
            throw new Error(data.detail)
        }
        return data
    } catch(err){
        throw new Error('Unable to load donation details. Please try again')
    }
}

const getDonationItems = async(donationId) => {
    try{
        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }

        const res = await fetch(
            `${BASE_URL}/donations/${donationId}/items`,
            config
        )

        const data = await res.json()

        if (data.detail){
            throw new Error(data.detail)
        }
        return data
    }catch(err){
        throw new Error('Unable to load donation Items. Please try again')
    }
}

const getItemById = async(id) => {
    try{
        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }

        const res = await fetch(`${BASE_URL}/items/${id}`, config)

        const data = await res.json()

        if (data.detail){
            throw new Error(data.detail)
        }

        return data
    }catch(err){
        throw new Error('Unable to load it details. Please try again')
    }
}

const createDonation = async(formData)=>{
    try{
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }

        const res = await fetch(`${BASE_URL}/donations`, {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify(formData)
        })
        const data = await res.json()
        if (data.detail){
            throw new Error(data.detail)
        }
        return data
    }catch(err){
        throw new Error('Unable to create donation request. Please try again')

    }
}

const createItem = async (donationId, itemData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };

    const res = await fetch(
      `${BASE_URL}/donations/${donationId}/items`,
      {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify(itemData)
      }
    );

    const data = await res.json();

    if (data.detail) {
      throw new Error(data.detail);
    }

    return data;
  } catch (err) {
    throw new Error('Unable to create item. Please try again');
  }
};

const uploadItemImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };

    const res = await fetch(`${BASE_URL}/items/upload`, {
      method: 'POST',
      headers: config.headers,
      body: formData
    });

    const data = await res.json();

    if (data.detail) {
      throw new Error(data.detail);
    }

    return data;
  } catch (err) {
    throw new Error('Unable to upload item image. Please try again');
  }
};

const updateDonation = async (id, formData) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    };

    const res = await fetch(`${BASE_URL}/donations/${id}`, {
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
    throw new Error("Unable to update donation. Please try again");
  }
};

const cancelDonation = async (id) => {
  try {
    const config = {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    };

    const res = await fetch(`${BASE_URL}/donations/${id}/cancel`, {
      method: "DELETE",
      headers: config.headers
    });

    const data = await res.json();

    if (data.detail) {
      throw new Error(data.detail);
    }

    return data;
  } catch (err) {
    throw new Error("Unable to cancel donation. Please try again");
  }
};

const updateItem = async (id, itemData) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    };

    const res = await fetch(`${BASE_URL}/items/${id}`, {
      method: "PUT",
      headers: config.headers,
      body: JSON.stringify(itemData)
    });

    const data = await res.json();

    if (data.detail) {
      throw new Error(data.detail);
    }

    return data;
  } catch (err) {
    throw new Error("Unable to update item. Please try again");
  }
};

const deleteItem = async (id) => {
  try {
    const config = {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    };

    const res = await fetch(`${BASE_URL}/items/${id}`, {
      method: "DELETE",
      headers: config.headers
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail);
    }

    return true;
  } catch (err) {
    throw new Error("Unable to delete item. Please try again");
  }
};

const getCollectorDonations = async () => {
  try {
    const config = {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    };

    const res = await fetch(
      `${BASE_URL}/collector/donations`,
      config
    );

    const data = await res.json();

    if (data.detail) {
      throw new Error(data.detail);
    }

    return data;
  } catch (err) {
    throw new Error(err.message || "Unable to load donations");
  }
};

const updateCollectorDonationStatus = async (donationId, status) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    };

    const res = await fetch(
      `${BASE_URL}/collector/donations/${donationId}/status?status=${status}`,
      {
        method: "PUT",
        headers: config.headers
      }
    );

    const data = await res.json();

    if (data.detail) {
      throw new Error(data.detail);
    }

    return data;
  } catch (err) {
    throw new Error(err.message || "Unable to update donation status");
  }
};

const updatePickupResult = async (
  donationId,
  pickupSuccessful,
  failedReason = null
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    };

    const res = await fetch(
      `${BASE_URL}/collector/donations/${donationId}/result`,
      {
        method: "PUT",
        headers: config.headers,
        body: JSON.stringify({
          pickup_successful: pickupSuccessful,
          failed_reason: failedReason
        })
      }
    );

    const data = await res.json();

    if (data.detail) {
      throw new Error(data.detail);
    }

    return data;
  } catch (err) {
    throw new Error(err.message || "Unable to update pickup result");
  }
};

const uploadProofPhoto = async (donationId, file) => {
  try {
    const formData = new FormData();

    formData.append("file", file);

    const config = {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    };

    const res = await fetch(
      `${BASE_URL}/collector/donations/${donationId}/proof`,
      {
        method: "POST",
        headers: config.headers,
        body: formData
      }
    );

    const data = await res.json();

    if (data.detail) {
      throw new Error(data.detail);
    }

    return data;
  } catch (err) {
    throw new Error(err.message || "Unable to upload proof photo");
  }
};

const assignCollector = async (donationId, collectorId) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    };

    const res = await fetch(
      `${BASE_URL}/admin/donations/${donationId}/assign?collector_id=${collectorId}`,
      {
        method: "PUT",
        headers: config.headers
      }
    );

    const data = await res.json();

    if (data.detail) {
      throw new Error(data.detail);
    }

    return data;
  } catch (err) {
    throw new Error(err.message || "Unable to assign collector");
  }
};

const getAdminDonations = async () => {
  try {
    const config = {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    };

    const res = await fetch(
      `${BASE_URL}/admin/donations`,
      config
    );

    const data = await res.json();

    if (data.detail) {
      throw new Error(data.detail);
    }

    return data;
  } catch (err) {
    throw new Error(err.message || "Unable to load donations");
  }
};

const deleteAdminDonation = async (donationId) => {
  try {
    const config = {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    };

    const res = await fetch(
      `${BASE_URL}/admin/donations/${donationId}`,
      {
        method: "DELETE",
        headers: config.headers
      }
    );

    const data = await res.json();

    if (data.detail) {
      throw new Error(data.detail);
    }

    return data;
  } catch (err) {
    throw new Error(err.message || "Unable to delete donation");
  }
};

export {
    getDonations, 
    getDonationById, 
    getDonationItems, 
    getItemById, 
    createDonation, 
    createItem, 
    uploadItemImage, 
    updateDonation, 
    cancelDonation, 
    updateItem, 
    deleteItem,
    getCollectorDonations,
    updateCollectorDonationStatus,
    updatePickupResult,
    uploadProofPhoto,
    assignCollector,
    getAdminDonations,
    deleteAdminDonation
    

};