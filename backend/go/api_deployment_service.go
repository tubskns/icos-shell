/*
 * ICOS Shell
 *
 * This is the ICOS Shell based on the OpenAPI 3.0 specification.
 *
 * API version: 1.0.11
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package shellbackend

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/spf13/viper"
)

// DeploymentAPIService is a service that implements the logic for the DeploymentAPIServicer
// This service should implement the business logic for every endpoint for the DeploymentAPI API.
// Include any external packages or services that will be required by this service.
type DeploymentAPIService struct {
}

// NewDeploymentAPIService creates a default api service
func NewDeploymentAPIService() DeploymentAPIServicer {
	return &DeploymentAPIService{}
}

// CreateDeployment - Creates a new deployment
func (s *DeploymentAPIService) CreateDeployment(ctx context.Context, body map[string]interface{}, apiKey string) (ImplResponse, error) {
	jsonData, _ := json.Marshal(body)
	timestamp := fmt.Sprint(int32(time.Now().Unix()))
	req, _ := http.NewRequestWithContext(ctx, http.MethodPost, viper.GetString("components.job_manager.server")+viper.GetString("components.job_manager.path_jobs_create")+"/"+timestamp, bytes.NewBuffer(jsonData))
	log.Printf("Sending a POST request to: "viper.GetString("components.job_manager.server")+viper.GetString("components.job_manager.path_jobs_create")+"/"+timestamp)
	req = addBearerToToken(ctx, apiKey, req)
	req.Header.Add("Content-Type", "application/json")
	client := &http.Client{}
	resp, err := client.Do(req)
	log.Printf("Response: ", resp)
	if err != nil {
		return errorConnect(resp, err)
	} else {
		if resp.StatusCode == 201 {
			return Response(resp.StatusCode, unmarshalResponse(resp)), nil
		} else {
			return unexpectedCode(resp.StatusCode)
		}
	}
}

// DeleteDeploymentById - Deletes a deployment
func (s *DeploymentAPIService) DeleteDeploymentById(ctx context.Context, deploymentId string, apiKey string) (ImplResponse, error) {
	req, _ := http.NewRequestWithContext(ctx, http.MethodDelete, viper.GetString("components.job_manager.server")+viper.GetString("components.job_manager.path_jobs")+"/"+deploymentId, nil)
	log.Printf("Sending a DELETE request to: "viper.GetString("components.job_manager.server")+viper.GetString("components.job_manager.path_jobs")+"/"+deploymentId)
	req = addBearerToToken(ctx, apiKey, req)
	client := &http.Client{}
	resp, err := client.Do(req)
	log.Printf("Response: ", resp)
	if err != nil {
		return errorConnect(resp, err)
	} else {
		if resp.StatusCode == 200 {
			return Response(resp.StatusCode, unmarshalResponse(resp)), nil
		} else {
			return unexpectedCode(resp.StatusCode)
		}
	}
}

// GetDeploymentById - Find deployment by ID
func (s *DeploymentAPIService) GetDeploymentById(ctx context.Context, deploymentId string, apiKey string) (ImplResponse, error) {
	req, _ := http.NewRequestWithContext(ctx, http.MethodGet, viper.GetString("components.job_manager.server")+viper.GetString("components.job_manager.path_jobs")+"/"+deploymentId, nil)
	log.Printf("Sending a GET request to: "viper.GetString("components.job_manager.server")+viper.GetString("components.job_manager.path_jobs")+"/"+deploymentId)
	req = addBearerToToken(ctx, apiKey, req)
	client := &http.Client{}
	resp, err := client.Do(req)
	log.Printf("Response: ", resp)
	if err != nil {
		return errorConnect(resp, err)
	} else {
		if resp.StatusCode == 200 {
			return Response(resp.StatusCode, unmarshalResponse(resp)), nil
		} else {
			return unexpectedCode(resp.StatusCode)
		}
	}
}

// GetDeployments - Returns a list of deployments
func (s *DeploymentAPIService) GetDeployments(ctx context.Context, apiKey string) (ImplResponse, error) {
//	req, _ := http.NewRequestWithContext(ctx, http.MethodGet, viper.GetString("components.job_manager.server")+viper.GetString("components.job_manager.path_jobs"), nil)
	req, _ := http.NewRequestWithContext(ctx, http.MethodGet, viper.GetString("components.job_manager.server")+"/jobmanager/jobs", nil)
	log.Printf("Sending a GET request to: "viper.GetString("components.job_manager.server")+"/jobmanager/jobs")
	req = addBearerToToken(ctx, apiKey, req)
	client := &http.Client{}
	resp, err := client.Do(req)
	log.Printf("Response: ", resp)
	if err != nil {
		return errorConnect(resp, err)
	} else {
		if resp.StatusCode == 200 {
			return Response(resp.StatusCode, unmarshalArrayResponse(resp)), nil
		} else {
			return unexpectedCode(resp.StatusCode)
		}
	}
}

// UpdateDeployment - Updates a deployment
func (s *DeploymentAPIService) UpdateDeployment(ctx context.Context, deploymentId string, body map[string]interface{}, apiKey string) (ImplResponse, error) {
	jsonData, _ := json.Marshal(body)
	req, _ := http.NewRequestWithContext(ctx, http.MethodPut, viper.GetString("components.job_manager.server")+viper.GetString("components.job_manager.path_jobs")+"/"+deploymentId, bytes.NewBuffer(jsonData))
	log.Printf("Sending a POST request to: "viper.GetString("components.job_manager.server")+viper.GetString("components.job_manager.path_jobs")+"/"+deploymentId)
	req = addBearerToToken(ctx, apiKey, req)
	client := &http.Client{}
	resp, err := client.Do(req)
	log.Printf("Response: ", resp)
	if err != nil {
		return errorConnect(resp, err)
	} else {
		if resp.StatusCode == 200 {
			return Response(resp.StatusCode, unmarshalResponse(resp)), nil
		} else {
			return unexpectedCode(resp.StatusCode)
		}
	}
}
