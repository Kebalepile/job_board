import re
import sys
import time
import logging
from typing import List
from datetime import datetime
from selenium import webdriver
from pipeline.writer import GovPageFile
from selenium.webdriver.common.by import By
from spiders.types.types import Links, BlogPost
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support import expected_conditions as EC


govPageLinks: dict = Links()


class Spider:
    Name = "govpage-public-sector"

    def __init__(self):

        self.AllowedDomains = [
            "https://www.govpage.co.za/",
            "https://www.govpage.co.za/latest-govpage-updates"
        ]
        # webdriver options
        opt = webdriver.FirefoxOptions()
        opt.add_argument("--headless") # enable headless for production
        self.driver = webdriver.Firefox(options=opt)
        # Set the window size to 768x1024 (tablet size)
        self.driver.set_window_size(768, 1024)

    def Launch(self):

        log.info(f"{self.Name} spider has Lunched ")

        self.driver.get(self.AllowedDomains[0])

        menu: WebElement = self.driver.find_element(
            By.CSS_SELECTOR, "*[aria-label='Menu']")

        menu.click()

        menuOptions: List[WebElement] = self.driver.find_elements(
            By.CSS_SELECTOR, "ul li.wsite-menu-item-wrap a.wsite-menu-item")

        url: (str | None)

        for o in menuOptions:

            if "govpage" in o.text.lower():
                url = o.get_attribute("href")
                break

        if url is not None:

            selector: str = ".blog-title-link"

            log.info(f"Loading {self.Name} vacancy page")

            self.driver.get(url)

            wait: WebDriverWait = WebDriverWait(self.driver, 10)
            elems: List[WebElement] = wait.until(
                EC.presence_of_all_elements_located(
                    (By.CSS_SELECTOR, selector))
            )

            self.driver.execute_script("""
                const elem = document.querySelector('.blog-title-link');
                elem.scrollIntoView({behavior: 'smooth'})                      
            """)

            elems: List[WebElement] = self.driver.find_elements(
                By.CSS_SELECTOR, selector)

            vacanciesLink: (str | None)

            for e in elems:

                text: str = e.text.lower()
                fullDate = self.Date().lower()
                dayMonth = fullDate[:10]
                weekday = self.Weekday()

                pattern = rf"{fullDate}|{dayMonth}|{weekday}"
                yes:bool = re.search(pattern, text, re.IGNORECASE)

                if yes:
                    govPageLinks["title"] = self.Name
                    vacanciesLink = e.get_attribute("href")
                    break
              
            if vacanciesLink is not None:
                self.departments(vacanciesLink)
            else:
                log.waring(
                    f"{self.Name}, Sorry, No Government Job Posts for today")
                self.driver.close()

    def departments(self, url: str):

        log.info(f"{self.Name}, searching for latest government vacancies.")

        selector: str = "[id^='blog-post-'] a"

        self.driver.get(url)
        self.Emma(10)

        self.driver.execute_script("""
            const elem = document.querySelector("[id^='blog-post-'] a");
            elem.scrollIntoView({behavior: 'smooth'})                      
        """)

        elems: List[WebElement] = self.driver.find_elements(
            By.CSS_SELECTOR, selector)

        if len(elems) > 0:
            numOfDepartments: int = 0
            for e in elems:

                text: str = e.text.lower().lstrip()
                href: str = e.get_attribute("href")

                a = len(text) > 0

                fullDate = self.Date().lower()
                dayMonth = fullDate[:10]
                weekday = self.Weekday()

                pattern = rf"{fullDate}|{dayMonth}|{weekday}"
                b:bool = re.search(pattern, text, re.IGNORECASE)

                pattern = r"private property opportunities|private sector opportunities|public sector opportunities"

                c: bool = re.search(pattern, text, re.IGNORECASE)

                if a and not b and not c:

                    numOfDepartments += 1
                    govPageLinks["departments"][text] = href

            log.info(
                f"{self.Name}, scrapping deparment posts of {numOfDepartments} departments.")
            log.info(govPageLinks["departments"])

            for k in govPageLinks["departments"]:

                blogpost = self.postContent(govPageLinks["departments"][k])
                govPageLinks["blogPosts"].append(blogpost)

            GovPageFile(govPageLinks)
            self.driver.close()
            log.info(f"{self.Name} done")

    def postContent(self, url: str):
        self.driver.get(url)

        WebDriverWait(self.driver, 10).until(
            EC.presence_of_all_elements_located(
                (By.CSS_SELECTOR, ".blog-post"))
        )

        self.driver.execute_script("""
            const elem = document.querySelector('.blog-post');
            elem.scrollIntoView({behavior: 'smooth'})                      
        """)

        selector: str = ".blog-title-link.blog-link"
        elems: List[WebElement] = self.driver.find_elements(
            By.CSS_SELECTOR, selector)
        if len(elems) > 0:
            e = elems[0]
            text = e.text
            href = e.get_attribute("href")

            date = self.driver.find_element(
                By.CSS_SELECTOR, ".blog-date > .date-text").text

            blogPost = BlogPost()
            
            blogPost["imgSrc"] = self.driver.execute_script("""
                    return location.origin + document.querySelector("*[alt='Picture']").getAttribute("src")
            """)
            blogPost["title"] = text
            blogPost["href"] = href
            blogPost["postedDate"] = date

            elems = self.driver.find_elements(
                By.CSS_SELECTOR, ".blog-content > .paragraph")
            if len(elems):
                for e in elems:
                    text = e.text
                    content = blogPost["content"]
                    content.append(text)
                    blogPost["content"] = content
            else:
                src = self.driver.execute_script("""
                        const src = Array.from(document.getElementsByTagName('iframe')).filter(f =>{
                        
                            if (f.src.includes("drive.google")){
                                return f
                            }
                                        
                        }).map(f => f.src);
                        return src[0]; 
                    """)
                blogPost["iframe"] = src
            return blogPost
        return "no blog post found"

    def Weekday(self) -> str:
        current_date = datetime.now()
        day_of_week_name = current_date.strftime("%A")
        return day_of_week_name.lower()

    def Date(self) -> str:
        date = datetime.now()
        return date.strftime("%d %B %Y")

    def Emma(self, seconds: float):

        time.sleep(seconds)


# Create a custom formatter for log messages
log_formatter = logging.Formatter(
    "%(asctime)s [%(levelname)s]: %(message)s", datefmt="%d %B %Y %H:%M:%S")
# Create a logger
log = logging.getLogger()
log.setLevel(logging.INFO)  # Set the logging level to INFO
# Create a console handler and set the formatter
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(log_formatter)

# Add the console handler to the logger
log.addHandler(console_handler)
# Now, you can use the logger to print messages with timestamps
# log.info("This is an informational message.")
# log.warning("This is a warning message.")
