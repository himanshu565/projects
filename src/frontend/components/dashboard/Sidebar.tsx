import React from 'react';
import { BarChart3, Package, MessageSquare, Users, Settings, LogOut, HelpCircle } from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  const menuItems = [
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'products', icon: Package, label: 'Products' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'customers', icon: Users, label: 'Customers' },
  ];

  const bottomItems = [
    { id: 'settings', icon: Settings, label: 'Setting' },
    { id: 'logout', icon: LogOut, label: 'Logout' },
  ];

  return (
    <div className="w-64 bg-white h-screen flex flex-col shadow-sm border-r border-gray-100">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-bold text-gray-900">Business</span>
        </div>
      </div>

      {/* Main Menu */}
      <div className="flex-1 py-6">
        <nav className="space-y-2 px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors duration-200 ${
                activeItem === item.id
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Menu */}
      <div className="p-3 border-t border-gray-100">
        <div className="space-y-2">
          {bottomItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="p-6 border-t border-gray-100">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <HelpCircle className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">Need Help</p>
              <p className="text-xs text-gray-500 mb-3">You can contact?</p>
              <button className="bg-blue-600 text-white text-xs font-medium px-3 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                GET SUPPORT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;