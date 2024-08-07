# from spiders.public.govpage.govpageSpider import Spider as PublicSpider
# from spiders.private.govpage.govpageSpider import Spider as PrivateSpider
from bots.entities.national.national_credit_regulator.Bot import Bot as NCR_Bot
from  bots.entities.national.community_schemes_ombud_services.Bot import Bot as CSOS_Bot
import time
import logging


def main():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s]: %(message)s', datefmt='%d %B %Y %H:%M:%S')

    try:
        # logging.info("Starting Public Spider")
        # govpage_spider = PublicSpider()
        # govpage_spider.launch()  # Changed to launch with capital 'L'

        # logging.info("Pausing for 10 seconds")
        # time.sleep(10)  # pause for 10s

        # logging.info("Starting Private Spider")
        # govpage_private_spider = PrivateSpider()
        # govpage_private_spider.launch()  # Changed to Launch with capital 'L'
        # logging.info("Starting NCR Bot")
        # nrc_bot = NCR_Bot()
        # nrc_bot.run()

        logging.info("Starting CSOS Bot")
        csos_bot = CSOS_Bot()
        csos_bot.run()

        # logging.info("Scraping completed")


    except Exception as e:
        logging.error(f"An error occurred while initiating bots: {e}")

if __name__ == "__main__":
    main()
