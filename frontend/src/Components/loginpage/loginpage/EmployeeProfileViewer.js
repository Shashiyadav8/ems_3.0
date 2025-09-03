import React, { useEffect, useState } from 'react';
import './EmployeeProfileViewer.css';

const EmployeeProfileViewer = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Use API base URL from .env
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/employees/profiles`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProfiles(data);
          setFilteredProfiles(data); // Initialize filteredProfiles
        } else {
          console.error('Failed to fetch employee profiles');
        }
      } catch (err) {
        console.error('Error fetching employee profiles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [API_BASE_URL]);

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = profiles.filter(
      (emp) =>
        (emp.name && emp.name.toLowerCase().includes(value)) ||
        (emp.employee_id && emp.employee_id.toLowerCase().includes(value)) ||
        (emp.email && emp.email.toLowerCase().includes(value)) ||
        (emp.role && emp.role.toLowerCase().includes(value))
    );

    setFilteredProfiles(filtered);
  };

  if (loading) {
    return <p>Loading profiles...</p>;
  }

  return (
    <div className="employee-profile-viewer">
      <h3>Employee Profiles</h3>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, ID, email, or role..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {filteredProfiles.length === 0 ? (
        <p>No profiles found.</p>
      ) : (
        <div className="profile-card-grid">
          {filteredProfiles.map((emp) => (
            <div className="profile-card" key={emp._id || emp.id}>
              <h4>{emp.name}</h4>
              <p><strong>Employee ID:</strong> {emp.employee_id}</p>
              <p><strong>Email:</strong> {emp.email}</p>
              <p><strong>Phone:</strong> {emp.phone || '-'}</p>
              <p><strong>Role:</strong> {emp.role}</p>
              <p><strong>Leave Quota:</strong> {emp.leave_quota}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeProfileViewer;
