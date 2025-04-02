import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RationNotificationPage.css'; // Optional

const RationNotificationPage = () => {
  const [entitlement, setEntitlement] = useState('');
  const [items, setItems] = useState([{ itemName: '', quantity: '' }]);
  const [lastPickupDate, setLastPickupDate] = useState('');
  const [notifications, setNotifications] = useState([]); // NEW STATE
  
  const navigate = useNavigate();

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/ration/notifications'); // Add your GET endpoint
      const data = await res.json();
      if (res.ok) {
        // Sort by createdAt descending (newest first)
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifications(sorted);
      } else {
        console.error('Failed to fetch notifications:', data.message);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addNewItem = () => {
    setItems([...items, { itemName: '', quantity: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!entitlement || !lastPickupDate || items.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    const payload = {
      entitlement,
      items,
      lastPickupDate,
    };

    console.log('Sending notification:', payload);

    try {
      const res = await fetch('http://localhost:5000/api/ration/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Notification sent successfully!');
        // Refresh notifications list after successful submission
        fetchNotifications();

        // Reset form
        setEntitlement('');
        setItems([{ itemName: '', quantity: '' }]);
        setLastPickupDate('');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="notification-container">
      <h2>Send Ration Notification</h2>

      <form onSubmit={handleSubmit} className="notification-form">
        <div className="form-group">
          <label htmlFor="entitlement">Ration Entitlement</label>
          <select
            id="entitlement"
            value={entitlement}
            onChange={(e) => setEntitlement(e.target.value)}
            required
          >
            <option value="">Select Entitlement</option>
            <option value="APL">APL</option>
            <option value="BPL">BPL</option>
          </select>
        </div>

        <div className="form-group">
          <label>Ration Items and Quantity</label>
          {items.map((item, index) => (
            <div key={index} className="item-row">
              <input
                type="text"
                placeholder="Item Name"
                value={item.itemName}
                onChange={(e) =>
                  handleItemChange(index, 'itemName', e.target.value)
                }
                required
              />
              <input
                type="number"
                placeholder="Quantity (kg/litre)"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, 'quantity', e.target.value)
                }
                required
              />
            </div>
          ))}
          <button type="button" onClick={addNewItem}>
            Add Another Item
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="pickupDate">Last Pickup Date</label>
          <input
            type="date"
            id="pickupDate"
            value={lastPickupDate}
            onChange={(e) => setLastPickupDate(e.target.value)}
            required
          />
        </div>

        <div className="button-group">
          <button type="submit">Send Notification</button>
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>

      {/* Notifications list */}
      <div className="notifications-list">
        <h3>Sent Notifications</h3>
        {notifications.length === 0 ? (
          <p>No notifications sent yet.</p>
        ) : (
          <ul>
            {notifications.map((notif) => (
              <li key={notif._id} className="notification-item">
                <strong>Entitlement:</strong> {notif.entitlement} <br />
                <strong>Items:</strong>
                <ul>
                  {notif.items.map((item, idx) => (
                    <li key={idx}>
                      {item.itemName} - {item.quantity}
                    </li>
                  ))}
                </ul>
                <strong>Last Pickup Date:</strong>{' '}
                {new Date(notif.lastPickupDate).toLocaleDateString()} <br />
                <strong>Sent On:</strong>{' '}
                {new Date(notif.createdAt).toLocaleString()}
                <hr />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RationNotificationPage;
