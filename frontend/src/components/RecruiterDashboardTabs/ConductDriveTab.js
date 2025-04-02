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
  recruiterName1,
  setRecruiterName1,
  recruiterEmail1,
  setRecruiterEmail1,
  drives,
  loadingDrives,
  handleDeleteDrive,
  handleDriveSubmit
}) => {
  const handleSubmitWithLogging = (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log("Drive Name:", driveName);
    console.log("Drive Capacity:", driveCapacity);
    console.log("Drive Date:", driveDate);
    console.log("Drive Time:", driveTime);
    console.log("Drive Location:", driveLocation);
    console.log("Drive Description:", driveDescription);
    console.log("Recruiter Name:", recruiterName1);
    console.log("Recruiter Email:", recruiterEmail1);
    
    // Call the actual submit handler passed as prop
    handleDriveSubmit(e);
  };

  return (
    <div className="dashboard-section" style={{ gridColumn: "span 2" }}>
      <div className="section-header">
        <h2>Conduct a Drive</h2>
      </div>
      <div className="section-content">
        <div className="drive-form">
          <form className="dashboard-form" onSubmit={handleSubmitWithLogging}>
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
                  type="text" 
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
            
            <div className="form-group">
              <label>Recruiter Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={recruiterName1} 
                onChange={(e) => setRecruiterName1(e.target.value)} 
                placeholder="Recruiter's Name" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Recruiter Email</label>
              <input 
                type="email" 
                className="form-control" 
                value={recruiterEmail1} 
                onChange={(e) => setRecruiterEmail1(e.target.value)} 
                placeholder="Recruiter's Email" 
                required 
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Schedule Drive
              </button>
            </div>
          </form>
        </div>
        
        <h3>Scheduled Drives</h3>
        
        {loadingDrives ? (
          <div className="loading">
            <span>Loading drives...</span>
          </div>
        ) : drives.length > 0 ? (
          <div className="drives-grid">
            {drives.map((drive) => (
              <div key={drive.id} className="drive-card">
                <div className="drive-header">
                  <div>
                    <h3 className="drive-title">{drive.name}</h3>
                    <div className="drive-date">{drive.date} at {drive.time}</div>
                  </div>
                  <span className={`status-chip status-${drive.status ? drive.status.toLowerCase() : 'pending'}`}>
                    {drive.status || "Pending"}
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
                  
                  <div className="drive-property">
                    <div className="drive-property-label">Recruiter Name:</div>
                    <div className="drive-property-value">{drive.recruiter_name}</div>
                  </div>
                  
                  <div className="drive-property">
                    <div className="drive-property-label">Recruiter Email:</div>
                    <div className="drive-property-value">{drive.recruiter_email}</div>
                  </div>
                </div>
                
                <div className="drive-card-actions">
                  <button 
                    className="btn btn-destructive btn-icon"
                    onClick={() => handleDeleteDrive(drive.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-jobs">
            <p>No drives scheduled yet. Create your first recruitment drive!</p>
          </div>
        )}
      </div>
    </div>
  );
};
