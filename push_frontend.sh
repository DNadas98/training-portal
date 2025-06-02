#!/bin/bash

cd frontend && \
docker build -f Dockerfile.prod -t tesztsorta/priv:training_portal_frontend_v0_9_1 . && \
docker push tesztsorta/priv:training_portal_frontend_v0_9_1 && \
cd ..
