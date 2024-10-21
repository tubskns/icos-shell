package cli

import (
	"context"
	openapi "shellclient/pkg/openapi"

	"github.com/spf13/viper"
)

func TrainMetrics(jsonFile []byte) {
	body := make(map[string]interface{})
	s := string(jsonFile)
	body["content"] = s

	token := viper.GetString("auth_token")
	metrics, resp, err := openapi.Client.TrainAPI.TrainMetrics(context.Background()).ApiKey(token).Body(body).Execute()
	printPrettyJSON(metrics, resp, err)

}

func PredictMetrics(jsonFile []byte) {
	body := make(map[string]interface{})
	s := string(jsonFile)
	body["content"] = s

	token := viper.GetString("auth_token")
	metrics, resp, err := openapi.Client.PredictAPI.PredictMetrics(context.Background()).ApiKey(token).Body(body).Execute()
	printPrettyJSON(metrics, resp, err)

}
