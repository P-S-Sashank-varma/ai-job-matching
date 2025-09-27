import React from "react";
import { Calendar, Users, MapPin, Trash2 } from "lucide-react";
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

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
    e.preventDefault();
    handleDriveSubmit(e);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-red-100/90 to-rose-100/90 rounded-xl border border-red-200/50 shadow-lg space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-red-200">
        <Calendar className="w-6 h-6 text-red-600" />
        <h2 className="text-2xl font-bold text-gray-900">Conduct a Drive</h2>
      </div>

      <Card className="p-6 bg-gradient-to-br from-white/90 to-red-50/90 border-red-200">
        <form className="space-y-4" onSubmit={handleSubmitWithLogging}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Drive Name</label>
              <input 
                type="text"
                className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-red-50/50 text-sm"
                value={driveName}
                onChange={(e) => setDriveName(e.target.value)}
                placeholder="Enter drive name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Drive Capacity</label>
              <input 
                type="number"
                className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-red-50/50 text-sm"
                value={driveCapacity}
                onChange={(e) => setDriveCapacity(e.target.value)}
                placeholder="Number of participants"
                min="1"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Drive Date</label>
              <input 
                type="date"
                className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-red-50/50 text-sm"
                value={driveDate}
                onChange={(e) => setDriveDate(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Drive Time</label>
              <input 
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={driveTime}
                onChange={(e) => setDriveTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drive Location</label>
            <input 
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              value={driveLocation}
              onChange={(e) => setDriveLocation(e.target.value)}
              placeholder="Enter location or 'Virtual'"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recruiter Name</label>
              <input 
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={recruiterName1}
                onChange={(e) => setRecruiterName1(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recruiter Email</label>
              <input 
                type="email"
                className="w-full px-3 py-2 border border-red-300 rounded-lg bg-red-50/30 text-gray-600 text-sm"
                value={recruiterEmail1}
                onChange={(e) => setRecruiterEmail1(e.target.value)}
                placeholder="your.email@company.com"
                readOnly
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drive Description</label>
            <textarea 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              rows={3}
              value={driveDescription}
              onChange={(e) => setDriveDescription(e.target.value)}
              placeholder="Describe the hiring drive, requirements, and process..."
              required
            />
          </div>
          
          <div className="flex justify-end pt-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6">
              Create Drive
            </Button>
          </div>
        </form>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Your Hiring Drives</h3>
        
        {loadingDrives ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading drives...</span>
          </div>
        ) : drives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drives.map((drive) => (
              <Card key={drive.id} className="hover:shadow-lg transition-shadow duration-200">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-lg text-gray-900">{drive.drive_name}</h4>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteDrive(drive.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 h-8 w-8"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{drive.drive_date} at {drive.drive_time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{drive.drive_location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <Badge variant="secondary">{drive.drive_capacity} positions</Badge>
                    </div>
                  </div>
                  
                  {drive.drive_description && (
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">{drive.drive_description}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 mt-3 border-t border-gray-100">
                    <span>Drive ID: {drive.id}</span>
                    <span>By: {drive.recruiter_name}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No drives scheduled</h4>
            <p className="text-gray-600">Create your first hiring drive to start recruiting candidates.</p>
          </Card>
        )}
      </div>
    </div>
  );
};