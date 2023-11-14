package sayouth

// go to https://sayouth.mobi/Home/Index/EN
//selector := "#btnLogin"
// scroll slector element into view and click it
// username := "#Username"
// password := "#myPassword"
// fill the log in form username & password
// login := "#loginForm > yth-button-group > yth-button-legacy:nth-child(2)"
// scroll login button into view and click it
import (
	// "fmt"
	// "github.com/Kebalepile/job_board/pipeline"
	"context"
	"github.com/Kebalepile/job_board/spiders/types"
	"github.com/chromedp/chromedp"
	"github.com/joho/godotenv"
	"log"
	"sync"
	"time"
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

	continueElement := "body > div > div > div.container > div:nth-child(2) > div > p:nth-child(3) > a"
	loginElement := "#btnLogin"

	err := chromedp.Run(ctx,
		chromedp.Navigate(s.AllowedDomains[0]),
		chromedp.WaitVisible(continueElement),
		chromedp.ScrollIntoView(continueElement),
		chromedp.Click(continueElement),
		chromedp.Sleep(10*time.Second),
		chromedp.WaitVisible(loginElement),
		chromedp.ScrollIntoView(loginElement),
		chromedp.Click(loginElement))

	s.error(err)
	s.robala(10)
	s.login(ctx)
}

// login into the SA-Youth site.
func (s *Spider) login(ctx context.Context) {
	log.Println(s.Name, " entering login details.")

	variables := s.env()

	err := chromedp.Run(ctx,

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
	log.Println(s.Name," Login successful")
	s.jobPosts(ctx)
}
func (s *Spider) jobPosts(ctx context.Context) {
	log.Println(s.Name, " loading job posts")
	s.robala(60)
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
