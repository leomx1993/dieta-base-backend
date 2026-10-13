.PHONY: up down build rebuild migrate import setup

up:
	docker compose up -d

down:
	docker compose down --remove-orphans

build:
	docker compose build

rebuild:
	docker compose down --remove-orphans
	-docker rmi dieta-base-backend-dieta-base-backend
	docker builder prune -f
	docker compose build --no-cache
	docker compose up -d

migrate:
	npm run migration:run

import:
	npm run db:import

setup: up
	@until docker compose exec -T dieta-base-db pg_isready -U dieta >/dev/null 2>&1; do sleep 1; done
	$(MAKE) migrate
	$(MAKE) import
