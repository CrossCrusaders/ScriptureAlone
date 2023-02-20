package bibleBrain

import (
	"io/ioutil"
	"log"
	"net/http"
	"scripture-alone/server/env"

	"github.com/labstack/echo/v5"
)


var BibleBrainApiKey = env.GetEnvVariable("BIBLE_BRAIN_API_KEY")

func BibleBrainProxy(c echo.Context) error {

	
	log.Print(BibleBrainApiKey)
	path := c.PathParam("path")
	query := c.QueryString()
	url := "https://4.dbt.io/api/" + path

	if query != "" {
		url += "?" + query + "&key=" + BibleBrainApiKey
	} else {
		url += "?key=" + BibleBrainApiKey
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
}