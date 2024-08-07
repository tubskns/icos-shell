/*
ICOS Shell

This is the ICOS Shell based on the OpenAPI 3.0 specification.

API version: 1.0.11
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package openapi

import (
	"encoding/json"
	"bytes"
	"fmt"
)

// checks if the Deployment type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &Deployment{}

// Deployment struct for Deployment
type Deployment struct {
	// Unique identifier of the deployment
	Id int64 `json:"id"`
	// Name of the deployment
	Name *string `json:"name,omitempty"`
	// Status of the deployment
	Status *string `json:"status,omitempty"`
}

type _Deployment Deployment

// NewDeployment instantiates a new Deployment object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewDeployment(id int64) *Deployment {
	this := Deployment{}
	this.Id = id
	return &this
}

// NewDeploymentWithDefaults instantiates a new Deployment object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewDeploymentWithDefaults() *Deployment {
	this := Deployment{}
	return &this
}

// GetId returns the Id field value
func (o *Deployment) GetId() int64 {
	if o == nil {
		var ret int64
		return ret
	}

	return o.Id
}

// GetIdOk returns a tuple with the Id field value
// and a boolean to check if the value has been set.
func (o *Deployment) GetIdOk() (*int64, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Id, true
}

// SetId sets field value
func (o *Deployment) SetId(v int64) {
	o.Id = v
}

// GetName returns the Name field value if set, zero value otherwise.
func (o *Deployment) GetName() string {
	if o == nil || IsNil(o.Name) {
		var ret string
		return ret
	}
	return *o.Name
}

// GetNameOk returns a tuple with the Name field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *Deployment) GetNameOk() (*string, bool) {
	if o == nil || IsNil(o.Name) {
		return nil, false
	}
	return o.Name, true
}

// HasName returns a boolean if a field has been set.
func (o *Deployment) HasName() bool {
	if o != nil && !IsNil(o.Name) {
		return true
	}

	return false
}

// SetName gets a reference to the given string and assigns it to the Name field.
func (o *Deployment) SetName(v string) {
	o.Name = &v
}

// GetStatus returns the Status field value if set, zero value otherwise.
func (o *Deployment) GetStatus() string {
	if o == nil || IsNil(o.Status) {
		var ret string
		return ret
	}
	return *o.Status
}

// GetStatusOk returns a tuple with the Status field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *Deployment) GetStatusOk() (*string, bool) {
	if o == nil || IsNil(o.Status) {
		return nil, false
	}
	return o.Status, true
}

// HasStatus returns a boolean if a field has been set.
func (o *Deployment) HasStatus() bool {
	if o != nil && !IsNil(o.Status) {
		return true
	}

	return false
}

// SetStatus gets a reference to the given string and assigns it to the Status field.
func (o *Deployment) SetStatus(v string) {
	o.Status = &v
}

func (o Deployment) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o Deployment) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	toSerialize["id"] = o.Id
	if !IsNil(o.Name) {
		toSerialize["name"] = o.Name
	}
	if !IsNil(o.Status) {
		toSerialize["status"] = o.Status
	}
	return toSerialize, nil
}

func (o *Deployment) UnmarshalJSON(data []byte) (err error) {
	// This validates that all required properties are included in the JSON object
	// by unmarshalling the object into a generic map with string keys and checking
	// that every required field exists as a key in the generic map.
	requiredProperties := []string{
		"id",
	}

	allProperties := make(map[string]interface{})

	err = json.Unmarshal(data, &allProperties)

	if err != nil {
		return err;
	}

	for _, requiredProperty := range(requiredProperties) {
		if _, exists := allProperties[requiredProperty]; !exists {
			return fmt.Errorf("no value given for required property %v", requiredProperty)
		}
	}

	varDeployment := _Deployment{}

	decoder := json.NewDecoder(bytes.NewReader(data))
	decoder.DisallowUnknownFields()
	err = decoder.Decode(&varDeployment)

	if err != nil {
		return err
	}

	*o = Deployment(varDeployment)

	return err
}

type NullableDeployment struct {
	value *Deployment
	isSet bool
}

func (v NullableDeployment) Get() *Deployment {
	return v.value
}

func (v *NullableDeployment) Set(val *Deployment) {
	v.value = val
	v.isSet = true
}

func (v NullableDeployment) IsSet() bool {
	return v.isSet
}

func (v *NullableDeployment) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableDeployment(val *Deployment) *NullableDeployment {
	return &NullableDeployment{value: val, isSet: true}
}

func (v NullableDeployment) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableDeployment) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


