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
	"strings"

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
	yamlData := body["content"].(string)

	// timestamp := fmt.Sprint(int32(time.Now().Unix()))
	req, _ := http.NewRequestWithContext(ctx, http.MethodPost, viper.GetString("components.job_manager.server")+viper.GetString("components.job_manager.path_jobgroups"), strings.NewReader(yamlData))
	log.Printf("Sending a POST request to: " + viper.GetString("components.job_manager.server") + viper.GetString("components.job_manager.path_jobgroups"))
	fmt.Printf("Payload:\n%v\n", yamlData)

	req = addBearerToToken(ctx, apiKey, req)
	req.Header.Add("Content-Type", "application/x-yaml")
	client := &http.Client{}
	resp, err := client.Do(req)
	log.Printf("Response: ", resp)
	if err != nil {
		return errorConnect(resp, err)
	} else {
		return Response(resp.StatusCode, unmarshalResponse(resp)), nil
	}
}

// DeleteDeploymentById - Deletes a deployment
func (s *DeploymentAPIService) DeleteDeploymentById(ctx context.Context, deploymentId string, apiKey string) (ImplResponse, error) {
	req, _ := http.NewRequestWithContext(ctx, http.MethodDelete, viper.GetString("components.job_manager.server")+viper.GetString("components.job_manager.path_jobgroups")+"/"+deploymentId, nil)
	log.Printf("Sending a DELETE request to: " + viper.GetString("components.job_manager.server") + viper.GetString("components.job_manager.path_jobgroups") + "/" + deploymentId)
	req = addBearerToToken(ctx, apiKey, req)
	client := &http.Client{}
	resp, err := client.Do(req)
	log.Printf("Response: ", resp)
	if err != nil {
		return errorConnect(resp, err)
	} else {
		return Response(resp.StatusCode, unmarshalResponse(resp)), nil
	}
}

// SartDeploymentByID - Starts existing resources related to a deployment
func (s *DeploymentAPIService) StartDeploymentById(ctx context.Context, deploymentId string, apiKey string) (ImplResponse, error) {
	req, _ := http.NewRequestWithContext(ctx, http.MethodPut, viper.GetString("components.job_manager.server")+viper.GetString("components.job_manager.path_jobgroups")+"/start/"+deploymentId, nil)
	log.Printf("Sending a PUT request to: " + viper.GetString("components.job_manager.server") + viper.GetString("components.job_manager.path_jobgroups") + "/start/" + deploymentId)
	req = addBearerToToken(ctx, apiKey, req)
	client := &http.Client{}
	resp, err := client.Do(req)
	log.Printf("Response: ", resp)
	if err != nil {
		return errorConnect(resp, err)
	} else {
		return Response(resp.StatusCode, unmarshalResponse(resp)), nil
	}
}

// StopDeploymentByID - Removes all existing resources related to a deployment
func (s *DeploymentAPIService) StopDeploymentById(ctx context.Context, deploymentId string, apiKey string) (ImplResponse, error) {
	req, _ := http.NewRequestWithContext(ctx, http.MethodPut, viper.GetString("components.job_manager.server")+viper.GetString("components.job_manager.path_jobgroups")+"/stop/"+deploymentId, nil)
	log.Printf("Sending a PUT request to: " + viper.GetString("components.job_manager.server") + viper.GetString("components.job_manager.path_jobgroups") + "/stop/" + deploymentId)
	req = addBearerToToken(ctx, apiKey, req)
	client := &http.Client{}
	resp, err := client.Do(req)
	log.Printf("Response: ", resp)
	if err != nil {
		return errorConnect(resp, err)
	} else {
		return Response(resp.StatusCode, unmarshalResponse(resp)), nil
	}
}

// GetDeploymentById - Find deployment by ID
func (s *DeploymentAPIService) GetDeploymentById(ctx context.Context, deploymentId string, apiKey string) (ImplResponse, error) {
	req, _ := http.NewRequestWithContext(ctx, http.MethodGet, viper.GetString("components.job_manager.server")+viper.GetString("components.job_manager.path_jobgroups")+"/"+deploymentId, nil)
	log.Printf("Sending a GET request to: " + viper.GetString("components.job_manager.server") + viper.GetString("components.job_manager.path_jobgroups") + "/" + deploymentId)
	req = addBearerToToken(ctx, apiKey, req)
	client := &http.Client{}
	resp, err := client.Do(req)
	log.Printf("Response: ", resp)
	if err != nil {
		return errorConnect(resp, err)
	} else {
		return Response(resp.StatusCode, unmarshalResponse(resp)), nil
	}
}

// GetDeployments - Returns a list of deployments
func (s *DeploymentAPIService) GetDeployments(ctx context.Context, apiKey string) (ImplResponse, error) {
	req, _ := http.NewRequestWithContext(ctx, http.MethodGet, viper.GetString("components.job_manager.server")+viper.GetString("components.job_manager.path_jobgroups"), nil)
	// req, _ := http.NewRequestWithContext(ctx, http.MethodGet, viper.GetString("components.job_manager.server")+"/jobmanager/jobs", nil)
	log.Printf("Sending a GET request to: " + viper.GetString("components.job_manager.server") + viper.GetString("components.job_manager.path_jobgroups"))
	req = addBearerToToken(ctx, apiKey, req)
	client := &http.Client{}
	resp, err := client.Do(req)
	log.Printf("Response: ", resp)
	if err != nil {
		return errorConnect(resp, err)
	} else {
		return Response(resp.StatusCode, unmarshalArrayResponse(resp)), nil
	}
}

// UpdateDeployment - Updates a deployment
func (s *DeploymentAPIService) UpdateDeployment(ctx context.Context, deploymentId string, body map[string]interface{}, apiKey string) (ImplResponse, error) {
	jsonData, _ := json.Marshal(body)
	req, _ := http.NewRequestWithContext(ctx, http.MethodPut, viper.GetString("components.job_manager.server")+viper.GetString("components.job_manager.path_jobgroups")+"/"+deploymentId, bytes.NewBuffer(jsonData))
	log.Printf("Sending a PUT request to: " + viper.GetString("components.job_manager.server") + viper.GetString("components.job_manager.path_jobgroups") + "/" + deploymentId)
	req = addBearerToToken(ctx, apiKey, req)
	client := &http.Client{}
	resp, err := client.Do(req)
	log.Printf("Response: ", resp)
	if err != nil {
		return errorConnect(resp, err)
	} else {
		return Response(resp.StatusCode, unmarshalResponse(resp)), nil
	}
}
