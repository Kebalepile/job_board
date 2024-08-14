package minopex

import (
	"context"
	"fmt"
	"github.com/Kebalepile/job_board/pipeline"
	"github.com/Kebalepile/job_board/spiders/types"
	"github.com/chromedp/chromedp"
	"log"
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
		chromedp.Flag("headless", true), // set headless to true for production
		chromedp.UserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"),
		chromedp.WindowSize(768, 1024), // Tablet size
	)

	ctx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel()

	ctx, cancel = chromedp.NewContext(ctx)

	s.Shutdown = cancel

	log.Println("Loading ", s.Name)
	
	selector := `//*[@id="site-content"]/section[5]/div/div/div/div[1]/div[2]/div/p/a[1]`

	expression := fmt.Sprintf(`(() => {
			const element = document.evaluate('%s', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			
			if (element) {
				element.scrollIntoView({ behavior: "auto", block: "center" });
				return element.getAttribute("href");
			}
			return null;
		})()`, selector)

	var url string
	err := chromedp.Run(
		ctx,
		chromedp.Navigate(s.AllowedDomains[0]),
		chromedp.Sleep(5*time.Second),
		chromedp.Evaluate(`document.querySelector("link[rel='icon']").getAttribute('href')`, &s.Posts.IconLink),
		chromedp.Evaluate(expression, &url))
	s.error(err)

	// pipeline.DowloadIcon(s.Posts.IconLink, s.Name, ".png")

	s.Posts.IconLink = fmt.Sprintf("agency_icons/%s.png", s.Name)

	s.vacancies(ctx, url)
}

func (s *Spider) vacancies(ctx context.Context, url string) {
	log.Println("Searching for latest vacancies ", s.Name)

	selector := `/html/body/div[1]/div/div[2]/div[1]/div/div/div/div/div/a`

	expression := fmt.Sprintf(`(() => {
				const element = document.evaluate('%s', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			
				if (element) {
					element.scrollIntoView({ behavior: "auto", block: "center" });
					element.click();
				}

				let posts = Array.from(document.querySelectorAll('#companyVacanciesResultsContainer .job-section > .row'));
				return posts.map(p => {
					const data = {};
					const jobTitle = p.querySelector(".job-title a");

					if (jobTitle) {
						data.jobTitle = jobTitle.textContent.replace(/\s*\n\s*/g, "").trim();
					}
				
					const locationText = p.querySelector(".job-location.text-wrapper");

					if (locationText) {
						data.location = locationText.textContent
							.replace(/\s*\n\s*/g, "")
							.trim();
					}
				
					const publishedText = p.querySelector("div:nth-child(4)");

					if (publishedText) {
						data.publishedDate = publishedText.textContent
							.replace(/\s*\n\s*/g, "")
							.trim();
					}
				
					const closingText = p.querySelector("div:nth-child(5)");

					if (closingText) {
						data.expiryDate = closingText.textContent.replace(/\s*\n\s*/g, "").trim();
					}
				
					const jobLink = p.querySelector(".job-title a");

					if (jobLink) {
						data.apply = jobLink.href;
					}
					return data

				})
			})()`, selector)

	err := chromedp.Run(ctx,
		chromedp.Navigate(url),
		chromedp.Sleep(5*time.Second),
		chromedp.Evaluate(expression, &s.Posts.BlogPosts))
	s.error(err)

	if len(s.Posts.BlogPosts) > 0 {
		for i, p := range s.Posts.BlogPosts {
			p.IconLink = s.Posts.IconLink
			p.Uuid = pipeline.GenerateUuid()

			expression = fmt.Sprintf(`(() => {
				let details = document.evaluate("/html/body/div[1]/div/div[2]/div[2]/div/div[2]/div[3]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
				details.querySelector('a').href  = details.querySelector('a').href;
	
				return [
					document.evaluate("/html/body/div[1]/div/div[2]/div[2]/div/div[2]/div[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML,
					document.evaluate("/html/body/div[1]/div/div[2]/div[2]/div/div[2]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML,
					details.innerHTML
				];
			})()`)
			err = chromedp.Run(ctx,
				chromedp.Navigate(p.Apply),
				chromedp.Sleep(10*time.Second),
				chromedp.Evaluate(expression, &p.Details),
				chromedp.Evaluate(`document.evaluate("/html/body/div[1]/div/div[2]/div[2]/div/div[2]/div[3]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.querySelector("a").href;`, &p.Apply))
			s.error(err)
			s.Posts.BlogPosts[i] = p
			
			// Save after each job post is updated
			s.save()
		}
	} else {
		log.Println(s.Name, " sorry no job posts today.")
		s.close()
	}
}

func (s *Spider) save() {
	err := pipeline.MinopexFile(&s.Posts)
	s.error(err)
}

func (s *Spider) date() string {
	t := time.Now()
	return t.Format("02 January 2006")
}

// closes chromedp broswer instance
func (s *Spider) close() {
	log.Println(s.Name, "done scraping data.")
	
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
