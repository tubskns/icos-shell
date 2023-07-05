/*
ICOS Shell

Testing DeploymentApiService

*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech);

package shellclient

import (
	"context"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"testing"
	openapiclient "github.com/GIT_USER_ID/GIT_REPO_ID/shellclient"
)

func Test_shellclient_DeploymentApiService(t *testing.T) {

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)

	t.Run("Test DeploymentApiService CreateDeployment", func(t *testing.T) {

		t.Skip("skip test")  // remove to run test

		httpRes, err := apiClient.DeploymentApi.CreateDeployment(context.Background()).Execute()

		require.Nil(t, err)
		assert.Equal(t, 200, httpRes.StatusCode)

	})

	t.Run("Test DeploymentApiService DeleteDeploymentById", func(t *testing.T) {

		t.Skip("skip test")  // remove to run test

		var deploymentId int64

		httpRes, err := apiClient.DeploymentApi.DeleteDeploymentById(context.Background(), deploymentId).Execute()

		require.Nil(t, err)
		assert.Equal(t, 200, httpRes.StatusCode)

	})

	t.Run("Test DeploymentApiService GetDeploymentById", func(t *testing.T) {

		t.Skip("skip test")  // remove to run test

		var deploymentId int64

		resp, httpRes, err := apiClient.DeploymentApi.GetDeploymentById(context.Background(), deploymentId).Execute()

		require.Nil(t, err)
		require.NotNil(t, resp)
		assert.Equal(t, 200, httpRes.StatusCode)

	})

	t.Run("Test DeploymentApiService GetDeployments", func(t *testing.T) {

		t.Skip("skip test")  // remove to run test

		resp, httpRes, err := apiClient.DeploymentApi.GetDeployments(context.Background()).Execute()

		require.Nil(t, err)
		require.NotNil(t, resp)
		assert.Equal(t, 200, httpRes.StatusCode)

	})

	t.Run("Test DeploymentApiService UpdateDeployment", func(t *testing.T) {

		t.Skip("skip test")  // remove to run test

		var deploymentId int64

		httpRes, err := apiClient.DeploymentApi.UpdateDeployment(context.Background(), deploymentId).Execute()

		require.Nil(t, err)
		assert.Equal(t, 200, httpRes.StatusCode)

	})

}
