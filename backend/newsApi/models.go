package newsApi

type NewsResponse struct {
	Offset    int    `json:"offset"`
	Number    int    `json:"number"`
	Available int    `json:"available"`
	News      []News `json:"news"`
}

type News struct {
	ID            int      `json:"id"`
	Title         string   `json:"title"`
	Text          string   `json:"text"`
	Summary       string   `json:"summary"`
	URL           string   `json:"url"`
	Image         string   `json:"image"`
	Video         string   `json:"video"`
	PublishDate   string   `json:"publish_date"`
	Authors       []string `json:"authors"`
	Category      string   `json:"category"`
	Language      string   `json:"language"`
	SourceCountry string   `json:"source_country"`
	Sentiment     float64  `json:"sentiment"`
}

type ContradictionRequest struct {
	Name    string   `json:"name"`
	Content []string `json:"content"`
}

type ContradictionResponse struct {
	Sentence1 string `json:"sentence_1"`
	Sentence2 string `json:"sentence_2"`
	Summary   string `json:"reason"`
}

type Response struct {
	Subject        string                  `json:"subject"`
	Contradictions []ContradictionResponse `json:"contradictions"`
}
