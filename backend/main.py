from spiders.public.govpage.govpageSpider import Spider as PublicSpider
from spiders.private.govpage.govpageSpider import Spider as PrivateSpider
import time
import logging


def main():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s]: %(message)s', datefmt='%d %B %Y %H:%M:%S')

    try:
        logging.info("Starting Public Spider")
        govpage_spider = PublicSpider()
        govpage_spider.launch()  # Changed to launch with capital 'L'

        logging.info("Pausing for 10 seconds")
        time.sleep(10)  # pause for 10s

        logging.info("Starting Private Spider")
        govpage_private_spider = PrivateSpider()
        govpage_private_spider.launch()  # Changed to Launch with capital 'L'

        logging.info("Scraping completed")

    except Exception as e:
        logging.error(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
