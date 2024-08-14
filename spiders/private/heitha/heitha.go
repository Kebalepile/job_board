package heitha

import (
	"context"
	"fmt"
	"github.com/Kebalepile/job_board/pipeline"
	"github.com/Kebalepile/job_board/spiders/types"
	"github.com/chromedp/chromedp"
	"log"
	"strconv"
	"strings"
	"sync"
	"time"
)

// Heitha package spider type
type Spider struct {
	Name           string
	AllowedDomains []string
	Shutdown       context.CancelFunc
	Posts          types.HeithaJobs
}

// initiate the Spider instant
// Configers chromedp options such as headless flag userAgent & window size
// Creates Navigates to the allowed domain to crawl
func (s *Spider) Launch(wg *sync.WaitGroup) {
	defer wg.Done()

	log.Println(s.Name, " spider has Lunched ", s.Date())
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

	selector := `.col-xs-2.all-jobs-btn`
	err := chromedp.Run(ctx,
		chromedp.Navigate(s.AllowedDomains[0]),
		chromedp.WaitVisible(selector),
		chromedp.ScrollIntoView(selector),
		chromedp.Click(selector))
	s.Error(err)

	s.Robala(10)

	selector = `.col-sm-9.items`
	var url string

	err = chromedp.Run(ctx,
		chromedp.Evaluate(`document.querySelector("link[rel='icon']").getAttribute('href')`, &s.Posts.IconLink),
		chromedp.ScrollIntoView(selector),
		chromedp.Location(&url))
	s.Error(err)

	// pipeline.DowloadIcon(s.Posts.IconLink, s.Name, ".png")

	s.Posts.IconLink = fmt.Sprintf("agency_icons/%s.png", s.Name)

	if n := strings.Compare(url, s.AllowedDomains[1]); n == 0 {
		log.Println("Searching for latest vacancies ", s.Name)

		s.jobs(ctx)
	}
}

// scrapes availabe job posts on loaded page url
// adds them to Posts.BlogPosts slice
// once done save the information to a *.json file
func (s *Spider) jobs(ctx context.Context, url ...string) {

	// log.Println("Crawling site")

	if len(url) > 0 {
		err := chromedp.Run(ctx,
			chromedp.Navigate(url[0]))
		s.Error(err)
	}

	posts := s.posts(ctx)
	
	s.Posts.BlogPosts = append(s.Posts.BlogPosts, posts...)

	// Save after each set of job posts is appended
	s.save()

	var pageNum string

	err := chromedp.Run(ctx,
		chromedp.ScrollIntoView(`.pagination`),
		chromedp.Text(`.active`, &pageNum))
	s.Error(err)

	pageNum = strings.Trim(pageNum, " ")

	n, err := strconv.Atoi(pageNum)
	if err != nil {
		s.Error(err)
	}

	if n >= 10 {
		s.close()
	} else {

		expression := fmt.Sprintf(`document.querySelector(".active").nextElementSibling.querySelector("a").getAttribute("href")`)
		var nextPage string

		err = chromedp.Run(ctx,
			chromedp.Evaluate(expression, &nextPage))
		s.Error(err)
		// pause for 10s
		s.Robala(6)
		s.jobs(ctx, nextPage)
	}
}

// Retrives Job post info needed to compile a job post information card
// and url to application page for each job post
func (s *Spider) posts(ctx context.Context) []types.JobPost {
	
	var posts []types.JobPost

	expression := fmt.Sprintf(`Array.from(document.querySelectorAll(".col-sm-9.items > a")).map(a => {
		
		const apply = location.href.replace("jobs","") + a.getAttribute("href");
		const jobTitle = a.querySelector(".job-title").textContent;
		const jobSpecFields = a.querySelector(".industry-title").textContent;
		const details = a.querySelector(".bullets").textContent.replace(/\n/g, '').trim(" ");
		
		const exp = a.querySelectorAll(".expiry-date");
		const province = exp[1].textContent;
		const expiryDate = exp[0].textContent;
		

		return {
			apply,
			jobTitle,
			jobSpecFields,
			details,
			province,
			expiryDate,
			iconLink: "%s"
		      }
		 })`, s.Posts.IconLink)

	err := chromedp.Run(ctx,
		chromedp.Evaluate(expression, &posts))
	s.Error(err)
	
	for i, post := range  posts {

     post.Uuid =  pipeline.GenerateUuid()
	 posts[i] = post
	}

	return posts
}

func (s *Spider) save() {
	err := pipeline.HeithaFile(&s.Posts)
	s.Error(err)
}

func (s *Spider) Date() string {
	t := time.Now()
	return t.Format("02 January 2006")
}

// closes chromedp broswer instance
func (s *Spider) close() {
	log.Println(s.Name, "done scraping data.")
	
	s.Shutdown()
}

func (s *Spider) Error(err error) {
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
func (s *Spider) Robala(second int) {
	time.Sleep(time.Duration(second) * time.Second)
}

// phase 2
// 1. for the a tag href retrived in phase 1 section 5 naviage to the href
// 2. get job content div with class ".col-sm-8.job-content"
// 3. get the latter divs innerHTML
// 4. save along side phase 1 content
// 5. do this for all other a tags
