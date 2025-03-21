# MetricsApi

All URIs are relative to *http://localhost:8080/api/v3*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getMetrics**](MetricsApi.md#getMetrics) | **GET** /metrics/get | Returns a list of metric models |
| [**predictMetrics**](MetricsApi.md#predictMetrics) | **POST** /metrics/predict | Predict metrics development based on model and input metrics |
| [**trainMetrics**](MetricsApi.md#trainMetrics) | **POST** /metrics/train | Trains a model on a set of metrics |


<a name="getMetrics"></a>
# **getMetrics**
> List getMetrics(api\_key)

Returns a list of metric models

    Returns a list of metric models

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **api\_key** | **String**|  | [optional] [default to null] |

### Return type

[**List**](../Models/map.md)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="predictMetrics"></a>
# **predictMetrics**
> Map predictMetrics(body, api\_key)

Predict metrics development based on model and input metrics

    

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **body** | **Object**|  | |
| **api\_key** | **String**|  | [optional] [default to null] |

### Return type

[**Map**](../Models/AnyType.md)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="trainMetrics"></a>
# **trainMetrics**
> Map trainMetrics(body, api\_key)

Trains a model on a set of metrics

    

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **body** | **Object**|  | |
| **api\_key** | **String**|  | [optional] [default to null] |

### Return type

[**Map**](../Models/AnyType.md)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

