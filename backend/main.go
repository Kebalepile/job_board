package main

import (
	// "github.com/Kebalepile/job_board/spiders/private/heitha"
	"github.com/Kebalepile/job_board/spiders/private/minopex"
	"github.com/Kebalepile/job_board/spiders/private/propersonnel"
	"github.com/Kebalepile/job_board/spiders/private/sayouth"
	"github.com/Kebalepile/job_board/spiders/types"
	"log"
	"sync"
)

func main() {
	log.Println("Job Board Scrapper Initiated ")

	minopexSpider := minopex.Spider{
		Name: "minopex",
		AllowedDomains: []string{
			"https://minopex.com/",
			"https://minopex.simplify.hr/",
		},
	}
	// heithaSpider := heitha.Spider{
	// 	Name: "heitha-stuffing-group",
	// 	AllowedDomains: []string{
	// 		"http://www.heitha.co.za/",
	// 		"http://www.heitha.co.za/jobs",
	// 	},
	// }

	propersonnelSpider := propersonnel.Spider{
		Name: "pro-personnel",
		AllowedDomains: []string{
			"https://www.pro-personnel.co.za/",
			"https://www.pro-personnel.co.za/vacancies/",
		},
	}
	sayouthSpider := sayouth.Spider{
		Name: "SA-Youth",
		AllowedDomains: []string{
			"https://sayouth.mobi/Home/Index/EN",
		},
	}

	goFuncs := []types.Crawler{
		
		&propersonnelSpider,
		&sayouthSpider,
		&minopexSpider,
		// &heithaSpider,
	}

	var wg sync.WaitGroup
	for _, f := range goFuncs {
		wg.Add(1)
		go f.Launch(&wg)
	}
	wg.Wait()
}
