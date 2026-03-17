package tree_sitter_stan_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_stan "github.com/wardbrian/tree-sitter-stan/bindings/go"
)

func TestCanLoadStanGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_stan.LanguageStan())
	if language == nil {
		t.Errorf("Error loading Stan grammar")
	}
}


func TestCanLoadStanFunctionsGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_stan.LanguageStanFunctions())
	if language == nil {
		t.Errorf("Error loading Stan grammar")
	}
}
