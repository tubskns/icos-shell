/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

// createCmd represents the create command
var trainCmd = &cobra.Command{
	Use:   "train",
	Short: "Train a model",
	Long:  `Trains a model on data provided by dataclay through the Intelligence API.`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Error: must also supply a json file")
	},
}

func init() {
	rootCmd.AddCommand(trainCmd)
}
