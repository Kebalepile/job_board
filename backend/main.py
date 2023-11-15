from spiders.public.govpage.govpageSpider import Spider
from spiders.private.govpage.govpageSpider import Spider as PrivateSpider
import time


def main():

    govpage_spider = Spider()
    govpage_spider.Launch()

    time.sleep(10) # pause for 10s

    govpagePrivateSector = PrivateSpider()
    govpagePrivateSector.Launch()

main()