# Documentation for ICOS Shell

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *http://localhost:8080/api/v3*

| Class | Method | HTTP request | Description |
|------------ | ------------- | ------------- | -------------|
| *ControllerApi* | [**addController**](Apis/ControllerApi.md#addcontroller) | **POST** /controller/ | Adds a new controller |
*ControllerApi* | [**getControllers**](Apis/ControllerApi.md#getcontrollers) | **GET** /controller/ | Returns a list of controllers |
| *DefaultApi* | [**getHealthcheck**](Apis/DefaultApi.md#gethealthcheck) | **GET** /healthcheck | Health check |
| *DeploymentApi* | [**createDeployment**](Apis/DeploymentApi.md#createdeployment) | **POST** /deployment/ | Creates a new deployment |
*DeploymentApi* | [**deleteDeploymentById**](Apis/DeploymentApi.md#deletedeploymentbyid) | **DELETE** /deployment/{deploymentId} | Deletes a deployment |
*DeploymentApi* | [**getDeploymentById**](Apis/DeploymentApi.md#getdeploymentbyid) | **GET** /deployment/{deploymentId} | Find deployment by ID |
*DeploymentApi* | [**getDeployments**](Apis/DeploymentApi.md#getdeployments) | **GET** /deployment/ | Returns a list of deployments |
*DeploymentApi* | [**startDeploymentById**](Apis/DeploymentApi.md#startdeploymentbyid) | **PUT** /deployment/{deploymentId}/start | Starts a deployment |
*DeploymentApi* | [**stopDeploymentById**](Apis/DeploymentApi.md#stopdeploymentbyid) | **PUT** /deployment/{deploymentId}/stop | Stops a deployment |
*DeploymentApi* | [**updateDeployment**](Apis/DeploymentApi.md#updatedeployment) | **PUT** /deployment/{deploymentId} | Updates a deployment |
| *MetricsApi* | [**deleteMetrics**](Apis/MetricsApi.md#deletemetrics) | **POST** /metrics/delete | Delete metrics models |
*MetricsApi* | [**getMetrics**](Apis/MetricsApi.md#getmetrics) | **GET** /metrics/get | Returns a list of metrics models |
*MetricsApi* | [**predictMetrics**](Apis/MetricsApi.md#predictmetrics) | **POST** /metrics/predict | Predict metrics development based on model and input metrics |
*MetricsApi* | [**trainMetrics**](Apis/MetricsApi.md#trainmetrics) | **POST** /metrics/train | Trains a model on a set of metrics |
| *ResourceApi* | [**getResourceById**](Apis/ResourceApi.md#getresourcebyid) | **GET** /resource/{resourceId} | Find resource by ID |
*ResourceApi* | [**getResources**](Apis/ResourceApi.md#getresources) | **GET** /resource/ | Returns a list of resources |
| *UserApi* | [**loginUser**](Apis/UserApi.md#loginuser) | **GET** /user/login | Logs user into the system |
*UserApi* | [**logoutUser**](Apis/UserApi.md#logoutuser) | **GET** /user/logout | Logs out current logged in user session |


<a name="documentation-for-models"></a>
## Documentation for Models

 - [Controller](./Models/Controller.md)
 - [Deployment](./Models/Deployment.md)
 - [Resource](./Models/Resource.md)


<a name="documentation-for-authorization"></a>
## Documentation for Authorization

<a name="api_key"></a>
### api_key

- **Type**: API key
- **API key parameter name**: api_key
- **Location**: HTTP header

