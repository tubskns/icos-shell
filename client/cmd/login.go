/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"shellclient/pkg/cli"

	"github.com/spf13/cobra"
)

// loginCmd represents the login command
var loginCmd = &cobra.Command{
	Use:   "login",
	Short: "Login command",
	Long:  `To login into ICOS.`,
	Run: func(cmd *cobra.Command, args []string) {
		var oneTimePad string
		if cmd.Flags().NFlag() == 0 {
			oneTimePad = ""
		} else {
			oneTimePad, _ = cmd.Flags().GetString("otp")
		}
		cli.LoginUser(oneTimePad)
	},
}

func init() {
	authCmd.AddCommand(loginCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	loginCmd.PersistentFlags().String("otp", "", "One Time Pad token in case user has 2FA enabled")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// loginCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
