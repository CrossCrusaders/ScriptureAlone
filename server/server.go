package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func goDotEnvVariable(key string) string {
	// load .env file
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file")
	}
	return os.Getenv(key)
}

func main() {
	val := goDotEnvVariable("BIBLE_API_KEY")
	log.Print(val)
	app := pocketbase.New()

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		// add new "GET /api/hello" route to the app router (echo)
		e.Router.AddRoute(echo.Route{
			Method: http.MethodGet,
			Path:   "/api/bible-search",
			Handler: func(c echo.Context) error {
				resp, err := http.Get(`https://randomuser.me/api/`)

				if err != nil {
					log.Fatal(`Error calling bible search api`)
					return c.String(500, err.Error())
				}

				body, err := ioutil.ReadAll(resp.Body)

				if err != nil {
					log.Fatal(`Error parsing bible search response`)
					return c.String(500, err.Error())
				}

				return c.String(200, string(body))
			},
			Middlewares: []echo.MiddlewareFunc{},
		})

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
