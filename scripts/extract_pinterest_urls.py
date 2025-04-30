#!/usr/bin/env python3
import sys
import re
import requests
import json
import random
from bs4 import BeautifulSoup
import argparse


def extract_pinterest_images(html_content):
    """Extract image URLs from HTML and format them as Pinterest URLs."""
    soup = BeautifulSoup(html_content, "html.parser")
    images = soup.find_all("img")

    pinterest_urls = []
    for img in images:
        src = img.get("src")
        if src:
            # For Pinterest-like formatting with 736x resolution
            if "pinimg.com" in src:
                # Already a Pinterest URL, keep it
                pinterest_urls.append(src)
            else:
                # Extract filename or use the whole URL
                filename = src.split("/")[-1]
                # Remove query parameters if present
                filename = filename.split("?")[0]
                pinterest_urls.append(f"https://i.pinimg.com/736x/{filename}")

    return pinterest_urls


def generate_mock_json(urls, output_file):
    """Generate a mock_pins.json file from the extracted URLs."""
    pins = []
    boards = {}

    # Define some board names
    board_ids = ["board1", "board2", "board3"]
    board_names = ["Test Board 1", "Test Board 2", "Test Board 3"]

    # Create the boards
    for i, (board_id, board_name) in enumerate(zip(board_ids, board_names)):
        boards[board_id] = {"id": board_id, "name": board_name}

    # Create pins for each URL
    for i, url in enumerate(urls, 1):
        # Assign to a random board
        board_id = random.choice(board_ids)
        board_name = boards[board_id]["name"]

        # Generate a random color
        color = "#{:02x}{:02x}{:02x}".format(
            random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)
        )

        pins.append(
            {
                "id": str(i),
                "name": f"Test Pin {i}",
                "altText": f"Test pin {i} description",
                "color": color,
                "imageURL": url,
                "board": {"id": board_id, "name": board_name},
            }
        )

    # Create the final JSON structure
    mock_data = {"pins": pins, "boards": boards}

    # Write to the output file
    with open(output_file, "w") as f:
        json.dump(mock_data, f, indent=2)

    print(f"Created mock data with {len(pins)} pins in {output_file}")


def main():
    parser = argparse.ArgumentParser(
        description="Extract image URLs from HTML and format them as Pinterest URLs"
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--url", help="URL of the webpage to extract images from")
    group.add_argument("--file", help="Local HTML file to extract images from")

    parser.add_argument(
        "--output", help="Output JSON file name", default="mock_pins.json"
    )
    parser.add_argument(
        "--format",
        choices=["text", "json"],
        default="text",
        help="Output format (text or json)",
    )

    args = parser.parse_args()

    if args.url:
        try:
            response = requests.get(args.url)
            html_content = response.text
        except Exception as e:
            print(f"Error fetching URL: {e}", file=sys.stderr)
            return 1
    else:
        try:
            with open(args.file, "r") as f:
                html_content = f.read()
        except Exception as e:
            print(f"Error reading file: {e}", file=sys.stderr)
            return 1

    urls = extract_pinterest_images(html_content)

    if args.format == "json":
        generate_mock_json(urls, args.output)
    else:
        # Print in format suitable for mockPins
        for i, url in enumerate(urls, 1):
            print(f"ImageURL: {url},")

    return 0


if __name__ == "__main__":
    sys.exit(main())
