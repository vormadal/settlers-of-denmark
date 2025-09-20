import React from 'react';

const DebugPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Debug Page</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Debug functionality will be restored in a future update.</p>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;