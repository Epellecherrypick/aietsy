import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, setUser, token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await API.put('/users/profile', formData);
      setUser(response.data);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <div className={styles.container}>Please login to view your profile</div>;
  }

  return (
    <div className={styles.container}>
      <h1>My Profile</h1>

      {message && <div className={styles.message}>{message}</div>}

      <div className={styles.profileWrapper}>
        <div className={styles.profileCard}>
          <div className={styles.avatar}>
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.username} />
            ) : (
              <div className={styles.avatarPlaceholder}>👤</div>
            )}
          </div>

          <div className={styles.userInfo}>
            <h2>{user?.username}</h2>
            <p>{user?.email}</p>
            {user?.isSeller && (
              <span className={styles.sellerBadge}>✓ Seller</span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>Edit Profile</h2>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about yourself..."
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
