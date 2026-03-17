from unittest import TestCase

from tree_sitter import Language, Parser
import tree_sitter_stan


class TestLanguage(TestCase):
    def test_can_load_stan_grammar(self):
        try:
            Parser(Language(tree_sitter_stan.language_stan()))
        except Exception:
            self.fail("Error loading Stan grammar")

    def test_can_load_stanfunctions_grammar(self):
        try:
            Parser(Language(tree_sitter_stan.language_stanfunctions()))
        except Exception:
            self.fail("Error loading Stan functions grammar")
