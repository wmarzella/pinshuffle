package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	
	"github.com/gofiber/fiber/v2"
)

// MockData represents the structure of our mock_pins.json file
type MockData struct {
	Pins   []MockPin            `json:"pins"`
	Boards map[string]MockBoard `json:"boards"`
}

type MockPin struct {
	Id       string    `json:"id"`
	Name     string    `json:"name"`
	AltText  string    `json:"altText"`
	Color    string    `json:"color"`
	ImageURL string    `json:"imageURL"`
	Board    MockBoard `json:"board"`
}

type MockBoard struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

// HandleIndex handles the homepage
func HandleIndex(c *fiber.Ctx) error {
	// Check for test mode query parameter
	if c.Query("testmode") == "true" {
		return HandleTestMode(c)
	}
	
	// Use the existing app strategy for normal operation
	model, err := app.Func(c)
	if err != nil {
		return err
	}
	return c.Render("layout", model)
}

// LoadMockData loads mock data from JSON file
func LoadMockData() (*MockData, error) {
	// Get the current working directory
	cwd, err := os.Getwd()
	if err != nil {
		return nil, fmt.Errorf("error getting current directory: %v", err)
	}
	
	// Read the JSON file
	filePath := filepath.Join(cwd, "mock_pins.json")
	jsonFile, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("error opening JSON file: %v", err)
	}
	defer jsonFile.Close()
	
	// Parse the JSON data
	byteValue, err := ioutil.ReadAll(jsonFile)
	if err != nil {
		return nil, fmt.Errorf("error reading JSON file: %v", err)
	}
	
	var mockData MockData
	if err := json.Unmarshal(byteValue, &mockData); err != nil {
		return nil, fmt.Errorf("error parsing JSON data: %v", err)
	}
	
	return &mockData, nil
}

// HandleTestMode renders the template with mock data for testing
func HandleTestMode(c *fiber.Ctx) error {
	// Load mock data from JSON file
	mockData, err := LoadMockData()
	if err != nil {
		return c.Status(500).SendString(fmt.Sprintf("Error loading mock data: %v", err))
	}
	
	// Convert mock pins to template pins
	templatePins := make([]TemplatePin, 0, len(mockData.Pins))
	for _, pin := range mockData.Pins {
		board := &TemplateBoard{
			Id:   pin.Board.Id,
			Name: pin.Board.Name,
		}
		
		templatePins = append(templatePins, TemplatePin{
			Id:       pin.Id,
			Name:     pin.Name,
			AltText:  pin.AltText,
			Color:    pin.Color,
			ImageURL: pin.ImageURL,
			Board:    board,
		})
	}
	
	// Convert mock boards to template boards
	templateBoards := make(map[string]*TemplateBoard)
	for id, board := range mockData.Boards {
		templateBoards[id] = &TemplateBoard{
			Id:   board.Id,
			Name: board.Name,
		}
	}
	
	// Create template data with mock pins
	return c.Render("layout", fiber.Map{
		"OAuthURL":      "/",
		"Authenticated": true, // Pretend we're authenticated
		"Pins":          templatePins,
		"Boards":        templateBoards,
		"User": TemplateUser{
			Name:    "Test User",
			IconURL: "https://via.placeholder.com/150",
			URL:     "#",
		},
		"UrlQuery": TemplateUrlQuery{
			Boards:          []string{"board1", "board2", "board3"},
			Max:             100,
			ImageResolution: 2,
		},
	})
}
