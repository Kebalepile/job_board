import  os
import time
import logging
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, StaleElementReferenceException, ElementNotInteractableException
from webdriver_manager.chrome import ChromeDriverManager


class Bot:
    def __init__(self):
        self.name ="Community Schemes Ombud Service"
        self.url = "https://csos.org.za/"
        self.driver = None
        self.wait = None
        # Specify the directory to save the downloaded files
        self.download_directory = 'database' 

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
            # open side bar menu
            self.wait_visible_and_click(By.XPATH,"/html/body/div[1]/section[2]/div/div[3]/div/div/div/div")
            self.pause(5)
            # click career button 
            self.wait_visible_and_click(By.XPATH,'//*[@id="menu-2-a4c9d1b"]/li[7]/a' )

            # Scroll job post element into view, find the element using XPath
            table = self.driver.find_element(By.XPATH,'//*[@id="content"]/div/div[1]/section[2]/div/div/div/div[2]')
            # Scroll the element into view
            self.driver.execute_script("arguments[0].scrollIntoView();", table)
            # Find all links in the "Download" column
            download_links = table.find_elements(By.XPATH, '//a[.//span[text()="Apply"]]')
            
            if not os.path.exists(self.download_directory):
                os.makedirs(self.download_directory)

            # Iterate through each link and download the file
            for link in download_links:
                try:
                    file_url = link.get_attribute('href')
                    file_name = os.path.join(self.download_directory, file_url.split('/')[-1])
                    
                    response = requests.get(file_url)
                    with open(file_name, 'wb') as file:
                        file.write(response.content)
                        
                    logging.info(f"Downloaded {file_name}")
                    
                    self.pause(5)  # Pause for 5 seconds
                except Exception as e:
                    logging.info(f"Error downloading file: {e}")
            self.quit()

        except Exception as e:
                        logging.info(f'Table not found: {e}')

    def quit(self):
        logging.info(f'{self.name} task compeleted.')
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

    def evaluate_javascript(self, script):
        return self.driver.execute_script(script)

    def pause(self, seconds):
        logging.info(f"Pausing for {seconds} seconds...")
        time.sleep(seconds)

    def wait_for_exit(self):
        logging.info(
            f"{self.name} paused waiting for your command. \nType 'exit' and press Enter to proceed...")

        user_input = input().strip()
        if user_input.lower() == "exit":
            return
        else:
            logging.info(
                "Invalid input. Type 'exit' and press Enter to proceed...")
            self.wait_for_exit()

