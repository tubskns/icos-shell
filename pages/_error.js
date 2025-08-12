import React from 'react';

function Error({ statusCode }) {
  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f5f5f5'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        We're sorry, but something went wrong. Please try refreshing the page.
      </p>
      <button 
        onClick={() => window.location.reload()}
        style={{
          padding: '12px 24px',
          background: '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Refresh Page
      </button>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error; 