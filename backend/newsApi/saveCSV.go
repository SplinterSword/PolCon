package newsApi

import (
	"encoding/csv"
	"fmt"
	"os"
)

func saveCSV(news []News) error {

	file, err := os.Create("data.csv")

	if err != nil {
		return err
	}

	defer file.Close()

	writer := csv.NewWriter(file)

	defer writer.Flush()

	headings := []string{"title", "text", "summary"}

	err = writer.Write(headings)

	if err != nil {
		return err
	}

	for _, n := range news {
		fmt.Println("Title: ", n.Title)
		fmt.Println("Summary: ", n.Summary)
		fmt.Println("Text: ", n.Text)

		err = writer.Write([]string{n.Title, n.Text, n.Summary})

		if err != nil {
			return err
		}

		fmt.Println()
	}

	return nil
}
