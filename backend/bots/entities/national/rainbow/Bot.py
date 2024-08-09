import os
import time
import logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
# from selenium.common.exceptions import NoSuchElementException, StaleElementReferenceException, ElementNotInteractableException
# from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.firefox.options import Options as FirefoxOptions
# from webdriver_manager.firefox import GeckoDriverManager


class Bot:
    def __init__(self):
        self.name = "RAINBOW"
        self.url = "https://rainbowchickens.co.za/"
        self.driver = None
        self.wait = None
        # Specify the directory to save the downloaded files
        self.download_directory = 'C:\\Users\\pimp\\Desktop\\projects\\job_board\\backend\\database\\pdfs'

    def setup_driver(self):
        # Set up Firefox options
        opt = webdriver.FirefoxOptions()
        # opt.add_argument("--headless")  # Run in headless mode if needed

        # Set up Firefox profile for handling PDF downloads
        profile = webdriver.FirefoxProfile()

        # Configure download settings
        # Use a custom download directory
        profile.set_preference("browser.download.folderList", 2)
        # Don't show download manager
        profile.set_preference(
            "browser.download.manager.showWhenStarting", False)
        # Set the download directory
        profile.set_preference("browser.download.dir", self.download_directory)
        # Download PDFs automatically
        profile.set_preference(
            "browser.helperApps.neverAsk.saveToDisk", "application/pdf")

        # Attach the profile to the options
        opt.profile = profile

        # Initialize the WebDriver with the updated options
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
        try:
            # accept cookies
            self.wait_visible_and_click(
                By.XPATH, '//*[@id="daextlwcn-cookie-notice-button-2"]')

            # click career button
            self.wait_visible_and_click(
                By.XPATH, '//*[@id="menu-rainbow-top-menu"]/li[4]/a')
            logging.info(f"{self.name} loading career page")
            self.view_vacancies()
        except Exception as e:
            logging.error(f"Error while in navigation method: {e}")

    def get_vacancies_view_links(self):
        try:
            self.pause(10)
            # Find table and scroll it into view
            table = self.wait.until(EC.presence_of_element_located(
                (By.CSS_SELECTOR, 'table#ContentPlaceHolder1_grvvacancies')))
            logging.info(f"{self.name} found vacancies list")
            self.driver.execute_script("arguments[0].scrollIntoView();", table)
            
            # Find all links in the "view" column
            links = self.driver.find_elements(
                By.CSS_SELECTOR, ".btn-outline-secondary.btn.pull-right")
            # Filter the elements that have text content "View"
            view_links = [link for link in links if link.text == "View"]
            logging.info(
                f"{self.name} clicking {len(view_links)} view links found")

            return view_links

        except Exception as e:
            logging.error(f"Error in get_vacancies_view_links method: {e}")
            self.quit()


    def view_vacancies(self):
        try:
            # Scroll postions vacancey link into view, find the element using XPath
            self.pause(10)
            vacancy_button = self.wait.until(EC.presence_of_element_located(
                (By.XPATH, "//a[text()='VIEW ALL OUR CURRENT VACANCIES HERE']")))
            # Scroll the element into view &  Use JavaScript to click
            self.driver.execute_script(
                "arguments[0].scrollIntoView(true);", vacancy_button)
            # Get the href attribute of the element
            href = vacancy_button.get_attribute("href")
            # Navigate to the URL in the href attribute
            self.driver.get(href)
            logging.info(f'{self.name} clicked view all vacancies button')
            logging.info(f"{self.name} loading vacancies page")
            view_links = self.get_vacancies_view_links()

            self.download_vacancies_pdf(len(view_links), 0, view_links)

            self.quit()

        except Exception as e:
            logging.error(f"Error in view_vacancies method: {e}")
            # self.quit()

    def download_vacancies_pdf(self, total, index, view_links):
        try:
            if index >= total:
                self.quit()
                return

            view_link = view_links[index]
            view_link.click()

            # Wait for the download button to be available and re-fetch the element
            download_link = self.wait.until(EC.presence_of_element_located(
                (By.XPATH, '//*[@id="ContentPlaceHolder1_btnPrint1"]')))

            # Get a list of files in the download directory before downloading
            before_download = set(os.listdir(self.download_directory))

            download_link.click()
            # Handle tab switching if a new tab is opened
            original_window = self.driver.current_window_handle
            all_windows = self.driver.window_handles
            for window in all_windows:
                if window != original_window:
                    self.driver.switch_to.window(window)
                    break
            self.pause(10)  # Consider using an explicit wait instead of a fixed pause

            # Get a list of files in the download directory after downloading
            after_download = set(os.listdir(self.download_directory))
            new_files = after_download - before_download

            if new_files:
                file_name = new_files.pop()
                logging.info(f"Downloaded file: {file_name}")
            else:
                logging.info(f"File '{file_name}' already downloaded previously.")

            # Close the new tab if opened and switch back to the original window
            if len(all_windows) > 1:
                self.driver.close()
                self.driver.switch_to.window(original_window)
            # Go back in browser history after switching back to the original window
            self.driver.back()

            view_links = self.get_vacancies_view_links()
            return self.download_vacancies_pdf(len(view_links), index + 1, view_links)

        except Exception as e:
            logging.error(f"Error in download_vacancies_pdf method {e}")

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

    def file_exists(self, file_path, file_name):
        
        if os.path.exists(file_path):
            logging.info(f"File '{file_name}' already downloaded previously.")
            return True
        return False

    def get_icon_url(self):
        try:
            link_element = self.wait.until(EC.presence_of_element_located(
                (By.CSS_SELECTOR, "link[rel='icon']")))
            icon_url = link_element.get_attribute('href')

            if icon_url:
                self.download_file(icon_url)
            else:
                logging.info("Icon URL not found or is empty.")
        except Exception as e:
            logging.error(f"Error finding the icon URL")
