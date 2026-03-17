//! This crate provides Stan language support for the [tree-sitter] parsing library.
//!
//! Typically, you will use the [`LANGUAGE`] constant to add this language to a
//! tree-sitter [`Parser`], and then use the parser to parse some code:
//!
//! ```
//! let code = r#"
//! "#;
//! let mut parser = tree_sitter::Parser::new();
//! let language = tree_sitter_stan::LANGUAGE_STAN;
//! parser
//!     .set_language(&language.into())
//!     .expect("Error loading Stan parser");
//! let tree = parser.parse(code, None).unwrap();
//! assert!(!tree.root_node().has_error());
//! ```
//!
//! [`Parser`]: https://docs.rs/tree-sitter/0.26.3/tree_sitter/struct.Parser.html
//! [tree-sitter]: https://tree-sitter.github.io/

use tree_sitter_language::LanguageFn;

extern "C" {
    fn tree_sitter_stan() -> *const ();
    fn tree_sitter_stanfunctions() -> *const ();
}

/// The tree-sitter [`LanguageFn`] for Stan.
pub const LANGUAGE_STAN: LanguageFn = unsafe { LanguageFn::from_raw(tree_sitter_stan) };

/// The tree-sitter [`LanguageFn`] for Stan.
pub const LANGUAGE_STANFUNCTIONS: LanguageFn =
    unsafe { LanguageFn::from_raw(tree_sitter_stanfunctions) };

/// The content of the [`node-types.json`] file for this grammar.
///
/// [`node-types.json`]: https://tree-sitter.github.io/tree-sitter/using-parsers/6-static-node-types
pub const STAN_NODE_TYPES: &str = include_str!("../../grammars/stan/src/node-types.json");

/// The content of the [`node-types.json`] file for this grammar.
///
/// [`node-types.json`]: https://tree-sitter.github.io/tree-sitter/using-parsers/6-static-node-types
pub const STANFUNCTIONS_NODE_TYPES: &str =
    include_str!("../../grammars/stanfunctions/src/node-types.json");

#[cfg(with_highlights_query)]
/// The syntax highlighting query for this grammar.
pub const HIGHLIGHTS_QUERY: &str = include_str!("../../queries/highlights.scm");

#[cfg(with_injections_query)]
/// The language injection query for this grammar.
pub const INJECTIONS_QUERY: &str = include_str!("../../queries/injections.scm");

#[cfg(with_locals_query)]
/// The local variable query for this grammar.
pub const LOCALS_QUERY: &str = include_str!("../../queries/locals.scm");

#[cfg(with_tags_query)]
/// The symbol tagging query for this grammar.
pub const TAGS_QUERY: &str = include_str!("../../queries/tags.scm");

#[cfg(test)]
mod tests {
    #[test]
    fn test_can_load_stan_grammar() {
        let mut parser = tree_sitter::Parser::new();
        parser
            .set_language(&super::LANGUAGE_STAN.into())
            .expect("Error loading Stan parser");
    }

    #[test]
    fn test_can_load_stanfunctions_grammar() {
        let mut parser = tree_sitter::Parser::new();
        parser
            .set_language(&super::LANGUAGE_STANFUNCTIONS.into())
            .expect("Error loading Stan parser");
    }
}
