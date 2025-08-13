package cli

import (
	"context"
	"fmt"
	"os"

	openapi "shellclient/pkg/openapi"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/spf13/viper"
)

// AddController adds a new controller to the system
func AddController(name string, address string) {
	controller := *openapi.NewController(name, address)
	token := viper.GetString("auth_token")
	resp, err := openapi.Client.ControllerAPI.AddController(context.Background()).ApiKey(token).Controller(controller).Execute()
	printResponseSimple(resp, err)
}

// ControllerModel defines the Bubble Tea model for controller selection
type ControllerModel struct {
	controllers []openapi.Controller
	selected    int
	quitting    bool
}

// Init initializes the model
func (m ControllerModel) Init() tea.Cmd {
	return nil
}

// Update handles messages and updates the model
func (m ControllerModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "up":
			if m.selected > 0 {
				m.selected--
			}
		case "down":
			if m.selected < len(m.controllers)-1 {
				m.selected++
			}
		case "enter":
			return m, tea.Quit // Exit with selected index
		case "esc":
			m.quitting = true
			return m, tea.Quit
		}
	}
	return m, nil
}

// View renders the view
func (m ControllerModel) View() string {
	if m.quitting {
		return ""
	}
	s := "Available controllers:\n\n"
	for i, controller := range m.controllers {
		cursor := " " // no cursor
		if i == m.selected {
			cursor = ">" // cursor
		}
		s += fmt.Sprintf("%s %s (%s)\n", cursor, controller.Name, controller.Address)
	}
	s += "\nUse arrow keys to navigate, Enter to select, Esc to cancel."
	return s
}

// GetController retrieves and selects a controller
func GetController() string {
	controllers, resp, err := openapi.Client.ControllerAPI.GetControllers(context.Background()).Execute()
	if err != nil {
		fmt.Fprintln(os.Stderr, "Error fetching controllers:", err)
		return ""
	}

	if resp.StatusCode == 200 && len(controllers) > 0 {
		// Start Bubble Tea program
		model := ControllerModel{controllers: controllers}
		program := tea.NewProgram(model)
		if finalModel, err := program.Run(); err == nil {
			// Cast to ControllerModel
			if model, ok := finalModel.(ControllerModel); ok && !model.quitting {
				selectedController := controllers[model.selected]

				// Save the selected controller to the config file
				viper.Set("controller", selectedController.Address)
				if err := viper.WriteConfig(); err != nil {
					fmt.Fprintln(os.Stderr, "Error writing to config file:", err)
				}

				fmt.Printf("\nController selected: %s (%s)\n",
					selectedController.Name, selectedController.Address)
				return selectedController.Address
			}
		} else {
			fmt.Fprintln(os.Stderr, "Error running controller selection:", err)
		}
	} else if resp.StatusCode == 204 {
		// No controllers found
		fmt.Fprintln(os.Stderr, "No controllers found.")
	} else {
		// Unexpected status code
		fmt.Fprintln(os.Stderr, "Unexpected response code:", resp.StatusCode)
	}
	return ""
}
