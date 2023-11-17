package govpage

import (
	"context"
	"errors"
	"github.com/Kebalepile/job_board/pipeline"
	"github.com/Kebalepile/job_board/spiders/types"
	"github.com/chromedp/cdproto/cdp"
	"github.com/chromedp/chromedp"
	"log"
	"strings"
	"sync"
	"time"
)

// Govpage package spider type
type Spider struct {
	Name           string
	AllowedDomains []string
	Shutdown       context.CancelFunc
}

// initiate the Spider instant
// Configers chromedp options such as headless flag userAgent & window size
// Creates Navigates to the allowed domain to crawl
func (s *Spider) Launch(wg *sync.WaitGroup) {
	defer wg.Done()

	log.Println(s.Name, " spider has Lunched ", s.Date())

	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("headless", false), // set headless to true for production
		chromedp.UserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"),
		chromedp.WindowSize(768, 1024), // Tablet size
	)

	ctx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel()

	ctx, cancel = chromedp.NewContext(ctx)

	s.Shutdown = cancel

	err := chromedp.Run(ctx,
		chromedp.Navigate(s.AllowedDomains[0]),
	)
	s.Error(err)

	var nodes []*cdp.Node

	err = chromedp.Run(ctx,
		chromedp.Click(`*[aria-label='Menu']`),
		chromedp.Nodes(`ul li.wsite-menu-item-wrap a.wsite-menu-item`, &nodes, chromedp.ByQueryAll))
	s.Error(err)

	for _, n := range nodes {
		var (
			text string
			url  string
		)
		err = chromedp.Run(ctx,
			chromedp.TextContent(n.FullXPath(), &text),
			chromedp.Location(&url))
		s.Error(err)
		if match := strings.Contains(strings.ToLower(text), "govpage"); match {
			href := n.AttributeValue("href")
			// remove first '/' from href as url ends with '/'
			govUpdates := url + href[1:]

			selector := `.blog-title-link`

			log.Println("Loading government updates page")

			err = chromedp.Run(ctx,
				chromedp.Navigate(govUpdates),
				chromedp.WaitEnabled(selector),
				chromedp.ScrollIntoView(selector),
				chromedp.Location(&url))

			s.Error(err)
			if n := strings.Compare(url, s.AllowedDomains[1]); n == 0 {
				s.vacancies(ctx, selector)
			}
			break
		}

	}
	s.Close()
}

// crawels for availabe job posts on loaded page url
func (s *Spider) vacancies(ctx context.Context, selector string) {
	log.Println("Searching for latest government vacancies.")

	var nodes []*cdp.Node

	err := chromedp.Run(ctx,
		chromedp.Nodes(selector, &nodes, chromedp.ByQueryAll))
	s.Error(err)

	var govpageLinks types.Links

	if len(nodes) > 0 {

		for _, d := range nodes {
			var text string
			err = chromedp.Run(ctx,
				chromedp.TextContent(d.FullXPath(), &text))
			s.Error(err)

			title := strings.ToLower(text)

			if yes := strings.Contains(title, strings.ToLower(s.Date())); yes {

				govpageLinks = types.Links{
					Title:       strings.Trim(title, " "),
					Departments: map[string]string{}}

				href := d.AttributeValue("href")
				url := "https://" + href[2:]
				s.links(ctx, url, &govpageLinks)

			}
		}

	} else {
		log.Println("Sorry, No Government Job Posts for today")
	}

}

