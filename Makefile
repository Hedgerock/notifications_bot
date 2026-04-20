include .env
export

.PHONY: shutdown turnUp restart

shutdown:
	@bash scripts/shutdown.sh
	@docker-compose down

turnUp:
	@docker-compose up --build -d
	@bash scripts/turnup.sh

restart: shutdown turnUp