#!/bin/bash
# Script to set up environment and run Pinterest image extractor

# Error handling
set -e

# Define variables
VENV_DIR="venv"
REQUIREMENTS="beautifulsoup4 requests"

# Display usage function
show_usage() {
  echo "Usage: ./run.sh [OPTIONS]"
  echo "Extract Pinterest image URLs from HTML content"
  echo ""
  echo "Options:"
  echo "  --url URL     URL of webpage to extract images from"
  echo "  --file FILE   Local HTML file to extract images from"
  echo "  --json        Generate mock_pins.json file (default: text output)"
  echo "  --output FILE Output JSON filename (default: mock_pins.json)"
  echo "  --help        Display this help message"
  echo ""
  echo "Example:"
  echo "  ./run.sh --url https://pinterest.com/username/boardname"
  echo "  ./run.sh --file my_pinterest_page.html"
  echo "  ./run.sh --url https://pinterest.com/username/boardname --json"
}

# Check for help argument
if [[ "$1" == "--help" || "$1" == "-h" || $# -eq 0 ]]; then
  show_usage
  exit 0
fi

# Process args to check for json flag
JSON_OUTPUT=false
OUTPUT_FILE="mock_pins.json"
ARGS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
  --json)
    JSON_OUTPUT=true
    shift
    ;;
  --output)
    OUTPUT_FILE="$2"
    shift 2
    ;;
  *)
    ARGS+=("$1")
    shift
    ;;
  esac
done

# Check if virtual environment exists, create if not
if [ ! -d "$VENV_DIR" ]; then
  echo "Setting up virtual environment..."
  python3 -m venv "$VENV_DIR"
  echo "Virtual environment created at $VENV_DIR"
fi

# Activate virtual environment
source "$VENV_DIR/bin/activate"

# Install requirements if needed
echo "Installing requirements..."
pip install $REQUIREMENTS

# Run the Python script with all arguments passed through
echo "Running Pinterest URL extractor..."

if $JSON_OUTPUT; then
  # Run with JSON output
  python3 extract_pinterest_urls.py "${ARGS[@]}" --format json --output "$OUTPUT_FILE"
  echo "Created $OUTPUT_FILE for use with Pinshuffle test mode"
else
  # Run with text output
  python3 extract_pinterest_urls.py "${ARGS[@]}" --format text
fi

# Deactivate virtual environment
deactivate

echo "Done!"
