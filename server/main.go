package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gomarkdown/markdown"
)


type BlogPost struct {
  Title string `json:"title"`
  Content string `json:"content"`
  Category string `json:"category"`
}


func getBlogs(w http.ResponseWriter, r *http.Request){
  w.Header().Set("Content-Type", "application/json")
  w.Header().Set("Access-Control-Allow-Origin", "*")

  blogs, err := readBlogPosts("../blogs/")
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }
  json.NewEncoder(w).Encode(blogs)
}

func readBlogPosts(dir string) ([]BlogPost, error){
  var blogs []BlogPost

  err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
    if err != nil {
      return err
    }

    if !info.IsDir() && strings.HasSuffix(info.Name(), ".md"){
      content, err := os.ReadFile(path)
      if err != nil {
        return err
      }
      title := strings.TrimSuffix(info.Name(), filepath.Ext(info.Name()))
      category := filepath.Base(filepath.Dir(path))

      htmlContent := markdown.ToHTML(content, nil, nil)
      
      blogs = append(blogs, BlogPost{
        Title: title,
        Content: string(htmlContent),
        Category: category,
      })
    }
    return nil
  })
  return blogs, err
}


func main(){
  http.HandleFunc("/api/blogs", getBlogs)
  fmt.Println("Server is running on http://localhost:8080")
  log.Fatal(http.ListenAndServe(":8080", nil))
}

