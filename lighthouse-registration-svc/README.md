# Controller-Lighthouse registration service
This service runs as a sidecar to the shell backend and periodically refreshes the controller's address entry. It needs to be supplied with a set of environment variables to run:

```
CLIENTID=<id of the client configured in keycloak>
SECRET=<secret for client id>
REALM=<realm configured in keycloak>
PASSWORD=<password for the keycloak user>
USER=<keycloak user>
KEYCLOAK=https://<keycloak address.tld>
LIGHTHOUSE=http://<lighthouse address>/api/v3
ADV_ADDRESS=<controller address to advertise, including port>
ADV_NAME=<controller name to advertise>
```
