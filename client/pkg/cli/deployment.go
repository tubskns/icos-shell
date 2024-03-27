package cli

import (
	"context"
	"fmt"
	"os"
	openapi "shellclient/pkg/openapi"

	"github.com/spf13/viper"
	"gopkg.in/yaml.v3"
)

func CreateDeployment(yamlFile []byte) {
	body := make(map[string]interface{})
	//We need this now to maintain the original data structures between all interfaces while still
	//complying with the jobManager interface. If we marshal/unmarshal the yaml input, we have
	//difficulties keeping the file separators since they get removed. Therefore, we treat the input
	//as a string until we send it from the backend.
	s := string(yamlFile)
	body["content"] = s

	token := viper.GetString("auth_token")
	deployment, resp, err := openapi.Client.DeploymentAPI.CreateDeployment(context.Background()).ApiKey(token).Body(body).Execute()
	printPrettyJSON(deployment, resp, err)

}

func UpdateDeployment(id string, yamlFile []byte) {
	body := make(map[string]interface{})
	err := yaml.Unmarshal(yamlFile, &body)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error unmarshaling YAML: %v", err)
	}
	token := viper.GetString("auth_token")
	deployment, resp, err := openapi.Client.DeploymentAPI.UpdateDeployment(context.Background(), id).ApiKey(token).Body(body).Execute()
	printPrettyJSON(deployment, resp, err)
}

func GetDeployment() {
	token := viper.GetString("auth_token")
	deployments, resp, err := openapi.Client.DeploymentAPI.GetDeployments(context.Background()).ApiKey(token).Execute()
	printArrayPrettyJSON(deployments, resp, err)
}

func GetDeploymentById(id string) {
	token := viper.GetString("auth_token")
	deployment, resp, err := openapi.Client.DeploymentAPI.GetDeploymentById(context.Background(), id).ApiKey(token).Execute()
	printPrettyJSON(deployment, resp, err)
}

func DeleteDeployment(id string) {
	token := viper.GetString("auth_token")
	deployment, resp, err := openapi.Client.DeploymentAPI.DeleteDeploymentById(context.Background(), id).ApiKey(token).Execute()
	printPrettyJSON(deployment, resp, err)
}
