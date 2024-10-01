import XCTest
import SwiftTreeSitter
import TreeSitterStan

final class TreeSitterStanTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_stan())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Stan grammar")
    }
}
