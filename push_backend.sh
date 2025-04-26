#!/bin/bash

DOCKER_PASSWORD=$1

echo "$DOCKER_PASSWORD" | docker login --username tesztsorta --password-stdin && \
cd backend && \
docker build -f Dockerfile.prod -t tesztsorta/priv:training_portal_backend_v0_9_0 . && \
docker push tesztsorta/priv:training_portal_backend_v0_9_0 && \
cd ..
