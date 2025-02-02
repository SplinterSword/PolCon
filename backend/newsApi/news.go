package newsApi

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

func GetNews(name string) ([]ContradictionResponse, error) {

	Query := strings.ToLower(name)

	searchQuery := strings.ReplaceAll(Query, " ", "+")

	url := fmt.Sprintf("https://api.worldnewsapi.com/search-news?text=%s&language=en&earliest-publish-date=2025-01-01", searchQuery)

	apiKey := "35b8980f317a4cc6929f41c831238763"

	// Create a new request using http
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return []ContradictionResponse{}, err
	}

	// Add API key in header
	req.Header.Add("x-api-key", apiKey)

	// Send req using http Client
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return []ContradictionResponse{}, err
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return []ContradictionResponse{}, err
	}

	// Unmarshal the response body
	data := NewsResponse{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		return []ContradictionResponse{}, err
	}

	// Write a Json File
	err = saveCSV(data.News)
	if err != nil {
		return []ContradictionResponse{}, err
	}

	// Get Contradictions
	contradiction, err := detectContradictionAPI(data.News, name)
	if err != nil {
		return []ContradictionResponse{}, err
	}

	return contradiction, nil
}
