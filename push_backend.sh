#!/bin/bash

cd backend && \
docker build -f Dockerfile.prod -t tesztsorta/priv:training_portal_backend_v0_9_1 . && \
docker push tesztsorta/priv:training_portal_backend_v0_9_1 && \
cd ..
