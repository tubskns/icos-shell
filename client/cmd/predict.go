/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

// createCmd represents the create command
var predictCmd = &cobra.Command{
	Use:   "predict",
	Short: "Predicts development of values",
	Long:  `Predicts values based on supplied data.`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Error: must also specify a resource")
	},
}

func init() {
	rootCmd.AddCommand(predictCmd)
}
