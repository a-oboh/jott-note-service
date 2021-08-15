docker-cp-up:
	docker-compose up -d
docker-cp-build:
	docker-compose build
docker-cp-up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
docker-cp-up-test:
	docker-compose -f docker-compose.yml -f docker-compose.test.yml up
docker-cp-down: 
	docker-compose down