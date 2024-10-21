#!/bin/bash

BLUE='\033[0;34m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
RED='\033[0;31m'
NO_COLOR='\033[0m'

function log {
    msg="$2"
    component="$3"
    if [[ $1 == "INFO" ]]; then
        printf "${BLUE}INFO:${NO_COLOR} %s %s \n" "$component" "$msg"
    elif [[ $1 == "DONE" ]]; then
        printf "${GREEN}SUCCESS:${NO_COLOR} %s %s \n" "$component" "$msg"
    elif [[ $1 == "WARN" ]]; then
        printf "${ORANGE}WARNING:${NO_COLOR} %s %s \n" "$component" "$msg"
    else
        printf "${RED}FAILED:${NO_COLOR} %s %s \n" "$component" "$msg"
    fi
}

go build -o ./icos-shell

# Login to keycloak
COMPONENTS="[shell-backend --> keycloak]"
RESPONSE=$(./icos-shell --config=config_client.yml auth login 2> /dev/null)
if [ "$RESPONSE" != "" ]; then
  log "DONE" "Token returned successfully" "$COMPONENTS"
else
  log "FAIL" "failed to retrieve the token" "$COMPONENTS"
fi

# Add controller to lighthouse
COMPONENTS="[lighthouse --> keycloak]"
RESPONSE=$(./icos-shell --config=config_client.yml add controller -a 127.0.0.1 -n helloworld_controller 2> /dev/null)
if [[ $RESPONSE == "201" ]]; then
    log "DONE" "Controller added to the lighthouse successfully" "$COMPONENTS"
elif [[ $RESPONSE == "202" ]]; then
    log "INFO" "Controller already exists in the lighthouse (reset timeout)" "$COMPONENTS"
else
    log "FAIL" "Error while trying to add a controller to the lighthouse" "$COMPONENTS"
fi

# Get controllers from lighthouse
COMPONENTS="[lighthouse]"
RESPONSE=$(./icos-shell --config=config_client.yml get controller 2> /dev/null) 
if [ "$RESPONSE" != ""  ]; then
    log "DONE" "Controllers retrieved successfully" "$COMPONENTS"
else
    log "FAIL" "Error while retrieving controllers" "$COMPONENTS"
fi

# healthcheck shell-backend from controller
COMPONENTS="[shell-backend]"
RESPONSE=$(./icos-shell --config=config_client.yml 2> /dev/null)
if [[ $RESPONSE == "200" ]]; then
    log "DONE" "Healthcheck to the shell-backend was successful" "$COMPONENTS"
else
    log "FAIL" "Error while trying healthcheck to the shell-backend" "$COMPONENTS"
fi

# Create deployment
COMPONENTS="[shell-backend --> job-manager]"
{
    IFS=$'\n' read -r -d '' CAPTURED_STDERR;
    IFS=$'\n' read -r -d '' CAPTURED_STDOUT;
} < <((printf '\0%s\0' "$(./icos-shell --config=config_client.yml create deployment --file app_descriptor_example.yaml)" 1>&2) 2>&1)
JOBID=$(echo "$CAPTURED_STDERR" | jq -r ".ID")

if [[ $CAPTURED_STDOUT == "201" ]]; then
    log "DONE" "Deployment [$JOBID] added to the controller successfully" "$COMPONENTS"
elif [[ $RESPONSE == "202" ]]; then
    log "INFO" "Deployment already exists in the controller" "$COMPONENTS"
elif [[ $RESPONSE == "200" ]]; then
    log "WARN" "Wrong response code from the controller" "$COMPONENTS"
else
    log "FAIL" "Error while trying to add a deployment to the controller" "$COMPONENTS"
fi
sleep 30

# Get deployments
COMPONENTS="[shell-backend --> job-manager]"
RESPONSE=$(./icos-shell --config=config_client.yml get deployment 2> /dev/null)
if [[ $RESPONSE ]]; then
    log "DONE" "Deployments retrieved successfully" "$COMPONENTS"
else
    log "FAIL" "Error while retrieving deployments" "$COMPONENTS"
fi
sleep 3

# Get specific deployment
COMPONENTS="[shell-backend --> job-manager]"
end=$((SECONDS+60))
while true; do
    RESPONSE=$(./icos-shell --config=config_client.yml get deployment --id $JOBID 2> /dev/null)

    if [[ -n $RESPONSE ]]; then
        log "DONE" "Specific deployment retrieved successfully" "$COMPONENTS"
        break
    fi

    if (( SECONDS >= end )); then
        log "FAIL" "Error while retrieving specific deployment" "$COMPONENTS"
        break
    fi
  sleep 5
done

# Start deployment
COMPONENTS="[shell-backend --> job-manager]"
RESPONSE=$(./icos-shell --config=config_client.yml start deployment --id $JOBID 2> /dev/null)
if [[ $RESPONSE ]]; then
    log "DONE" "Deployment started successfully" "$COMPONENTS"
else
    log "FAIL" "Error while starting deployment" "$COMPONENTS"
fi
sleep 5

# Stop deployment
COMPONENTS="[shell-backend --> job-manager]"
end=$((SECONDS+60))
while true; do
    RESPONSE=$(./icos-shell --config=config_client.yml stop deployment --id $JOBID 2> /dev/null)

    if [[ -n $RESPONSE ]]; then
        log "DONE" "Deployment stopped successfully" "$COMPONENTS"
        break
    fi

    if (( SECONDS >= end )); then
        log "FAIL" "Error while stopping deployment" "$COMPONENTS"
        break
    fi
  sleep 5
done
sleep 5

# Delete deployment
COMPONENTS="[shell-backend --> job-manager]"
RESPONSE=$(./icos-shell --config=config_client.yml delete deployment --id $JOBID 2> /dev/null)
if [[ $RESPONSE ]]; then
    log "DONE" "Deployment deleted successfully" "$COMPONENTS"
else
    log "FAIL" "Error while deleting deployments" "$COMPONENTS"
fi

# Get resources
COMPONENTS="[shell-backend --> aggregator]"
RESPONSE=$(./icos-shell --config=config_client.yml get resource 2> /dev/null)
if [[ $RESPONSE ]]; then
    log "DONE" "Resources retrieved successfully" "$COMPONENTS"
else
    log "FAIL" "Error while retrieving resources" "$COMPONENTS"
fi