// Scrapes job post links for the current day
func (s *Spider) links(ctx context.Context, url string, govpageLinks *types.Links) {
	log.Println("Searching For Advert Post Links")

	selector := `[id^='blog-post-'] a`

	err := chromedp.Run(ctx,
		chromedp.Navigate(url),
		chromedp.WaitEnabled(selector, chromedp.ByQueryAll),
		chromedp.ScrollIntoView(selector))
	s.Error(err)

	s.Robala(20) // pause for 20 seconds

	var nodes []*cdp.Node
	err = chromedp.Run(ctx,
		chromedp.Nodes(selector, &nodes, chromedp.ByQueryAll))
	s.Error(err)

	log.Println(s.Name, "Found some posts, the number of posts detected is:", len(nodes)-1)

	if len(nodes) > 0 {

		for _, n := range nodes {
			var text string
			href := n.AttributeValue("href")

			err := chromedp.Run(ctx, chromedp.TextContent(n.FullXPath(), &text))
			s.Error(err)
			isPrivateSectorOpportunities := strings.Contains(strings.ToLower(text), strings.ToLower("PRIVATE SECTOR OPPORTUNITIES"))
			isCurrentDate := strings.Contains(strings.ToLower(strings.Trim(strings.ReplaceAll(text, "\n", ""), " ")), strings.ToLower(s.Date()))
			if !isPrivateSectorOpportunities && !isCurrentDate {
				govpageLinks.Departments[text] = href
			}
		}

		for _, v := range govpageLinks.Departments {

			blogPost, err := s.postContent(ctx, v)
			if err != nil {
				s.Error(err)
				return
			}
			log.Println(blogPost.Title)
			govpageLinks.BlogPosts = append(govpageLinks.BlogPosts, *blogPost)

		}
		err = pipeline.GovPageFile(govpageLinks)
		if err != nil {
			s.Error(err)
		}
		s.Close()

	}

}

// Get the content of the given url
func (s *Spider) postContent(ctx context.Context, url string) (*types.BlogPost, error) {

	selector := `.blog-post`

	var nodes []*cdp.Node

	err := chromedp.Run(ctx,
		chromedp.Navigate(url),
		chromedp.Sleep(5*time.Second),
		chromedp.WaitVisible(selector, chromedp.ByQueryAll),
		chromedp.ScrollIntoView(selector),
		chromedp.Nodes(`.blog-title-link.blog-link`, &nodes))

	s.Error(err)

	if len(nodes) > 0 {

		n := nodes[0]

		var title, date string
		href := n.AttributeValue("href")

		err = chromedp.Run(ctx,
			chromedp.TextContent(n.FullXPath(), &title),
			chromedp.TextContent(`.blog-date > .date-text`, &date))
		s.Error(err)

		blogPost := types.BlogPost{
			Href:       href,
			Title:      title,
			PostedDate: date,
		}

		err = chromedp.Run(ctx,
			chromedp.Nodes(`.blog-content > .paragraph`, &nodes))
		s.Error(err)

		if len(nodes) > 0 {

			for _, n := range nodes {

				var text string

				err := chromedp.Run(ctx,
					chromedp.TextContent(n.FullXPath(), &text))
				s.Error(err)

				blogPost.Content = append(blogPost.Content, text)

			}

		} else {
			expression := `
			(() => {
				const src = Array.from(document.getElementsByTagName('iframe')).filter(f =>{
    
					if (f.src.includes("drive.google")){
						return f
					}
					
				}).map(f => f.src);
				return src[0];
			})()`

			var src string
			err := chromedp.Run(ctx,
				chromedp.Evaluate(expression, &src))

			s.Error(err)
			log.Println(src)
			if len(src) > 0 {
				blogPost.Iframe = src
			}

		}

		return &blogPost, nil

	}
	return nil, errors.New("no blog post found")
}
func (s *Spider) Date() string {
	// t := time.Now()
	// return t.Format("02 January 2006")
	return time.Now().AddDate(0,0,-1).Format("02 January 2006")
}

// closes chromedp broswer instance
func (s *Spider) Close() {
	log.Println(s.Name, "is done.")
	s.Shutdown()
}
func (s *Spider) Error(err error) {
	if err != nil {
		log.Println("*************************************")
		log.Println("Error from: ", s.Name, " spider")
		log.Fatal(err)
		log.Println("*************************************")
	}
}

// pauses spider for given duration
func (s *Spider) Robala(second int) {
	time.Sleep(time.Duration(second) * time.Second)
}
