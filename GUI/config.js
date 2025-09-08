// Configuration for ICOS GUI - Single source of truth for Controller (Shell) API
// IMPORTANT: In the browser bundle, Next.js only replaces direct references like
// process.env.NEXT_PUBLIC_FOO. Do not iterate over process.env.

const controllerAddress = process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS || '';
const lighthouseAddress = process.env.NEXT_PUBLIC_LIGHTHOUSE_ADDRESS || '';
const controllerTimeout = parseInt(process.env.NEXT_PUBLIC_CONTROLLER_TIMEOUT || '15000', 10);

// On the server, enforce presence; in the browser, just warn to avoid runtime crash
if (!controllerAddress) {
  if (typeof window === 'undefined') {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_CONTROLLER_ADDRESS');
  } else {
    // eslint-disable-next-line no-console
    console.warn('NEXT_PUBLIC_CONTROLLER_ADDRESS is not defined. Set it in .env.local');
  }
}

const config = {
  // Controller (Shell) base URL, e.g. https://your-server:8080/api/v3
  controllerAddress,

  // Lighthouse base URL for controller data
  lighthouseAddress,

  // Default timeouts (optional)
  controllerTimeout,

  // API Endpoints relative to controllerAddress (Shell OpenAPI)
  apiEndpoints: {
    // Auth (Shell user login)
    userLogin: '/user/login',

    // Controllers
    controllers: '/controller/',

    // Deployments
    deployments: '/deployment/',
    deploymentById: (deploymentId) => `/deployment/${deploymentId}`,
    startDeployment: (deploymentId) => `/deployment/${deploymentId}/start`,
    stopDeployment: (deploymentId) => `/deployment/${deploymentId}/stop`,

    // Resources
    resources: '/resource/',
    resourceById: (resourceId) => `/resource/${resourceId}`,

    // Metrics
    metricsGet: '/metrics/get',
    metricsTrain: '/metrics/train',
    metricsPredict: '/metrics/predict',
    metricsDelete: '/metrics/delete',
  }
};

export default config;