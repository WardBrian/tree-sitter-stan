import XCTest
import SwiftTreeSitter
import TreeSitterStan

final class TreeSitterStanTests: XCTestCase {
    func testCanLoadStanGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_stan())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Stan grammar")
    }

    func testCanLoadStanFunctionsGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_stanfunctions())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Stan grammar")
    }
}
