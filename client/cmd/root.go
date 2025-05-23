/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"
	"os"

	"shellclient/pkg/cli"
	"shellclient/pkg/openapi"

	"github.com/adrg/xdg"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var cfgFile string

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "icos-shell",
	Short: "icos-shell - CLI interface for ICOS",
	Long:  `icos-shell - a CLI tool to interface with ICOS components`,
	Run: func(cmd *cobra.Command, args []string) {
		if viper.GetString("controller") != "" {
			openapi.Init(viper.GetString("controller"))
			cli.GetHealthcheck()
		} else {
			if viper.GetString("lighthouse") != "" {
				fmt.Fprintln(os.Stdout, "Retrieving controllers from lighthouse...")
				openapi.Init(viper.GetString("lighthouse"))
				cli.GetController()
				fmt.Fprintln(os.Stderr, "Please, add a controller to the config file. Exiting.")
			} else {
				fmt.Fprintln(os.Stderr, "Lighthouse not defined")
			}
		}
	},
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	err := rootCmd.Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "There was an error while executing icos-shell '%s'", err)
		os.Exit(1)
	}
}

func init() {
	cobra.OnInitialize(initConfig)

	rootCmd.PersistentFlags().StringVar(&cfgFile, "config", xdg.ConfigHome+"/icos-shell/config.yaml", "config file")
	viper.BindEnv("controller", "CONTROLLER")
	viper.BindEnv("auth_token", "ICOS_AUTH_TOKEN")
}

// initConfig reads in config file and ENV variables if set.
func initConfig() {
	if cfgFile != "" {
		// Use config file from the flag.
		viper.SetConfigFile(cfgFile)
	} else {
		// Find home directory.
		home, err := os.UserHomeDir()
		cobra.CheckErr(err)

		// Search config in home directory with name ".client" (without extension).
		viper.AddConfigPath(home)
		viper.SetConfigType("yaml")
		viper.SetConfigName(".client")
	}

	viper.AutomaticEnv() // read in environment variables that match

	// If a config file is found, read it in.
	if err := viper.ReadInConfig(); err == nil {
		// fmt.Fprintln(os.Stdout, "Config:", viper.ConfigFileUsed())
	}

	// if controller not defined, ask for one to the lighthouse
	if viper.GetString("controller") == "" {
		fmt.Fprintln(os.Stderr, "Controller not defined, asking lighthouse for a controller...")
		openapi.Init(viper.GetString("lighthouse"))
		controller := cli.GetController()
		if controller != "" {
			viper.Set("controller", controller)
			if err := viper.WriteConfig(); err != nil {
				panic(fmt.Errorf("fatal error writing config file %s", err))
			} else {
				fmt.Fprintln(os.Stderr, "Controller added to the config file, you can try your command again")
			}
		} else {
			fmt.Fprintln(os.Stderr, "No controllers in the lighthouse either")
		}
		cli.CleanToken()
		// if controller defined, but no token, try authentication
	} else if viper.GetString("controller") != "" && viper.GetString("auth_token") == "" {
		fmt.Fprintln(os.Stderr, "Controller is defined, but no token found, trying to log in...")
		openapi.Init(viper.GetString("controller"))
		//		cli.LoginUser()
		cli.CleanToken()
	} else {
		// fmt.Fprintln(os.Stdout, "Controller:", viper.GetString("controller"))
		cli.CleanToken()
		openapi.Init(viper.GetString("controller"))
	}
}

// InitConfigForTesting is a function to initialize the configuration for testing.
func InitConfigForTesting() {
	initConfig()
}
