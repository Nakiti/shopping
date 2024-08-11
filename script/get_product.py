import requests
from bs4 import BeautifulSoup
from bs4 import Tag
import time
import uuid
import logging
import re

headers = {
    'authority': 'www.google.com',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'max-age=0',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    # Add more headers as needed
}

logging.basicConfig( filename="debug.log",level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')


def get_product(url, price, name):
    try:
        response = requests.get(url, headers=headers)
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to {url}: {e}")
        return

    if response.status_code == 200:
        # print(url)
        min_price = min(price) - 25
        max_price = max(price)


        soup = BeautifulSoup(response.content, 'html.parser')
        items = soup.find_all(lambda tag: tag.name in ["p", "span"] and tag.string and re.match(r'^\s*\$\s*(\d+(\.\d+\s*)?)$',
                                tag.string) and float(tag.string.lstrip().lstrip("$")) > min_price and float(tag.string.lstrip().lstrip("$")) < max_price)

        items and items.pop(0)
        completed_items = []
        return_items = []


        # Print the final items
        for item in items:
            if item.contents and isinstance(item.contents[0], Tag):
                item = item.contents[0]

            unique_id = uuid.uuid4()
            completed_item = {
                "id": str(unique_id),
                "name": "",
                "price": item.get_text(strip=True),
                "image": "",
                "brand": name,
                "link": ""
            }

            temp = item

            if len(completed_items) >= 8:
                break

            while completed_item["name"] == "" or completed_item["image"] == "" or completed_item["link"] == "":
                logging.debug(f'Current temp element: {temp}')

                if completed_item["name"] == "":
                    name_tag = temp.find("h2") or temp.find("a")
                    if name_tag and name_tag.get_text(strip=True):
                        completed_item["name"] = name_tag.get_text(strip=True)
                        logging.debug(f'Found name: {completed_item["name"]}')


                if completed_item["image"] == "":
                    image_tag = temp.find("img")
                    if image_tag and 'src' in image_tag.attrs and image_tag["alt"] != "":
                        completed_item["image"] = image_tag["src"]
                        logging.debug(f'Found price: {completed_item["image"]}')
                
                if completed_item["link"] == "":
                    link_tag = temp.find("a")
                    if link_tag and 'href' in link_tag.attrs:
                        completed_item["link"] = link_tag["href"]

                temp = temp.parent
                if temp is None:
                    break

            if not any(item["image"] == completed_item["image"] for item in completed_items):
                completed_items.append(completed_item)
                logging.debug('No more parent elements to traverse.')
        
        for item in completed_items:
            if item["image"].split(":")[0] == "https":
                return_items.append(item)
                
    
        return return_items

    else:
        print(f"Failed to retrieve content from {url}, status code: {response.status_code}")      


# urls = ["https://www2.hm.com/en_us/men/products/shirts.html","https://www.hollisterco.com/shop/us/mens-jackets-jackets-and-coats", "https://www2.hm.com/en_us/men/products/t-shirts-tank-tops.html"]

# for url in urls:
#     print("\n\n\n\n\n")
#     print(get_product(url))


# print(get_product("https://www.patagonia.com/shop/mens/tops/t-shirts", [1000, 0], "sdsd"))
