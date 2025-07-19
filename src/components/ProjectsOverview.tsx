import React from 'react';
import { TrendingUp, DollarSign, Target } from 'lucide-react';
import type { Project } from '../types';

const ProjectsOverview: React.FC = () => {
  // Mock projects data
  const projects: Project[] = [
    {
      id: '1',
      name: 'DeFi Lending Platform',
      description: 'Decentralized lending protocol built on TON blockchain',
      status: 'active',
      progress: 75,
      investment_amount: 50000,
      expected_return: 25,
      start_date: '2024-01-15',
      end_date: '2024-12-31'
    },
    {
      id: '2',
      name: 'NFT Marketplace',
      description: 'Next-generation NFT trading platform with low fees',
      status: 'completed',
      progress: 100,
      investment_amount: 75000,
      expected_return: 40,
      start_date: '2023-06-01',
      end_date: '2024-03-31'
    },
    {
      id: '3',
      name: 'Cross-Chain Bridge',
      description: 'Secure bridge connecting TON with other major blockchains',
      status: 'upcoming',
      progress: 0,
      investment_amount: 100000,
      expected_return: 35,
      start_date: '2024-06-01',
      end_date: '2025-05-31'
    }
  ];

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalInvestment = projects.reduce((sum, project) => sum + project.investment_amount, 0);
  const averageReturn = projects.reduce((sum, project) => sum + project.expected_return, 0) / projects.length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Investment</div>
              <div className="text-2xl font-bold text-gray-900">
                ${totalInvestment.toLocaleString()}
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Active Projects</div>
              <div className="text-2xl font-bold text-gray-900">
                {projects.filter(p => p.status === 'active').length}
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Avg. Expected Return</div>
              <div className="text-2xl font-bold text-gray-900">
                {averageReturn.toFixed(1)}%
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Investment Projects</h3>
          <p className="text-gray-600 text-sm mt-1">Track your blockchain investments and returns</p>
        </div>

        <div className="divide-y divide-gray-200">
          {projects.map((project) => (
            <div key={project.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{project.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Investment</div>
                      <div className="font-medium text-gray-900">${project.investment_amount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Expected Return</div>
                      <div className="font-medium text-green-600">{project.expected_return}%</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Start Date</div>
                      <div className="font-medium text-gray-900">
                        {new Date(project.start_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">End Date</div>
                      <div className="font-medium text-gray-900">
                        {new Date(project.end_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  View Details
                </button>
                {project.status === 'active' && (
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    Manage Investment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsOverview;
