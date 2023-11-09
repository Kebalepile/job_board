package minopex

import (
	"context"
	"fmt"
	"github.com/Kebalepile/job_board/pipeline"
	"github.com/Kebalepile/job_board/spiders/types"
	// "github.com/chromedp/cdproto/cdp"
	"github.com/chromedp/chromedp"
	"log"
	// "strings"
	"sync"
	"time"
)

// Minopex package spider type
type Spider struct {
	Name           string
	AllowedDomains []string
	Shutdown       context.CancelFunc
	Posts          types.MinopexJobs
}

func (s *Spider) Launch(wg *sync.WaitGroup) {
	defer wg.Done()
	log.Println(s.Name, " spider has Lunched ", s.date())
	s.Posts.Title = s.Name

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

	selector := `//*[@id="post-319"]/div/div/section[6]/div/div/div/section/div/div[1]/div/div[2]/div/div/a`

	expression := fmt.Sprintf(`(() => {
			const element = document.evaluate('%s', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			
			if (element) {
				element.scrollIntoView({ behavior: "auto", block: "center" });
				return element.getAttribute("href");
			}
			return null;
		})()`, selector)

	var hrefValue string
	err := chromedp.Run(
		ctx,
		chromedp.Navigate(s.AllowedDomains[0]),
		chromedp.Sleep(5*time.Second),
		chromedp.Evaluate(`document.querySelector("link[rel='icon']").getAttribute('href')`, &s.Posts.IconLink),
		chromedp.Evaluate(expression, &hrefValue))
	s.error(err)

	log.Println(hrefValue)

	pipeline.DowloadIcon(s.Posts.IconLink, s.Name, ".png")
	s.Posts.IconLink = fmt.Sprintf("agency_icons/%s.jpg", s.Name)
	s.vacancies(ctx, hrefValue)
}
func (s *Spider) vacancies(ctx context.Context, url string) {
	selector := `/html/body/div[1]/div/div[2]/div[1]/div/div/div/div/div/a`

	expression := fmt.Sprintf(`(() => {
				const element = document.evaluate('%s', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			
				if (element) {
					element.scrollIntoView({ behavior: "auto", block: "center" });
					element.click();
				}

				let posts = document.querySelectorAll('#companyVacanciesResultsContainer .job-section > .row');
				return posts.map(p => {
					const data = {};
					const jobTitle = row.querySelector(".job-title a");

					if (jobTitle) {
						data.jobTitle = jobTitle.textContent.replace(/\s*\n\s*/g, "").trim();
					}
				
					const locationText = row.querySelector(".job-location.text-wrapper");

					if (locationText) {
						data.location = locationText.textContent
							.replace(/\s*\n\s*/g, "")
							.trim();
					}
				
					const publishedText = row.querySelector("div:nth-child(4)");

					if (publishedText) {
						data.publishedDate = publishedText.textContent
							.replace(/\s*\n\s*/g, "")
							.trim();
					}
				
					const closingText = row.querySelector("div:nth-child(5)");

					if (closingText) {
						data.expiryDate = closingText.textContent.replace(/\s*\n\s*/g, "").trim();
					}
				
					const jobLink = row.querySelector(".job-title a");

					if (jobLink) {
						data.apply = location.origin + jobLink.getAttribute("href");
					}
					return data

				})
			})()`, selector)

	err := chromedp.Run(ctx,
		chromedp.Navigate(url),
		chromedp.Sleep(5*time.Second),
		chromedp.Evaluate(expression, &s.Posts.BlogPosts))
	s.error(err)

	log.Println(s.Posts.BlogPosts)
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
