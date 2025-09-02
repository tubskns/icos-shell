import React from 'react';
import AllProjects from './index';

const ErrorWrapper = () => {
    try {
        return <AllProjects />;
    } catch (error) {
        console.error('Error in AllProjects:', error);
        return (
            <div style={{
                padding: '20px',
                textAlign: 'center',
                background: '#ffebee',
                border: '1px solid #f44336',
                borderRadius: '8px',
                margin: '20px'
            }}>
                <h3>Error Loading Deployments</h3>
                <p>There was an error loading the deployments page. Please try refreshing.</p>
                <button 
                    onClick={() => window.location.reload()}
                    style={{
                        padding: '8px 16px',
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Refresh
                </button>
            </div>
        );
    }
};

export default ErrorWrapper; 