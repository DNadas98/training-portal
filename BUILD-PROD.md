### Build and push to DockerHub
```Bash
docker login
```
```Bash
cd backend && \
docker build -f Dockerfile.prod -t dnadas98/priv:training_portal_backend . && \
docker push dnadas98/priv:training_portal_backend && \
cd ..
```
```Bash
cd frontend && \
docker build -f Dockerfile.prod -t dnadas98/priv:training_portal_frontend . && \
docker push dnadas98/priv:training_portal_frontend && \
cd ..
```