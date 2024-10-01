package tree_sitter_stan_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_stan "github.com/tree-sitter/tree-sitter-stan/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_stan.Language())
	if language == nil {
		t.Errorf("Error loading Stan grammar")
	}
}
