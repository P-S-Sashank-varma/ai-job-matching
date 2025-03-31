import React from "react";

export const ConductDriveTab = ({
  driveName,
  setDriveName,
  driveCapacity,
  setDriveCapacity,
  driveDate,
  setDriveDate,
  driveTime,
  setDriveTime,
  driveLocation,
  setDriveLocation,
  driveDescription,
  setDriveDescription,
  drives,
  loadingDrives,
  handleDeleteDrive,
  handleDriveSubmit
}) => {
  return (
    <div className="dashboard-section" style={{ gridColumn: "span 2" }}>
      <div className="section-header">
        <h2>Conduct a Drive</h2>
        <div className="section-header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
      </div>
      <div className="section-content">
        <div className="drive-form">
          <form className="dashboard-form" onSubmit={handleDriveSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Drive Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={driveName} 
                  onChange={(e) => setDriveName(e.target.value)} 
                  placeholder="e.g. Campus Recruitment Drive" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Capacity</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={driveCapacity} 
                  onChange={(e) => setDriveCapacity(e.target.value)} 
                  placeholder="Number of candidates" 
                  required 
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={driveDate} 
                  onChange={(e) => setDriveDate(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Time</label>
                <input 
                  type="time" 
                  className="form-control" 
                  value={driveTime} 
                  onChange={(e) => setDriveTime(e.target.value)} 
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                className="form-control" 
                value={driveLocation} 
                onChange={(e) => setDriveLocation(e.target.value)} 
                placeholder="e.g. University Campus or Virtual (Zoom)" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea 
                className="form-control textarea-control" 
                value={driveDescription} 
                onChange={(e) => setDriveDescription(e.target.value)} 
                placeholder="Describe the recruitment drive, requirements, process, etc." 
                required
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Schedule Drive
              </button>
            </div>
          </form>
        </div>
        
        <h3>Scheduled Drives</h3>
        
        {loadingDrives ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <span>Loading drives...</span>
          </div>
        ) : drives.length > 0 ? (
          <div className="drives-grid">
            {drives.map((drive) => (
              <div key={drive.id} className="drive-card">
                <div className="drive-header">
                  <div>
                    <h3 className="drive-title">{drive.name}</h3>
                    <div className="drive-date">
                      {drive.date} at {drive.time}
                    </div>
                  </div>
                  <span className={`status-chip status-${drive.status.toLowerCase()}`}>
                    {drive.status}
                  </span>
                </div>
                
                <div className="drive-content">
                  <div className="drive-property">
                    <div className="drive-property-label">Location:</div>
                    <div className="drive-property-value">{drive.location}</div>
                  </div>
                  
                  <div className="drive-property">
                    <div className="drive-property-label">Capacity:</div>
                    <div className="drive-property-value">{drive.capacity} candidates</div>
                  </div>
                  
                  <div className="drive-property">
                    <div className="drive-property-label">Description:</div>
                    <div className="drive-property-value">{drive.description}</div>
                  </div>
                </div>
                
                <div className="drive-card-actions">
                  <button 
                    className="btn btn-destructive btn-icon"
                    onClick={() => handleDeleteDrive(drive.id)}
                    title="Delete Drive"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-jobs">
            <div className="no-jobs-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <p>No drives scheduled yet. Create your first recruitment drive!</p>
          </div>
        )}
      </div>
    </div>
  );
};
