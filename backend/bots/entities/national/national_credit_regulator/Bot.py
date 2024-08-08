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
        self.name ="National Credit Regulator"
        self.url = "https://www.ncr.org.za/"
        self.driver = None
        self.wait = None
       # Specify the directory to save the downloaded files
        self.download_directory = 'database/pdfs' 
    
    def setup_driver(self):
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

    def run(self):

        self.setup_driver()
        self.wait = WebDriverWait(self.driver, 10)
        self.driver.get(self.url)

        logging.info(f'{self.name} Bot running')
        logging.info(f"{self.name} loading URL: {self.url}")

        self.navigation()

    def navigation(self):
            # click career button 
            self.wait_visible_and_click(By.CSS_SELECTOR,"#bm-cool-menu-108 > ul > li.item-104 > a" )
            logging.info("Loading career page")
            self.download_vacancies_pdf()

    def download_vacancies_pdf(self):
        
        self.get_icon_url()

        try:
            # Scroll postions table into view, find the element using XPath
            table = self.driver.find_element(By.XPATH,'//*[@id="sp-component"]/article/section/table/tbody')
            # Scroll the element into view
            self.driver.execute_script("arguments[0].scrollIntoView();", table)

            # Find all links in the "Download" column
            download_links = table.find_elements(By.XPATH, './/td[3]/a')
            
            if not os.path.exists(self.download_directory):
                os.makedirs(self.download_directory)

            # Iterate through each link and download the file
            for link in download_links:
                try:
                    file_url = link.get_attribute('href')
                    
                    file_name = file_url.split('/')[-1].replace('%20', '_')  # Use '_'
                    file_path = os.path.join(self.download_directory, file_name)
                                 
                    if self.file_exists(file_path):
                        pass
                    else: 
                        response = requests.get(file_url)
                        with open(file_path, 'wb') as file:
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

    def file_exists(self, file_path):
        if os.path.exists(file_path):
            logging.info(f"File '{file_name}' already downloaded previously.")
            return True
        return False

    def get_icon_url(self):
            
            try:
                # Wait until the <link> element with rel="icon" is present
                link_element = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "link[rel='icon']")))
                icon_url = link_element.get_attribute('href')
                
                if icon_url:
                    self.download_file(icon_url)

            except Exception as e:
                logging.error(f"Error finding the icon URL: {e}")
                return None
    
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
