package cli

import (
	"context"
	"fmt"
	"os"

	openapi "shellclient/pkg/openapi"

	"github.com/spf13/viper"
)

func LoginUser(otp string) {
	token, resp, err := openapi.Client.UserAPI.LoginUser(context.Background()).Username(viper.GetString("keycloak.user")).Password(viper.GetString("keycloak.pass")).Otp(otp).Execute()
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		if resp != nil {
			fmt.Fprintln(os.Stderr, resp.Body)
		}
	} else {
		if resp.StatusCode == 200 {
			if token != "" {
				fmt.Printf("ICOS_AUTH_TOKEN=%s\n", token)
				viper.Set("auth_token", token)
				if err := viper.WriteConfig(); err != nil {
					panic(fmt.Errorf("fatal error writing config file %s", err))
				} else {
					fmt.Fprintln(os.Stderr, "Token received and added to the config file")
				}
			} else {
				fmt.Fprintln(os.Stderr, "Token received is empty")
			}
		} else {
			fmt.Fprintln(os.Stderr, "Wrong status code received")
		}
	}
}
