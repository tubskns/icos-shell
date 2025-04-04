/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"log"
	"os"

	"shellclient/pkg/cli"

	"github.com/spf13/cobra"
)

// deploymentCmd represents the deployment command
var metricsCmd = &cobra.Command{
	Use:   "metrics",
	Short: "Metrics",
	Long:  `Intelligence API metrics resource.`,
	Run: func(cmd *cobra.Command, args []string) {
		if cmd.Parent().Use == "train" {
			fileDescriptorString, _ := cmd.Flags().GetString("file")
			fileDescriptor, err := os.ReadFile(fileDescriptorString)
			if err != nil {
				log.Fatalf("error: %v", err)
			}
			cli.TrainMetrics(fileDescriptor)
		} else if cmd.Parent().Use == "get" {
			cli.GetMetrics()
		} else if cmd.Parent().Use == "predict" {
			fileDescriptorString, _ := cmd.Flags().GetString("file")
			fileDescriptor, err := os.ReadFile(fileDescriptorString)
			if err != nil {
				log.Fatalf("error: %v", err)
			}
			cli.PredictMetrics(fileDescriptor)
		} else if cmd.Parent().Use == "delete" {
			fileDescriptorString, _ := cmd.Flags().GetString("file")
			fileDescriptor, err := os.ReadFile(fileDescriptorString)
			if err != nil {
				log.Fatalf("error: %v", err)
			}
			cli.DeleteMetrics(fileDescriptor)
		}
	},
}

func init() {

	var predictMetricsCmd = *metricsCmd
	var trainMetricsCmd = *metricsCmd
	var getMetricsCmd = *metricsCmd
	var deleteMetricsCmd = *metricsCmd
	trainCmd.AddCommand(&trainMetricsCmd)
	predictCmd.AddCommand(&predictMetricsCmd)
	getCmd.AddCommand(&getMetricsCmd)
	deleteCmd.AddCommand(&deleteMetricsCmd)

	predictMetricsCmd.PersistentFlags().StringP("file", "", "", "ML Metrics descriptor json file")
	trainMetricsCmd.PersistentFlags().StringP("file", "", "", "ML Metrics descriptor json file")
	deleteMetricsCmd.PersistentFlags().StringP("file", "", "", "ML Metrics descriptor json file")

}
