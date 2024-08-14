package pipeline

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/Kebalepile/job_board/spiders/types"
	"github.com/google/uuid"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
)

func GenerateUuid() string {
	
	return fmt.Sprintf("p%s",uuid.New())
}

// saves scraped data into a json file in database public folder
func GovPageFile(data *types.Links) error {

	buffer := &bytes.Buffer{}
	encoder := json.NewEncoder(buffer)

	encoder.SetEscapeHTML(false)
	encoder.SetIndent("", "  ")

	err := encoder.Encode(*data)

	if err != nil {
		return err
	}
	title := cleanStr(data.Title)
	filePath := filepath.Join("database", "public", fmt.Sprintf("%s.json", title))

	err = os.WriteFile(filePath, buffer.Bytes(), 0644)
	if err != nil {
		return err
	}
	log.Print(data.Title, "stream write scraped data to: ", filePath)
	return nil
}

// saves scraped data into a json file in database private folder
func HeithaJsonFile(data *types.HeithaJobs) error {

	buffer := &bytes.Buffer{}
	encoder := json.NewEncoder(buffer)

	encoder.SetEscapeHTML(false)
	encoder.SetIndent("", "  ")

	err := encoder.Encode(*data)
	if err != nil {
		return err
	}
	title := cleanStr(data.Title)
	filePath := filepath.Join("database", "private", fmt.Sprintf("%s.json", title))

	err = os.WriteFile(filePath, buffer.Bytes(), 0644)
	if err != nil {
		return err
	}
	log.Print(data.Title, "stream write scraped data to: ", filePath)
	return nil
}

func HeithaFile(data *types.HeithaJobs) error {

	buffer := &bytes.Buffer{}
	buffer.WriteString("export const data = ")

	encoder := json.NewEncoder(buffer)
	encoder.SetEscapeHTML(false)
	encoder.SetIndent("", "  ")

	err := encoder.Encode(*data)
	if err != nil {
		return err
	}
	title := cleanStr(data.Title)
	filePath := filepath.Join("database", "private", fmt.Sprintf("%s.json", title))

	err = os.WriteFile(filePath, buffer.Bytes(), 0644)
	if err != nil {
		return err
	}
	log.Print(data.Title, "stream write scraped data to: ", filePath)
	return nil
}

// saves scraped data into a json file in database private folder
func ProPersonnelJsonFile(data *types.ProPersonnelJobs) error {

	buffer := &bytes.Buffer{}
	encoder := json.NewEncoder(buffer)

	encoder.SetEscapeHTML(false)
	encoder.SetIndent("", "  ")

	err := encoder.Encode(*data)
	if err != nil {
		return err
	}
	title := cleanStr(data.Title)
	filePath := filepath.Join("database", "private", fmt.Sprintf("%s.json", title))

	err = os.WriteFile(filePath, buffer.Bytes(), 0644)
	if err != nil {
		return err
	}
	log.Print(data.Title, "stream write scraped data to: ", filePath)
	return nil
}

func ProPersonnelFile(data *types.ProPersonnelJobs) error {

	buffer := &bytes.Buffer{}
	// buffer.WriteString("export const data  = ")

	encoder := json.NewEncoder(buffer)
	encoder.SetEscapeHTML(false)
	encoder.SetIndent("", "  ")

	err := encoder.Encode(*data)
	if err != nil {
		return err
	}
	title := cleanStr(data.Title)
	filePath := filepath.Join("database", "private", fmt.Sprintf("%s.json", title))

	err = os.WriteFile(filePath, buffer.Bytes(), 0644)
	if err != nil {
		return err
	}
	log.Print(data.Title, "stream write scraped data to: ", filePath)
	return nil
}
func MinopexFile(data *types.MinopexJobs) error {

	buffer := &bytes.Buffer{}
	// buffer.WriteString("export const data  = ")

	encoder := json.NewEncoder(buffer)
	encoder.SetEscapeHTML(false)
	encoder.SetIndent("", "  ")

	err := encoder.Encode(*data)
	if err != nil {
		return err
	}
	title := cleanStr(data.Title)
	filePath := filepath.Join("database", "private", fmt.Sprintf("%s.json", title))

	err = os.WriteFile(filePath, buffer.Bytes(), 0644)
	if err != nil {
		return err
	}
	log.Print(data.Title, "stream write scraped data to: ", filePath)
	return nil
}

func SaYouthFile(data *types.SaYouthJobs) error {

	buffer := &bytes.Buffer{}
	// buffer.WriteString("export const data  = ")

	encoder := json.NewEncoder(buffer)
	encoder.SetEscapeHTML(false)
	encoder.SetIndent("", "  ")

	err := encoder.Encode(*data)
	if err != nil {
		return err
	}
	title := cleanStr(data.Title)
	filePath := filepath.Join("database", "private", fmt.Sprintf("%s.json", title))

	err = os.WriteFile(filePath, buffer.Bytes(), 0644)
	if err != nil {
		return err
	}
	log.Print(data.Title, "stream write scraped data to: ", filePath)
	return nil
}

// replaces all `,` and spaces in s with `-`
func cleanStr(s string) string {
	re := regexp.MustCompile("[, ]")
	return re.ReplaceAllString(s, "-")
}

// dowload agency icon from http site, in order to
//
//	prevent mixed content warning in prodcution.
func DowloadIcon(url, filename, format string) {

	// Download the image
	res, err := http.Get(url)
	if err != nil {
		log.Fatal(err)
	}
	defer res.Body.Close()

	// Create the output file
	outputFile, err := os.Create(filepath.Join("database", "agency_icons", filename+format))
	if err != nil {
		log.Fatal(err)
	}
	defer outputFile.Close()

	// Copy the response body to the output file
	_, err = io.Copy(outputFile, res.Body)
	if err != nil {
		log.Fatal(err)
	}

}
