package main

import (
	"log"
	"net/http"
	"scripture-alone/server/bibleBrain"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)


func main() {
	var app = pocketbase.New()
	// ::::Register all server endpoints here::::
	// (https://pocketbase.io/docs/event-hooks/#app-hooks)

	// Proxy to bible brain api
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method: http.MethodGet,
			Path:   "/api/bible-brain/:path",
			Handler: bibleBrain.BibleBrainProxy,
			Middlewares: []echo.MiddlewareFunc{},
		})
		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
