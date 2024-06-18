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
	s.Posts.Title = s.Name

	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("headless", true), // set headless to true for production
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
		chromedp.Sleep(20*time.Second))

	s.error(err)

	s.login(ctx)
}

// login into the SA-Youth site.
func (s *Spider) login(ctx context.Context) {
	log.Println(s.Name, " loading login page...")

	variables := s.env()
	// document.querySelector("#toggle-navbar-menu")
	navigateToLoginPage := fmt.Sprintf(`
			const loginSaYouth = () => {
				const button = document.querySelector("#toggle-navbar-menu");
			
				if (button) {
					button.click();
					setTimeout(() => {
						const login = document.querySelector("#navbar-menu > div > div > div > ul > li:nth-child(3) > a");
			
						if (login) {
							login.click();
						} else {
							retryLogin();
						}
					}, 500); // Delay to allow DOM updates
				} else {
					const login = document.querySelector("body > div > div.container.menu-footer > div > div > h4:nth-child(2) > a");
			
					if (login) {
						login.scrollIntoView({ behavior: "auto", block: "center" });
						login.click();
					} else {
						retryLogin();
					}
				}
			};
			
			const retryLogin = () => {
				loginSaYouth();	
			};
			
			loginSaYouth();		
		`)

	loginToSAYouthAcc := fmt.Sprintf(`
		const loginButton = document.querySelector("#Navbar_bottom > yth-stack > yth-button:nth-child(2)").shadowRoot.querySelector("button");
		if (loginButton) {
			loginButton.scrollIntoView({ behavior: "auto", block: "center" });
			loginButton.click();
		} else {
			console.error("Login button not found.");
		}
	`)
	err := chromedp.Run(ctx,
		chromedp.Sleep(20*time.Second),
		chromedp.WaitVisible("#toggle-navbar-menu"),
		// Click the menu button then click the login href button
		chromedp.EvaluateAsDevTools(navigateToLoginPage, nil),
		// Working with form input type of text & password
		chromedp.SetValue("#Username", variables["A"], chromedp.ByID),
		chromedp.SetValue("#myPassword", variables["B"], chromedp.ByID),
		chromedp.Sleep(10*time.Second),
		chromedp.EvaluateAsDevTools(loginToSAYouthAcc, nil),
	)

	if err != nil {
		s.error(err)
	}

	log.Println("Entering login details")

	s.jobPosts(ctx)
}

// searches for job posts.
func (s *Spider) jobPosts(ctx context.Context) {
	log.Println(s.Name, "login successful !!!")

	jsExpression := fmt.Sprintf(`
		const searchButton = document.querySelector("body > div > div.page-wrapper.flex-grow-1.hpt-0.has-nav-tab > nav > div > ul > li:nth-child(2) > a");
		searchButton.scrollIntoView({ behavior: "auto", block: "center" });
		searchButton.click();
	 `)
	// css seector for the app navigation bar
	selector := ".app-nav"
	// download site icon image & naviaege to job search page
	err := chromedp.Run(ctx,
		chromedp.Sleep(20*time.Second),
		chromedp.WaitVisible(selector),
		chromedp.Evaluate(`document.querySelector("link[rel='icon']").href;`, &s.Posts.IconLink),
		chromedp.EvaluateAsDevTools(jsExpression, nil))
	s.error(err)

	// pipeline.DowloadIcon(s.Posts.IconLink, s.Name, ".png")
	s.Posts.IconLink = fmt.Sprintf("agency_icons/%s.png", s.Name)
	log.Println(s.Name, " loading site")

	// once in the search page code below clikcs the search button & a list of job posts should appear.
	// then it starts scrapping
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
	log.Println(s.Name, " searching for job posts")
	s.crawl(ctx)
}

// scrape data of each job ppost on the site.
func (s *Spider) crawl(ctx context.Context) {

	log.Println(s.Name, "scraping job posts")

	n := 1
	for n < 2 {
		posts := s.Posts.BlogPosts
		s.Posts.BlogPosts = append(posts, s.pagination(ctx)...)

		jsExpression := fmt.Sprintf(`(( ) => {
			let i = Array.from(document.querySelectorAll(".pagination > .page-item"));
			
			i = i[i.length - 1];
			i.querySelector(".page-link").click();
			
			return i.classList.length;
		})()`)

		err := chromedp.Run(ctx,
			chromedp.Sleep(10*time.Second),
			chromedp.Evaluate(jsExpression, &n))
		s.error(err)

	}
	// get more info for each job post
	for i, p := range s.Posts.BlogPosts {

		jsExpression := fmt.Sprintf(`(() => {

			const removeElement = (selector) => {
				const card = document.querySelector(".card-detail");
				if (card) {

					const elem = card.querySelector(selector);
					if (elem){
						elem.remove();
					}
				}
				
			};

			removeElement(".card-detail-cta.opportunity");
			removeElement("div.row.hmt-5");

			const card = document.querySelector(".card-detail");
			if (card){
				return card.innerHTML;
			}else{
				return "<h2>The opportunity that you are looking for is closed</h1>";
			}
			
		})()`)

		err := chromedp.Run(ctx,
			chromedp.Navigate(p.Apply),
			chromedp.Sleep(10*time.Second),
			chromedp.Evaluate(jsExpression, &p.Details))
		s.error(err)

		s.Posts.BlogPosts[i] = p
	}

	s.save()
}

// get all job post components & scrape needed data from them
func (s *Spider) pagination(ctx context.Context) (posts []types.SaYouthPost) {

	jsExpression := fmt.Sprintf(`(() => {

		const element = document.querySelector(".pagination");

		if(element){
			element.scrollIntoView({ behavior: "auto", block: "center" });
		}

		const posts = Array.from(document.querySelectorAll(".CardsContainer > .card.card-blue"));

		return posts.map(p =>{
			const data  = {
				iconLink:"%s",
				summary:  p.querySelector('.opportunity').innerHTML,
				apply: p.querySelector("#btnReadMoreSearch").shadowRoot.querySelector("a").href
			};
			
			return data;
		});
	})()`, s.Posts.IconLink)

	err := chromedp.Run(ctx,
		chromedp.Sleep(10*time.Second),
		chromedp.Evaluate(jsExpression, &posts))
	s.error(err)

	for i, post := range posts {

		post.Uuid = pipeline.GenerateUuid()
		posts[i] = post
	}
	return posts
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
