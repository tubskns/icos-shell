FROM golang:1.21 AS build

LABEL maintainer="Marc Michalke"

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download
COPY go ./go
COPY *.go ./
RUN mkdir -p /empty && CGO_ENABLED=0 GOOS=linux go build -o /shell-backend

FROM alpine:3
COPY --from=build /shell-backend /shell-backend

WORKDIR /app
COPY --from=build /empty /app

EXPOSE 8080
CMD ["/shell-backend"]

