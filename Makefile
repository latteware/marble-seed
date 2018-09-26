BIN_DIR ?= ./node_modules/.bin

help:
	@echo
	@echo "  \033[34mapi-server\033[0m  start dev server"

api-server:
	@$(BIN_DIR)/nodemon --ignore '*/frontend/**' api/runner.js

queue-server:
	@$(BIN_DIR)/nodemon api/queue-runner.js	

app-server:
	@$(BIN_DIR)/nodemon --ignore app/frontend app/runner.js

app-dist: export NODE_ENV = production
app-dist:
	@$(BIN_DIR)/webpack --config ./app/webpack/prod.config.js --progress

admin-server:
	@$(BIN_DIR)/nodemon --ignore admin/frontend admin/runner.js

admin-dist: export NODE_ENV = production
admin-dist:
	@$(BIN_DIR)/webpack --config ./admin/webpack/prod.config.js --progress	

dist: export NODE_ENV = production
dist:
	@$(BIN_DIR)/webpack --config ./admin/webpack/prod.config.js --progress && $(BIN_DIR)/webpack --config ./app/webpack/prod.config.js --progress

run-test:
	@$(BIN_DIR)/mocha