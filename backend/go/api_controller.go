// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

/*
 * ICOS Shell
 *
 * This is the ICOS Shell based on the OpenAPI 3.0 specification.
 *
 * API version: 1.0.11
 */

package shellbackend

import (
	"encoding/json"
	"net/http"
	"strings"
)

// ControllerAPIController binds http requests to an api service and writes the service results to the http response
type ControllerAPIController struct {
	service ControllerAPIServicer
	errorHandler ErrorHandler
}

// ControllerAPIOption for how the controller is set up.
type ControllerAPIOption func(*ControllerAPIController)

// WithControllerAPIErrorHandler inject ErrorHandler into controller
func WithControllerAPIErrorHandler(h ErrorHandler) ControllerAPIOption {
	return func(c *ControllerAPIController) {
		c.errorHandler = h
	}
}

// NewControllerAPIController creates a default api controller
func NewControllerAPIController(s ControllerAPIServicer, opts ...ControllerAPIOption) *ControllerAPIController {
	controller := &ControllerAPIController{
		service:      s,
		errorHandler: DefaultErrorHandler,
	}

	for _, opt := range opts {
		opt(controller)
	}

	return controller
}

// Routes returns all the api routes for the ControllerAPIController
func (c *ControllerAPIController) Routes() Routes {
	return Routes{
		"GetControllers": Route{
			strings.ToUpper("Get"),
			"/api/v3/controller/",
			c.GetControllers,
		},
		"AddController": Route{
			strings.ToUpper("Post"),
			"/api/v3/controller/",
			c.AddController,
		},
	}
}

// GetControllers - Returns a list of controllers
func (c *ControllerAPIController) GetControllers(w http.ResponseWriter, r *http.Request) {
	result, err := c.service.GetControllers(r.Context())
	// If an error occurred, encode the error with the status code
	if err != nil {
		c.errorHandler(w, r, err, &result)
		return
	}
	// If no error, encode the body and the result code
	_ = EncodeJSONResponse(result.Body, &result.Code, w)
}

// AddController - Adds a new controller
func (c *ControllerAPIController) AddController(w http.ResponseWriter, r *http.Request) {
	var controllerParam Controller
	d := json.NewDecoder(r.Body)
	d.DisallowUnknownFields()
	if err := d.Decode(&controllerParam); err != nil {
		c.errorHandler(w, r, &ParsingError{Err: err}, nil)
		return
	}
	if err := AssertControllerRequired(controllerParam); err != nil {
		c.errorHandler(w, r, err, nil)
		return
	}
	if err := AssertControllerConstraints(controllerParam); err != nil {
		c.errorHandler(w, r, err, nil)
		return
	}
	apiKeyParam := r.Header.Get("api_key")
	result, err := c.service.AddController(r.Context(), controllerParam, apiKeyParam)
	// If an error occurred, encode the error with the status code
	if err != nil {
		c.errorHandler(w, r, err, &result)
		return
	}
	// If no error, encode the body and the result code
	_ = EncodeJSONResponse(result.Body, &result.Code, w)
}
