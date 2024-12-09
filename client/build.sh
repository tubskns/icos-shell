rm pkg/openapi/go.*
docker build . -t shell-client --no-cache
docker create --name builder shell-client
docker cp builder:/shell-client ./
docker rm -f builder
