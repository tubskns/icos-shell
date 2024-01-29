/*
ICOS Shell

Testing UserApiService

*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech);

package openapi

import (
	"context"
	"log"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"shellclient/cmd"
	"shellclient/pkg/cli"
	openapi "shellclient/pkg/openapi"

	"github.com/spf13/viper"
)

func Test_openapi_UserApiService(t *testing.T) {

	cmd.InitConfigForTesting()
	apiClient := openapi.Client

	t.Run("Test UserApiService LoginUser", func(t *testing.T) {

		// t.Skip("skip test") // remove to run test

		cli.LoginUser()
		// get the user credentials from the config_client.yml file
		viper.SetConfigFile("../../../config_client.yml") // Read the config file
		viper.AddConfigPath(".")                          // look for config in the working directory

		if err := viper.ReadInConfig(); err != nil {
			log.Fatalf("Error reading config file: %s", err)
		}
		username := viper.GetString("keycloak.user")
		password := viper.GetString("keycloak.pass")
		resp, httpRes, err := apiClient.UserAPI.LoginUser(context.Background()).Username(username).Password(password).Execute()

		require.Nil(t, err)
		require.NotNil(t, resp)
		assert.Equal(t, 200, httpRes.StatusCode)

	})

	t.Run("Test UserApiService LogoutUser", func(t *testing.T) {

		/*
			This functionality is not correctly implemented in the ICOS system and in the shell backend yet
		*/
		t.Skip("skip test") // remove to run test

		httpRes, err := apiClient.UserAPI.LogoutUser(context.Background()).Execute()

		require.Nil(t, err)
		assert.Equal(t, 200, httpRes.StatusCode)

	})

}
