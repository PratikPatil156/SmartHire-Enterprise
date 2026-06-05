import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { profileService } from '../../services/api';

const Navbar = () => {
  const savedUser = JSON.parse(localStorage.getItem('user')) || {};
  const [avatar, setAvatar] = useState(localStorage.getItem('student_profile_avatar') || null);
  const [candidateName, setCandidateName] = useState(savedUser.name || "Candidate");

  useEffect(() => {
    if (savedUser.id) {
      profileService.getProfile(savedUser.id)
        .then(profile => {
          if (profile?.avatar_image) {
            localStorage.setItem('student_profile_avatar', profile.avatar_image);
            setAvatar(profile.avatar_image);
          }
          if (profile?.name) {
            const updatedUser = { ...savedUser, name: profile.name };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setCandidateName(profile.name);
          }
        })
        .catch(err => console.error("Error fetching candidate profile details:", err));
    }
  }, [savedUser.id]);

  return (
    <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-600">AI Assistant Online</h2>
      <div className="flex items-center space-x-4">
        <Bell className="text-gray-500 cursor-pointer hover:text-primary" />
        <div className="flex items-center space-x-2 border-l pl-4">
          <span className="text-sm font-medium">Candidate Mode</span>
          {avatar ? (
            <img 
              src={avatar} 
              className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-sm" 
              alt="Avatar" 
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-black border border-white/20">
              {candidateName ? candidateName.charAt(0).toUpperCase() : "?"}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar; 