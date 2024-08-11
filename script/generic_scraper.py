from find_keyword import find_keyword_in_html
from find_category import find_category_in_html
from get_product import get_product
import requests
from bs4 import BeautifulSoup
import csv
import sys
import os
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed



headers = {
    'authority': 'www.google.com',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'max-age=0',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    # Add more headers as needed
}

stores = os.getenv("STORES", "[]")
try:
    stores_list = json.loads(stores)
except json.JSONDecodeError as e:
    stores_list = []

gender = os.getenv("GENDER", "[]")
try:
    gender_list = json.loads(gender)
except json.JSONDecodeError as e:
    gender_list = []

clothing = os.getenv("CLOTHING", "[]")
try:
    clothing_list = json.loads(clothing)
except json.JSONDecodeError as e:
    clothing_list = []

price = os.getenv("PRICE", "[]")
try:
    price_list = json.loads(price)
except json.JSONDecodeError as e:
    price_list = []


# filter_list = json.loads(filter)

# Example usage:
# url_to_search = 'https://www2.hm.com/'
# keyword_to_find = 'men'  # Replace with your keyword

rows = []

# stores_list = [{"link": "https://www.thenorthface.com/", "name": "yo", "image": "asdfsdfsdf"}]
# gender_list = ["men"]
# clothing_list = ["tops"]
# price_list = [50]

bottoms = ["bottom", "pant", "jean", "chino", "short", "trouser", "jogger", "sweatpant", "cargo", "khaki", "corduroy"]
tops = ["top", "shirt", "t", "polo", "casual", "henley", "tank", "sweater", "hoodie", "sweatshirt", "jacket",  "long sleeve",  "pullover", "flannel"]

clothing_options = []

if "tops" and "bottoms" in clothing_list:
    clothing_options = tops + bottoms
elif "tops" and not "bottoms" in clothing_list:
    clothing_options = tops
elif "bottoms" and not "tops" in clothing_list:
    clothing_options = bottoms

for store in stores_list:
    url = f"{store["link"]}{gender_list[0]}"
    # url = url_to_search + keyword_to_find

    try:
        response = requests.get(url, headers=headers)
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to {url}: {e}")

    if not response or response.status_code != 200:
        # print(type(store), type(filter))
        # time.sleep(10)

        if gender_list[0] == "men":
            temp = find_keyword_in_html(store["link"], gender_list[0], 15) 
        elif gender_list[0] == "women":
            temp = find_keyword_in_html(store["link"], gender_list[0], 20)

        # print("gender: ", gender_list[0])
        # print(store)
        # print(temp)
        url = store["link"] + temp[1:]


    next_urls = find_category_in_html(url, clothing_options, 40, gender_list[0])
   #  print(next_urls)

    # fields = ["name", "price", "image", "brand"]

    # filename = "data.csv"

    # print(next_url)

    with ThreadPoolExecutor(max_workers=len(next_urls)) as executor:
        futures = [executor.submit(get_product, store["link"] + url[1:], price_list, store["name"]) for url in next_urls]
        for future in as_completed(futures):
            try:
                products = future.result()
                for item in products:
                    if isinstance(item, dict):
                        rows.append(item)
            except Exception as e:
                print(f"Error processing URL: {e}")
    


try:
    print(json.dumps(rows))
except TypeError as e:
    print(f"Error converting to JSON: {e}")