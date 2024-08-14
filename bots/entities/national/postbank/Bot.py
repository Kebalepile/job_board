import os
import time
import logging
import requests
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, StaleElementReferenceException, ElementNotInteractableException

# from selenium.webdriver.firefox.service import Service as FirefoxService
# from selenium.webdriver.firefox.options import Options as FirefoxOptions
# from webdriver_manager.firefox import GeckoDriverManager

class Bot:
    def __init__(self):
        self.name = "Postbank"
        self.url = "https://www.postbank.co.za/"
        self.driver = None
        self.wait = None
        # Specify the directory to save the downloaded files
        self.download_directory = 'database/pdfs'

    def setup_driver(self):
        opt = webdriver.FirefoxOptions()
        opt.add_argument("--headless")
        self.driver = webdriver.Firefox(options=opt)
        # Set the window size to 1000x755
        self.driver.set_window_size(1000, 755)

    def run(self):

        self.setup_driver()
        self.wait = WebDriverWait(self.driver, 10)
        self.driver.get(self.url)
        self.pause(10)
        self.get_icon_url()

        logging.info(f'{self.name} Bot running')
        logging.info(f"{self.name} loading URL: {self.url}")

        self.navigation()

    def navigation(self):
         # Click career button 
            self.wait_visible_and_click(By.XPATH, '//*[@id="menuwrapper"]/nav/ul/li[8]/a')
            logging.info("Loading career page")
            self.download_vacancies_pdf()
            

    def download_vacancies_pdf(self):
        
        try:
           
            # Scroll job post element into view, find the element using XPath
            table = self.driver.find_element(By.XPATH, '/html/body/div[5]/div/div/div/table')
            self.driver.execute_script("arguments[0].scrollIntoView();", table)
            
            # Find all td elements
            all_td_elements = table.find_elements(By.XPATH, './/tbody/tr/td')

            # Get the current date, month, and year
            current_day, current_month, current_year = self.current_date()

            for td in all_td_elements:
                try:
                    # Find the <p> element within the <td>
                    p_element = td.find_element(By.XPATH, './/p')
                    text = p_element.text.strip()

                    # Check if the text ends with CURRENT YEAR"
                    current_year = "2024"
                    if text.endswith(current_year):
                        date_str = text
                        closing_date = self.parse_date(date_str)
                        
                        # Calculate the difference in days between the closing date and the current date
                        days_difference = closing_date.day - current_day

                        # Determine if the job application is still open
                        still_open_for_applications = (
                            closing_date.month == current_month and  # Check if the month is the current month
                            closing_date.year == int(current_year) and  # Check if the year is the current year
                            0 <= days_difference <= 14  # Check if the day difference is between 0 and 14 (inclusive)
                        )
                        # logging.info(still_open_for_applications)
                        # If the job application is still open
                        if still_open_for_applications:
                            try:
                                # Find the parent <td> element
                                parent_td = td.find_element(By.XPATH, '..')
                                # Check if the td element contains an 'a' tag with the class 'myLink'
                                a_tag = parent_td.find_element(By.XPATH, './/a[@class="myLink"]')
                                # Extract and log the title and URL from the 'a' tag
                                title = a_tag.get_attribute('title')
                                file_url  = a_tag.get_attribute('href')
                                # logging.info(f"Title: {title}")
                                # logging.info(f"URL: {file_url }")
                                # Extract the file name from the URL and replace %20 with an underscore or space
                                file_name = file_url.split('/')[-1].replace('%20', '_')  # Use '_'
                                file_path = os.path.join(self.download_directory, file_name)
                                                        
                                if not os.path.exists(self.download_directory):
                                    os.makedirs(self.download_directory)  
                                # file_name = os.path.join(
                                #     self.download_directory, file_url.split('/')[-1].replace('%20', '_'))
                                if self.file_exists(file_path,file_name):
                                    pass
                                else:
                                    response = requests.get(file_url)
                                    with open(file_path, 'wb') as file:
                                        file.write(response.content)
                                        
                                    logging.info(f"Downloaded {file_name}")
                                    
                                    self.pause(5)  # Pause for 5 seconds
                            except Exception as e:
                                logging.info(f"Error downloading file: {e}")
                            except NoSuchElementException:
                                # If no 'a' tag is found, continue to the next td element
                                # logging.info("No link found in this td element.")
                                pass

                except NoSuchElementException:
                    # If no <p> element is found, continue to the next td element
                    # logging.info("No <p> element found in this td element.")
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
            # Define different date formats
            formats = [
                '%d %b %Y',   # e.g., 31 Jul 2024
                '%d %B %Y',   # e.g., 31 July 2024
                '%d %b, %Y',  # e.g., 31 Jul, 2024
                '%d %B, %Y',  # e.g., 31 July, 2024
                '%b %d, %Y',  # e.g., Jul 31, 2024
                '%B %d, %Y',  # e.g., July 31, 2024
                '%m/%d/%Y',   # e.g., 07/31/2024
                '%d/%m/%Y',   # e.g., 31/07/2024 (day first format)
                '%d-%m-%Y',   # e.g., 31-07-2024
            ]
            
            # Normalize the month part
            month_abbr = {
                "Jan": "January", "Feb": "February", "Mar": "March", "Apr": "April",
                "May": "May", "Jun": "June", "Jul": "July", "Aug": "August",
                "Sep": "September", "Oct": "October", "Nov": "November", "Dec": "December",
                "JAN": "January", "FEB": "February", "MAR": "March", "APR": "April",
                "MAY": "May", "JUN": "June", "JUL": "July", "AUG": "August",
                "SEP": "September", "OCT": "October", "NOV": "November", "DEC": "December"
            }
            
            # Convert month abbreviation or number to full month name
            parts = date_str.split()
            if len(parts) > 1 and parts[1] in month_abbr:
                parts[1] = month_abbr[parts[1]]
                date_str = " ".join(parts)
            
            # Try to parse the date using different formats
            for fmt in formats:
                try:
                    return datetime.strptime(date_str, fmt)
                except ValueError:
                    continue

            raise ValueError(f"Date format not recognized: {date_str}")
        
        except Exception as e:
            logging.error(f"Could not parse date: {date_str}. Error: {e}")
            raise

    def current_date(self):
        try:
            # Get the current date, month, and year
            date = datetime.now()
            month = date.month
            year = date.year
            day = date.day
            return day, month, year
        except Exception as e:
            logging.error(f"Error getting current date: {e}")
            raise

    def pause(self, seconds):
        logging.info(f"Pausing for {seconds} seconds...")
        time.sleep(seconds)

    def file_exists(self, file_path,file_name):
        if os.path.exists(file_path):
            logging.info(f"File '{file_name}' already downloaded previously.")
            return True
        return False

    def get_icon_url(self):
        try:
            link_element = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "link[rel='icon']")))
            icon_url = link_element.get_attribute('href')
            
            if icon_url:
                self.download_file(icon_url)
            else:
                logging.info("Icon URL not found or is empty.")
        except Exception as e:
            logging.error(f"Error finding the icon URL")
        
    def download_file(self, file_url):
        # Extract the file name from the URL
        file_name = file_url.split('/')[-1]
        file_path = os.path.join("database/agency_icons", file_name)
        
        if os.path.exists(file_path):
            logging.info(f"File '{file_name}' already downloaded previously.")
        else:
            response = requests.get(file_url)
            if response.status_code == 200:
                with open(file_path, 'wb') as file:
                    file.write(response.content)
                logging.info(f"website icon '{file_name}' downloaded and saved.")
            else:
                logging.error(f"Failed to download file '{file_name}'. Status code: {response.status_code}")
