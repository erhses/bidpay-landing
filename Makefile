# Deploys the same way as the BiD landing (bid-landing-front-new): build a linux/amd64 image here, save it to a
# tar, copy it to the server (into /home/cloudmn/bidpay/, next to the BiD landing's app/), then load and run it
# there.
#
#   make deploy       build and copy the image
#   make ssh-deploy   load and (re)start the container on the server
#   make full-deploy  all of the above

IMAGE_NAME ?= bidpay-landing
IMAGE_TAG ?= latest
PLATFORM ?= linux/amd64
TAR_FILE ?= ./$(IMAGE_NAME).tar
SERVER_USER ?= root
SERVER_HOST ?= 103.153.141.134
SERVER_PATH ?= /home/cloudmn/bidpay/
CONTAINER_NAME ?= bidpay-landing
# Taken on that server: 3001 bid-admin, 3003 bid-web (the BiD landing), 8086 landing-page-app.
HOST_PORT ?= 3004
CONTAINER_PORT ?= 3004

.PHONY: build save push deploy ssh-deploy full-deploy

build:
	docker build --platform $(PLATFORM) -t $(IMAGE_NAME):$(IMAGE_TAG) .

save:
	docker save -o $(TAR_FILE) $(IMAGE_NAME):$(IMAGE_TAG)

push: save
	ssh $(SERVER_USER)@$(SERVER_HOST) 'mkdir -p $(SERVER_PATH)'
	scp $(TAR_FILE) $(SERVER_USER)@$(SERVER_HOST):$(SERVER_PATH)

deploy: build push

ssh-deploy:
	ssh $(SERVER_USER)@$(SERVER_HOST) '\
	set -euo pipefail; \
	docker load -i $(SERVER_PATH)$(IMAGE_NAME).tar; \
	docker rm -f $(CONTAINER_NAME) 2>/dev/null || true; \
	docker run -d \
	  --name $(CONTAINER_NAME) \
	  --restart unless-stopped \
	  -p $(HOST_PORT):$(CONTAINER_PORT) \
	  $(IMAGE_NAME):$(IMAGE_TAG); \
	docker ps --filter "name=$(CONTAINER_NAME)"; \
	docker logs --tail 50 $(CONTAINER_NAME); \
	'

full-deploy: build push ssh-deploy
