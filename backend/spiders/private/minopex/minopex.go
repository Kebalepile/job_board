package minopex

//go to  https://minopex.com/
// download icon image
//  selector := `//*[@id="post-319"]/div/div/section[6]/div/div/div/section/div/div[1]/div/div[2]/div/div/a``
// scroll into view using selector
//  get href using selector
// navigate to href
// check if location origin is https://minopex.simplify.hr/
// selector := /html/body/div[1]/div/div[2]/div[1]/div/div/div/div/div/a
// scroll into view using selector & click it
// selector := `#companyVacanciesResultsContainer`
//  get these rows '#companyVacanciesResultsContainer .job-section > .row'
// in js for each of the posts found map the rows and run this code
// rows.map(row => {
// const data = {};

// Select the job title text and store it in the WeakMap
// 	const jobTitle = row.querySelector(".job-title a");
// 	if (jobTitle) {
// 	  data.title = jobTitle.textContent.replace(/\s*\n\s*/g, "").trim();
// 	}

// 	const locationText = row.querySelector(".job-location.text-wrapper");
// 	if (locationText) {
// 	  data.location = locationText.textContent
// 		.replace(/\s*\n\s*/g, "")
// 		.trim();
// 	}

// 	const publishedText = row.querySelector("div:nth-child(4)");
// 	if (publishedText) {
// 	  data.published = publishedText.textContent
// 		.replace(/\s*\n\s*/g, "")
// 		.trim();
// 	}

// 	const closingText = row.querySelector("div:nth-child(5)");
// 	if (closingText) {
// 	  data.closing = closingText.textContent.replace(/\s*\n\s*/g, "").trim();
// 	}

// 	const jobLink = row.querySelector(".job-title a");
// 	if (jobLink) {
// 	  data.more = jobLink.getAttribute("href");
// 	}
// 	// console.log(data);
// 	return row
// })
