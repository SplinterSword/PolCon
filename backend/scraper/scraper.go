package scraper

import (
	"fmt"

	"github.com/PuerkitoBio/goquery"
	"github.com/geziyor/geziyor"
	"github.com/geziyor/geziyor/client"
	"github.com/geziyor/geziyor/export"
)

func frameData(g *geziyor.Geziyor, r *client.Response) {

	r.HTMLDoc.Find("div[data-testid='anchor-inner-wrapper']").Each(func(_ int, s *goquery.Selection) {
		anchor := s.Find("a")

		contents := anchor.Find("div.sc-4ea10043-0 jpnnjz")

		contents.Each(func(_ int, s *goquery.Selection) {
			title := s.Find("h2").Text()
			fmt.Println(title)
			//fmt.Println(paragraph)
		})

	})

}

func Scrape(name string) (string, error) {

	geziyor.NewGeziyor(&geziyor.Options{
		StartRequestsFunc: func(g *geziyor.Geziyor) {
			g.GetRendered("https://www.bbc.com/search?q=Donald%20Trump", g.Opt.ParseFunc)
		},
		ParseFunc: frameData,
		Exporters: []export.Exporter{&export.JSON{}},
		//BrowserEndpoint: "ws://localhost:3000",
	}).Start()

	return "", nil
}
