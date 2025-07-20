import React from 'react'; // Keeping this import as it is necessary


const ProjectsOverview: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 flex flex-col items-center justify-center min-h-[300px]">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Projects Coming Soon</h3>
      <p className="text-gray-600 text-lg text-center max-w-xl">
        We are working hard to bring you exciting blockchain investment opportunities. Please check back soon for new projects and updates!
      </p>
    </div>
  );
};

export default ProjectsOverview;
