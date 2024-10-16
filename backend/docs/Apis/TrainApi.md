# TrainApi

All URIs are relative to *http://localhost:8080/api/v3*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**trainMetrics**](TrainApi.md#trainMetrics) | **POST** /metrics/train | Trains a model on a set of metrics |


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

