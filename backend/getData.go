package main

import (
	"net/http"
)

func getData(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("name")
	politicianInfo, err := newsApi.getNews(name)

	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, map[string]string{"message": politicianInfo})
}
