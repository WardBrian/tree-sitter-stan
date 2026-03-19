fn main() {
    let root_dir = std::path::Path::new(".");
    let grammars_dir = root_dir.join("grammars");
    let stan_dir = grammars_dir.join("stan").join("src");
    let stanfunctions_dir = grammars_dir.join("stanfunctions").join("src");

    let mut c_config = cc::Build::new();
    c_config.std("c11").include(&stan_dir);

    #[cfg(target_env = "msvc")]
    c_config.flag("-utf-8");

    if std::env::var("TARGET").unwrap() == "wasm32-unknown-unknown" {
        let Ok(wasm_headers) = std::env::var("DEP_TREE_SITTER_LANGUAGE_WASM_HEADERS") else {
            panic!("Environment variable DEP_TREE_SITTER_LANGUAGE_WASM_HEADERS must be set by the language crate");
        };
        let Ok(wasm_src) =
            std::env::var("DEP_TREE_SITTER_LANGUAGE_WASM_SRC").map(std::path::PathBuf::from)
        else {
            panic!("Environment variable DEP_TREE_SITTER_LANGUAGE_WASM_SRC must be set by the language crate");
        };

        c_config.include(&wasm_headers);
        c_config.files([
            wasm_src.join("stdio.c"),
            wasm_src.join("stdlib.c"),
            wasm_src.join("string.c"),
        ]);
    }

    let stan_parser_path = stan_dir.join("parser.c");
    c_config.file(&stan_parser_path);
    println!(
        "cargo:rerun-if-changed={}",
        stan_parser_path.to_str().unwrap()
    );

    let stanfunctions_parser_path = stanfunctions_dir.join("parser.c");
    c_config.file(&stanfunctions_parser_path);
    println!(
        "cargo:rerun-if-changed={}",
        stanfunctions_parser_path.to_str().unwrap()
    );

    c_config.compile("tree-sitter-stan");

    println!("cargo:rustc-check-cfg=cfg(with_highlights_query)");
    if !"queries/highlights.scm".is_empty()
        && std::path::Path::new("queries/highlights.scm").exists()
    {
        println!("cargo:rustc-cfg=with_highlights_query");
    }
    println!("cargo:rustc-check-cfg=cfg(with_injections_query)");
    if !"queries/injections.scm".is_empty()
        && std::path::Path::new("queries/injections.scm").exists()
    {
        println!("cargo:rustc-cfg=with_injections_query");
    }
    println!("cargo:rustc-check-cfg=cfg(with_locals_query)");
    if !"queries/locals.scm".is_empty() && std::path::Path::new("queries/locals.scm").exists() {
        println!("cargo:rustc-cfg=with_locals_query");
    }
    println!("cargo:rustc-check-cfg=cfg(with_tags_query)");
    if !"queries/tags.scm".is_empty() && std::path::Path::new("queries/tags.scm").exists() {
        println!("cargo:rustc-cfg=with_tags_query");
    }
}
