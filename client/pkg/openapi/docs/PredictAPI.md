# \PredictAPI

All URIs are relative to *http://localhost:8080/api/v3*

Method | HTTP request | Description
------------- | ------------- | -------------
[**PredictMetrics**](PredictAPI.md#PredictMetrics) | **Post** /metrics/predict | Predict metrics development based on model and input metrics



## PredictMetrics

> map[string]interface{} PredictMetrics(ctx).Body(body).ApiKey(apiKey).Execute()

Predict metrics development based on model and input metrics



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/icos-project/Shell/openapi"
)

func main() {
	body := map[string]interface{}{ ... } // map[string]interface{} | 
	apiKey := "apiKey_example" // string |  (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PredictAPI.PredictMetrics(context.Background()).Body(body).ApiKey(apiKey).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PredictAPI.PredictMetrics``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PredictMetrics`: map[string]interface{}
	fmt.Fprintf(os.Stdout, "Response from `PredictAPI.PredictMetrics`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiPredictMetricsRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | **map[string]interface{}** |  | 
 **apiKey** | **string** |  | 

### Return type

**map[string]interface{}**

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

