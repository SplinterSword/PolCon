package main

import (
	"net/http"

	"github.com/SplinterSword/PolCon/tree/main/backend/newsApi"
)

func getData(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("name")
	politicianInfo, err := newsApi.GetNews(name)

	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, map[string][]newsApi.ContradictionResponse{"message": politicianInfo})
}
