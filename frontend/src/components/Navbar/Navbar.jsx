import React from 'react';
import { Bell, UserCircle } from 'lucide-react';

const Navbar = () => {
return (
<header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
<h2 className="text-lg font-semibold text-gray-600">AI Assistant Online</h2>
<div className="flex items-center space-x-4">
<Bell className="text-gray-500 cursor-pointer hover:text-primary" />
<div className="flex items-center space-x-2 border-l pl-4">
<span className="text-sm font-medium">Candidate Mode</span>
<UserCircle className="text-primary w-8 h-8" />
 </div>
</div>
 </header>
  );
};

export default Navbar; 