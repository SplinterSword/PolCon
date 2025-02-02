package newsApi

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func detectContradictionAPI(news []News, name string) ([]ContradictionResponse, error) {
	url := "http://localhost:5000/analyze"

	payload := ContradictionRequest{
		Name:    name,
		Content: []string{},
	}

	for _, n := range news {
		payload.Content = append(payload.Content, n.Text)
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return []ContradictionResponse{}, err
	}

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return []ContradictionResponse{}, err
	}
	defer resp.Body.Close()

	// Decode response
	var result Response

	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		fmt.Println(err.Error())
		return []ContradictionResponse{}, err
	}

	return result.Contradictions, nil
}
