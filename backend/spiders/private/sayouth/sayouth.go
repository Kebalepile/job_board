package sayouth

import (
	"context"
	"fmt"
	"github.com/Kebalepile/job_board/pipeline"
	"log"
	"sync"
	"time"

	"github.com/Kebalepile/job_board/spiders/types"
	"github.com/chromedp/cdproto/cdp"
	"github.com/chromedp/chromedp"
	"github.com/joho/godotenv"
)

type Spider struct {
	Name           string
	AllowedDomains []string
	Shutdown       context.CancelFunc
	Posts          types.SaYouthJobs
}

func (s *Spider) Launch(wg *sync.WaitGroup) {

	defer wg.Done()
	log.Println(s.Name, " spider has Lunched ", s.date())
	// s.Posts.Title = s.Name

	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("headless", false), // set headless to true for production
		chromedp.UserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"),
		chromedp.WindowSize(768, 1024), // Tablet size
	)

	ctx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel()

	ctx, cancel = chromedp.NewContext(ctx)

	s.Shutdown = cancel

	log.Println("Loading ", s.Name)

	var nodes []*cdp.Node

	continueElement := "body > div > div > div.container > div:nth-child(2) > div > p:nth-child(3) > a"
	loginElement := "#btnLogin"
	err := chromedp.Run(ctx,
		chromedp.Navigate(s.AllowedDomains[0]),
		chromedp.Sleep(1*time.Minute),
		chromedp.Nodes(continueElement, &nodes, chromedp.ByQuery, chromedp.AtLeast(0)),
		chromedp.ActionFunc(func(ctx context.Context) error {
			if len(nodes) > 0 {
				return chromedp.Click(continueElement).Do(ctx)
			}
			return nil
		}),
		chromedp.Sleep(20*time.Second),
		chromedp.WaitVisible(loginElement),
		chromedp.ScrollIntoView(loginElement),
		chromedp.Click(loginElement))

	s.error(err)

	s.login(ctx)
}

// login into the SA-Youth site.
func (s *Spider) login(ctx context.Context) {
	log.Println(s.Name, " entering login details.")

	variables := s.env()

	err := chromedp.Run(ctx,
		chromedp.Sleep(20*time.Second),
		// working with form input type of text & password
		chromedp.SetValue("#Username", variables["A"], chromedp.ByID),
		chromedp.SetValue("#myPassword", variables["B"], chromedp.ByID),
		chromedp.Sleep(10*time.Second),
		chromedp.EvaluateAsDevTools(`
			const button = document.querySelector("#loginForm > yth-button-group > yth-button-legacy:nth-child(2)").shadowRoot.querySelector("button");
			button.scrollIntoView({ behavior: "auto", block: "center" });
			button.click();
		`, nil))
	s.error(err)

	log.Println(s.Name, " Login successful")

	s.jobPosts(ctx)
}

// searches for job posts.
func (s *Spider) jobPosts(ctx context.Context) {
	log.Println(s.Name, " loading site")

	selector := "#btnSearchMoreJobs"
	jsExpression := fmt.Sprintf(`
		const moreButton = document.querySelector("%s").shadowRoot.querySelector("a");
		moreButton.scrollIntoView({ behavior: "auto", block: "center" });
		moreButton.click();
	`, selector)
	// download site icon image
	err := chromedp.Run(ctx,
		chromedp.Sleep(20*time.Second),
		chromedp.Evaluate(`document.querySelector("link[rel='icon']").href;`, &s.Posts.IconLink),
		chromedp.WaitVisible(selector),
		chromedp.EvaluateAsDevTools(jsExpression, nil))
	s.error(err)

	pipeline.DowloadIcon(s.Posts.IconLink, s.Name, ".png")
	s.Posts.IconLink = fmt.Sprintf("agency_icons/%s.png", s.Name)

	log.Println(s.Name, " searching for job posts")

	selector = "#btnJobsSearch"
	jsExpression = fmt.Sprintf(`
		const searchButton = document.querySelector("%s").shadowRoot.querySelector("button");
		searchButton.scrollIntoView({ behavior: "auto", block: "center" });
		searchButton.click();
	`, selector)
	err = chromedp.Run(ctx,
		chromedp.Sleep(20*time.Second),
		chromedp.WaitVisible(selector),
		chromedp.EvaluateAsDevTools(jsExpression, nil))
	s.error(err)
	s.crawl(ctx)
}

// scrape data of each job ppost on the site.
func (s *Spider) crawl(ctx context.Context) {

	log.Println(s.Name, " scraping job posts")
	jsExpression := fmt.Sprintf(`(() => {

		document.querySelector(".pagination").scrollIntoView({ behavior: "auto", block: "center" });

		const posts = Array.from(document.querySelectorAll(".CardsContainer > .card.card-blue"));
		
		return posts.map(p =>{
			const data  = {
				iconLink:"%s",
				summary:  p.querySelector('.opportunity').innerHTML,
				apply: p.querySelector("#btnReadMoreSearch").shadowRoot.querySelector("a").href
			};
			// test code below, if it fails just store the href for later.
			p.querySelector("#btnReadMoreSearch").shadowRoot.querySelector("a").click();
			document.querySelector(".card-detail-cta.opportunity > options-dropdown").remove();
			document.querySelector("div.row.hmt-5").remove();
			data.details = document.querySelector(".card-details").innerHTML;
			//  test code above, if it fails just store the href for later.
			return data;
		})
	})()`, s.Posts.IconLink)

	var posts []types.SaYouthPost
	err := chromedp.Run(ctx,
		chromedp.Evaluate(jsExpression, &posts))
	s.error(err)

	log.Println(posts)

	for i, p := range posts {

		jsExpression = fmt.Sprintf(`(() => {
			document.querySelector(".card-detail-cta.opportunity > options-dropdown").remove();
			document.querySelector("div.row.hmt-5").remove();
			data.details = document.querySelector(".card-details").innerHTML;
		})()`)

		err := chromedp.Run(ctx,
			chromedp.Navigate(p.Apply),
			chromedp.Sleep(5*time.Second),
			chromedp.Evaluate(jsExpression, &p.Details))
		s.error(err)
		posts[i] = p
	}

	log.Println(posts)

	s.Posts.BlogPosts = posts
	s.save()
}
func (s *Spider) save() {
	err := pipeline.SaYouthFile(&s.Posts)
	s.error(err)
	s.close()
}

// Read .env variables to be used.
func (s *Spider) env() map[string]string {

	variables, err := godotenv.Read()
	if err != nil {
		panic(err)
	}

	return variables

}

func (s *Spider) date() string {
	t := time.Now()
	return t.Format("02 January 2006")
}

// closes chromedp broswer instance
func (s *Spider) close() {

	log.Println(s.Name, "is done.")
	s.Shutdown()
}

func (s *Spider) error(err error) {

	if err != nil {
		log.Println("*************************************")
		log.Println("Error from: ", s.Name, " spider")
		log.Println(err.Error())
		log.Println("Please restart scrapper")
		log.Println("*************************************")
		log.Fatal(err)

	}
}

// pauses spider for given duration
func (s *Spider) robala(second int) {
	time.Sleep(time.Duration(second) * time.Second)
}
