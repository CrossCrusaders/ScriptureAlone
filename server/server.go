package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
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
	bibleApiKey := goDotEnvVariable("BIBLE_API_KEY")
	bibleBrainApiKey := goDotEnvVariable("BIBLE_BRAIN_API_KEY")
	log.Print(bibleApiKey)
	app := pocketbase.New()

	// Proxy to bible brain api
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method: http.MethodGet,
			Path:   "/api/bible-brain/:path",
			Handler: func(c echo.Context) error {

				path := c.PathParam("path")
				query := c.QueryString()
				url := "https://4.dbt.io/api/" + path

				if query != "" {
					url += "?" + query + "&key=" + bibleBrainApiKey
				} else {
					url += "?key=" + bibleBrainApiKey
				}

				log.Println(url)

				client := http.Client{}
				req, _ := http.NewRequest("GET", url, nil)
				req.Header = http.Header{
					"Content-Type": {"application/json"},
				}
				resp, err := client.Do(req)
				if err != nil {
					log.Fatal(err)
					return c.String(500, err.Error())
				}

				body, err := ioutil.ReadAll(resp.Body)

				if err != nil {
					log.Fatal(err)
					return c.String(500, err.Error())
				}

				return c.String(200, string(body))
			},
			Middlewares: []echo.MiddlewareFunc{},
		})

		return nil
	})

	//search
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		// add new "GET /api/hello" route to the app router (echo)
		e.Router.AddRoute(echo.Route{
			Method: http.MethodGet,
			Path:   "/api/bibles/search",
			Handler: func(c echo.Context) error {
				bibleId := c.QueryParam(`bible_id`)
				query := c.QueryParam(`q`)
				offset := c.QueryParam(`offset`)

				url := `https://api.scripture.api.bible/v1/bibles/` + bibleId + `/search` + `?query=` + url.QueryEscape(query)

				if offset != `` {
					url += `&offset=` + offset
				}

				client := http.Client{}
				req, _ := http.NewRequest("GET", url, nil)

				req.Header = http.Header{
					"api-key":      {bibleApiKey},
					"Content-Type": {"application/json"},
				}
				resp, err := client.Do(req)
				if err != nil {
					log.Fatal(err)
					return c.String(500, err.Error())
				}

				body, err := ioutil.ReadAll(resp.Body)

				if err != nil {
					log.Fatal(err)
					return c.String(500, err.Error())
				}

				return c.String(200, string(body))
			},
			Middlewares: []echo.MiddlewareFunc{},
		})

		return nil
	})

	// Bibles search
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method: http.MethodGet,
			Path:   "/api/bibles",
			Handler: func(c echo.Context) error {
				ids := c.QueryParam(`bible_id`)
				url := `https://api.scripture.api.bible/v1/bibles?language=eng`
				if ids != `` {
					url += `&ids=` + ids
				}

				client := http.Client{}
				req, _ := http.NewRequest("GET", url, nil)

				req.Header = http.Header{
					"api-key":      {bibleApiKey},
					"Content-Type": {"application/json"},
				}
				resp, _ := client.Do(req)

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

	// List books
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method: http.MethodGet,
			Path:   "/api/bibles/books",
			Handler: func(c echo.Context) error {
				bibleId := c.QueryParam(`bible_id`)
				bookId := c.QueryParam(`book_id`)

				url := `https://api.scripture.api.bible/v1/bibles/` + bibleId + `/books`

				if bookId != `` {
					url += `/` + bookId
				}
				url += `?include-chapters=true`
				log.Print(url)

				client := http.Client{}
				req, _ := http.NewRequest("GET", url, nil)

				req.Header = http.Header{
					"api-key":      {bibleApiKey},
					"Content-Type": {"application/json"},
				}
				resp, _ := client.Do(req)

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

	// Get specific chapter
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method: http.MethodGet,
			Path:   "/api/bibles/chapters",
			Handler: func(c echo.Context) error {
				bibleId := c.QueryParam(`bible_id`)
				chapterId := c.QueryParam(`chapter_id`)

				url := `https://api.scripture.api.bible/v1/bibles/` + bibleId + `/chapters`

				if chapterId != `` {
					url += `/` + chapterId
					url += `?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`
				}

				log.Print(url)

				client := http.Client{}
				req, _ := http.NewRequest("GET", url, nil)

				req.Header = http.Header{
					"api-key":      {bibleApiKey},
					"Content-Type": {"application/json"},
				}
				resp, _ := client.Do(req)

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

	// Get specific verse
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method: http.MethodGet,
			Path:   "/api/bibles/verses",
			Handler: func(c echo.Context) error {
				bibleId := c.QueryParam(`bible_id`)
				verseId := c.QueryParam(`verse_id`)

				url := `https://api.scripture.api.bible/v1/bibles/` + bibleId + `/verses`

				if verseId != `` {
					url += `/` + verseId
					url += `?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`
				}

				log.Print(url)

				client := http.Client{}
				req, _ := http.NewRequest("GET", url, nil)

				req.Header = http.Header{
					"api-key":      {bibleApiKey},
					"Content-Type": {"application/json"},
				}
				resp, _ := client.Do(req)

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

	// Get specific passages
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method: http.MethodGet,
			Path:   "/api/bibles/passages",
			Handler: func(c echo.Context) error {
				bibleId := c.QueryParam(`bible_id`)
				passageId := c.QueryParam(`passage_id`)

				url := `https://api.scripture.api.bible/v1/bibles/` + bibleId + `/passages/` + passageId + `?content-type=html&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false&use-org-id=false`

				log.Print(url)

				client := http.Client{}
				req, _ := http.NewRequest("GET", url, nil)

				req.Header = http.Header{
					"api-key":      {bibleApiKey},
					"Content-Type": {"application/json"},
				}
				resp, _ := client.Do(req)

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
