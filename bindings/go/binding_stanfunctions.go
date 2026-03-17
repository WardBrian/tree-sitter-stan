package tree_sitter_stan

// #cgo CFLAGS: -std=c11 -fPIC
// #include "../../grammars/stanfunctions/src/parser.c"
import "C"

import "unsafe"

// Get the tree-sitter Language for this grammar.
func LanguageStanFunctions() unsafe.Pointer {
	return unsafe.Pointer(C.tree_sitter_stanfunctions())
}
