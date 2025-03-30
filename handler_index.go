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
	
	// Use the existing app strategy for normal operation
	model, err := app.Func(c)
	if err != nil {
		return err
	}
	return c.Render("layout", model)
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
			ImageURL: "https://i.pinimg.com/736x/f1/af/e3/f1afe333f6147ffa1954b12947929f23.jpg",
			Board:    &TemplateBoard{Id: "board1", Name: "Test Board 1"},
		},
		{
			Id:       "2",
			Name:     "Test Pin 2",
			AltText:  "Test pin 2 description",
			Color:    "#55ff55",
			ImageURL: "https://i.pinimg.com/736x/86/c4/86/86c486487eba97bfac0b111f7fab06c9.jpg",
			Board:    &TemplateBoard{Id: "board1", Name: "Test Board 1"},
		},
		{
			Id:       "3",
			Name:     "Test Pin 3",
			AltText:  "Test pin 3 description",
			Color:    "#5555ff",
			ImageURL: "https://i.pinimg.com/736x/0d/35/51/0d3551f92b96838c54a615e3124e7afc.jpg",
			Board:    &TemplateBoard{Id: "board2", Name: "Test Board 2"},
		},
		{
			Id:       "4",
			Name:     "Test Pin 4",
			AltText:  "Test pin 4 description",
			Color:    "#ffff55",
			ImageURL: "https://i.pinimg.com/736x/41/62/99/416299e20ad0de066d00dd4fe592ab18.jpg",
			Board:    &TemplateBoard{Id: "board2", Name: "Test Board 2"},
		},
		{
			Id:       "5",
			Name:     "Test Pin 5",
			AltText:  "Test pin 5 description",
			Color:    "#ff55ff",
			ImageURL: "https://i.pinimg.com/736x/4d/90/80/4d90802c98979564de2b6656434d967f.jpg",
			Board:    &TemplateBoard{Id: "board3", Name: "Test Board 3"},
		},
	}

	// Create map of boards instead of slice
	mockBoards := make(map[string]*TemplateBoard)
	mockBoards["board1"] = &TemplateBoard{Id: "board1", Name: "Test Board 1"}
	mockBoards["board2"] = &TemplateBoard{Id: "board2", Name: "Test Board 2"}
	mockBoards["board3"] = &TemplateBoard{Id: "board3", Name: "Test Board 3"}

	// Create template data with mock pins
	return c.Render("layout", fiber.Map{
		"OAuthURL":      "/",
		"Authenticated": true, // Pretend we're authenticated
		"Pins":          mockPins,
		"Boards":        mockBoards,
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
