import requests
from bs4 import BeautifulSoup
from nltk.stem.snowball import SnowballStemmer
import re

headers = {
    'authority': 'www.google.com',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'max-age=0',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    # Add more headers as needed
}

stemmer = SnowballStemmer("english")


def find_category_in_html(url, keyword, length, gender):
    # Send a GET request to the URL
    try:
        response = requests.get(url, headers=headers)
      #   print(response)
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to {url}: {e}")
        return

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content
        soup = BeautifulSoup(response.content, 'html.parser')

        # Search for keyword in any part of the HTML structure
        keyword_elements = set()

        # Find all elements and check their attributes and text content
        all_elements = soup.find_all(True)  # Find all elements
        for element in all_elements:
            # Check attributes
            for attr in element.attrs:
                if attr == 'href' and any(kw in stemmer.stem(str(element[attr])) for kw in keyword) and element.name == 'a':
                    keyword_elements.add(element['href'])  # Append the tag name
                    break  # Break out of attribute loop if keyword found
            
            # Check text content
            if element.name and any(kw in element.text for kw in keyword) and element.name == 'a':
                keyword_elements.add(element['href'])  # Append the tag name



        # Print or process the list of tag names
        filtered_urls = [url for url in keyword_elements if len(url) <= length]
      #   print(filtered_urls)
        # print("filtered", filtered_urls)
        if filtered_urls:
            new_values = []
            return_values = []
            for url in filtered_urls:
                temp = re.split(r'[/.-]', url)
               #  print(temp)
                for word in temp:
                    if stemmer.stem(word) == gender:
                        new_values.append(url)
                        break                
                    # print(url)
                    # print(filtered_urls)

            for url in new_values:
                temp = re.split(r'[/.-]', url)
                if any(stemmer.stem(word) == ky for word in temp for ky in keyword): return_values.append(url)

            return return_values
            # for url in filtered_urls: 
            #     return url
                
        else:
            print(f"No categories found with keyword '{keyword}'.")

    else:
        print(f"Failed to retrieve content from {url}, status code: {response.status_code}")

tops = ["top", "shirt", "t", "polo", "casual", "henley", "tank", "sweater", "hoodie", "sweatshirt", "jacket",  "long sleeve",  "pullover", "flannel"]

# print(find_category_in_html("https://www.uniqlo.com/us/en/men", tops, 100, "men"))
