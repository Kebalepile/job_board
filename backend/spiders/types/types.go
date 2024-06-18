package types

import (
	"sync"
)

// Used in Govpage spider
type Links struct {
	Title       string            `json:"title"`
	BlogPosts   []BlogPost        `json:"blogPosts"`
	Departments map[string]string `json:"departments"`
}

// Used in Govpage spider
type BlogPost struct {
	Href       string   `json:"href"`
	Title      string   `json:"title"`
	Content    []string `json:"content"`
	PostedDate string   `json:"date"`
	Iframe     string   `json:"iframe"`
	Uuid       string   `json:"uuid"`
}

// Used in package main main.go
type Crawler interface {
	// initiate the Spider instant
	// Configers chromedp options such as headless flag userAgent & window size
	// Creates Navigates to the allowed domain to crawl
	Launch(wg *sync.WaitGroup)
}

// Used in Heitha spider
type JobPost struct {
	Apply         string `json:"apply"`
	JobTitle      string `json:"jobTitle"`
	JobSpecFields string `json:"jobSpecFields"`
	Details       string `json:"details"`
	Province      string `json:"province"`
	ExpiryDate    string `json:"expiryDate"`
	IconLink      string `json:"iconLink"`
	Uuid          string `json:"uuid"`
}

// Used in Heitha spider
type HeithaJobs struct {
	IconLink  string    `json:"iconLink"`
	Title     string    `json:"title"`
	BlogPosts []JobPost `json:"blogPosts"`
}

// Used in ProPersonnel spider
type ProJobPost struct {
	JobTitle      string            `json:"jobTitle"`
	StartDate     string            `json:"startDate"`
	VacancyType   string            `json:"vacancyType"`
	JobSpecFields string            `json:"jobSpecFields"`
	Location      map[string]string `json:"location"`
	Details       string            `json:"details"`
	Contact       string            `json:"contact"`
	Apply         string            `json:"apply"`
	IconLink      string            `json:"iconLink"`
	Uuid          string            `json:"uuid"`
}

// Used in ProPersonnel spider
type ProPersonnelJobs struct {
	IconLink  string       `json:"iconLink"`
	Title     string       `json:"title"`
	BlogPosts []ProJobPost `json:"blogPosts"`
}

// Used in Minopex spider
type MinopexJobPost struct {
	JobTitle      string   `json:"jobTitle"`
	PublishedDate string   `json:"publishedDate"`
	ExpiryDate    string   `json:"expiryDate"`
	Location      string   `json:"location"`
	Details       []string `json:"details"`
	Apply         string   `json:"apply"`
	IconLink      string   `json:"iconLink"`
	Uuid          string   `json:"uuid"`
}

// used in minopex spider
type MinopexJobs struct {
	IconLink  string           `json:"iconLink"`
	Title     string           `json:"title"`
	BlogPosts []MinopexJobPost `json:"blogPosts"`
}

// Used in SAyouth spider
type SaYouthPost struct {
	Summary  string `json:"summary"`
	Details  string `json:"details"`
	Apply    string `json:"apply"`
	IconLink string `json:"iconLink"`
	Uuid     string `json:"uuid"`
}

// used in SAyouth spider
type SaYouthJobs struct {
	IconLink  string        `json:"iconLink"`
	Title     string        `json:"title"`
	BlogPosts []SaYouthPost `json:"blogPosts"`
}
