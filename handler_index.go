package main

import (
	"github.com/gofiber/fiber/v2"
)

// HandleIndex handles the homepage
func HandleIndex(c *fiber.Ctx) error {
	// Check for test mode query parameter
	if c.Query("testmode") == "true" {
		return HandleTestMode(c)
	}
	
	return TemplateHandler(c)
}

// HandleTestMode renders the template with mock data for testing
func HandleTestMode(c *fiber.Ctx) error {
	// Create mock data for testing the slideshow
	mockPins := []TemplatePin{
		{
			Id:       "1",
			Name:     "Test Pin 1",
			AltText:  "Test pin 1 description",
			Color:    "#ff5555",
			ImageURL: "https://via.placeholder.com/600x800/ff5555/ffffff?text=Test+Pin+1",
			Board:    &TemplateBoard{Id: "board1", Name: "Test Board 1"},
		},
		{
			Id:       "2",
			Name:     "Test Pin 2",
			AltText:  "Test pin 2 description",
			Color:    "#55ff55",
			ImageURL: "https://via.placeholder.com/600x800/55ff55/ffffff?text=Test+Pin+2",
			Board:    &TemplateBoard{Id: "board1", Name: "Test Board 1"},
		},
		{
			Id:       "3",
			Name:     "Test Pin 3",
			AltText:  "Test pin 3 description",
			Color:    "#5555ff",
			ImageURL: "https://via.placeholder.com/600x800/5555ff/ffffff?text=Test+Pin+3",
			Board:    &TemplateBoard{Id: "board2", Name: "Test Board 2"},
		},
		{
			Id:       "4",
			Name:     "Test Pin 4",
			AltText:  "Test pin 4 description",
			Color:    "#ffff55",
			ImageURL: "https://via.placeholder.com/600x800/ffff55/ffffff?text=Test+Pin+4",
			Board:    &TemplateBoard{Id: "board2", Name: "Test Board 2"},
		},
		{
			Id:       "5",
			Name:     "Test Pin 5",
			AltText:  "Test pin 5 description",
			Color:    "#ff55ff",
			ImageURL: "https://via.placeholder.com/600x800/ff55ff/ffffff?text=Test+Pin+5",
			Board:    &TemplateBoard{Id: "board3", Name: "Test Board 3"},
		},
	}

	mockBoards := []*TemplateBoard{
		{Id: "board1", Name: "Test Board 1"},
		{Id: "board2", Name: "Test Board 2"},
		{Id: "board3", Name: "Test Board 3"},
	}

	// Create template data with mock pins
	return c.Render("layout", fiber.Map{
		"OAuthURL":      "/",
		"Authenticated": true, // Pretend we're authenticated
		"Pins":          mockPins,
		"Boards":        mockBoards,
		"UrlQuery": TemplateUrlQuery{
			Boards:          []string{"board1", "board2", "board3"},
			Max:             100,
			ImageResolution: 2,
		},
	})
}

func indexHandler(c *fiber.Ctx) error {
	return c.Render("index", fiber.Map{
		"Title":   "Hello, World!",
		"Message": "👋 Hello, World!",
	})
}
