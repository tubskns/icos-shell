# PredictApi

All URIs are relative to *http://localhost:8080/api/v3*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**predictMetrics**](PredictApi.md#predictMetrics) | **POST** /metrics/predict | Predict metrics development based on model and input metrics |


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

