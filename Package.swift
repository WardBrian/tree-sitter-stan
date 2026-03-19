// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterStan",
    products: [
        .library(name: "TreeSitterStan", targets: ["TreeSitterStan"]),
    ],
    dependencies: [
        .package(name: "SwiftTreeSitter", url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterStan",
            dependencies: [],
            path: ".",
            sources: [
                "grammars/stan/src/parser.c",
                "grammars/stanfunctions/src/parser.c",
                // NOTE: if your language has an external scanner, add it here.
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterStanTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterStan",
            ],
            path: "bindings/swift/TreeSitterStanTests"
        )
    ],
    cLanguageStandard: .c11
)
