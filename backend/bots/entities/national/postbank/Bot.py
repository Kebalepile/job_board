import os
import time
import logging
import requests
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, StaleElementReferenceException, ElementNotInteractableException
from webdriver_manager.chrome import ChromeDriverManager

class Bot:
    def __init__(self):
        self.name = "Postbank"
        self.url = "https://www.postbank.co.za/"
        self.driver = None
        self.wait = None
        # Specify the directory to save the downloaded files
        self.download_directory = 'database/pdfs'

    def run(self):
        # Set up the Chrome driver
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--start-maximized")
        # chrome_options.add_argument("--headless")  # Remove or comment out this line to see the browser
        # Block notifications
        prefs = {"profile.default_content_setting_values.notifications": 1}
        chrome_options.add_experimental_option("prefs", prefs)

        self.driver = webdriver.Chrome(service=ChromeService(
            ChromeDriverManager().install()), options=chrome_options)

        # Set the window size to 1000x755
        self.driver.set_window_size(1000, 755)
        self.wait = WebDriverWait(self.driver, 10)

        logging.info(f'{self.name} Bot running')

        self.driver.get(self.url)
        logging.info(f"{self.name} loading URL: {self.url}")

        self.download_vacancies_pdf()

    def download_vacancies_pdf(self):
        try:
            # Click career button 
            self.wait_visible_and_click(By.XPATH, '//*[@id="menuwrapper"]/nav/ul/li[8]/a')
            logging.info("Loading career page")
            
            # Scroll job post element into view, find the element using XPath
            table = self.driver.find_element(By.XPATH, '/html/body/div[5]/div/div/div/table')
            self.driver.execute_script("arguments[0].scrollIntoView();", table)
            
            # Find all rows data in the table
            all_table_data = table.find_elements(By.XPATH, './/tbody/tr/td')

            # Get the current date, month, and year
            current_date, current_month, current_year = self.current_date()

            for table_data in all_table_data:
                try:
                    # Check if the td element contains a date string
                    date_str = table_data.find_element(By.XPATH, './/p[contains(text(), "2024")]').text.strip()
                    
                    # Parse the date string
                    closing_date = self.parse_date(date_str)

                    # Log the parsed date and other details
                    logging.info(f"Parsed Closing Date: {closing_date}")
                    logging.info(f"Month: {closing_date.month}")
                    logging.info(f"Year: {closing_date.year}")
                    logging.info(f"Day: {closing_date.day}")
                    logging.info("=======================")
                    logging.info(f"Current Month: {current_month}")
                    logging.info(f"Current Year: {current_year}")
                    logging.info(f"Current Date: {current_date}")

                    # Check if the date is in the current month or within 14 days
                    if (closing_date.month == current_month and closing_date.year == current_year) or (closing_date - current_date).days <= 14:
                        try:
                            # Check if the td element contains an 'a' tag with the class 'myLink'
                            a_tag = table_data.find_element(By.XPATH, './/p/a[@class="myLink"]')
                            # Extract and log the title and URL from the 'a' tag
                            title = a_tag.get_attribute('title')
                            url = a_tag.get_attribute('href')
                            logging.info(f"Title: {title}")
                            logging.info(f"URL: {url}")

                        except Exception as e:
                            # If no 'a' tag is found, continue to the next td element
                            logging.error(f"Error extracting link: {e}")
                        logging.info(f"Closing Date: {date_str}")

                except Exception as e:
                    # If no date string is found, continue to the next td element
                    logging.error(f"Error processing table data: {e}")
                    continue

            self.quit()

        except Exception as e:
            logging.error(f'Table not found: {e}')

    def quit(self):
        logging.info(f'{self.name} task completed.')
        # Close the WebDriver
        self.driver.quit()

    def wait_visible_and_click(self, selector_type, selector):
        try:
            element = self.wait.until(
                EC.visibility_of_element_located((selector_type, selector))
            )
            element.click()
        except Exception as e:
            logging.error(f"Error clicking element: {e}")

    def parse_date(self, date_str):
        try:
            # Function to parse date in 'dd MMM yyyy' format
            parsed_date = datetime.strptime(date_str, '%d %b %Y')
            logging.info(f"Parsed Date: {parsed_date}")
            return parsed_date
        except Exception as e:
            logging.error(f"Error parsing date: {e}")
            raise

    def current_date(self):
        try:
            # Get the current date, month, and year
            current_date = datetime.now()
            current_month = current_date.month
            current_year = current_date.year
            return current_date, current_month, current_year
        except Exception as e:
            logging.error(f"Error getting current date: {e}")
            raise


