#include <napi.h>

typedef struct TSLanguage TSLanguage;

extern "C" TSLanguage *tree_sitter_stan();
extern "C" TSLanguage *tree_sitter_stanfunctions();

// "tree-sitter", "language" hashed with BLAKE2
const napi_type_tag LANGUAGE_TYPE_TAG = {
    0x8AF2E5212AD58ABF, 0xD5006CAD83ABBA16
};

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    auto stan = Napi::Object::New(env);
    stan["name"] = Napi::String::New(env, "stan");
    auto stan_language = Napi::External<TSLanguage>::New(env, tree_sitter_stan());
    stan_language.TypeTag(&LANGUAGE_TYPE_TAG);
    stan["language"] = stan_language;

    auto stanfunctions = Napi::Object::New(env);
    stan["name"] = Napi::String::New(env, "stanfunctions");
    auto stanfunctions_language = Napi::External<TSLanguage>::New(env, tree_sitter_stanfunctions());
    stanfunctions_language.TypeTag(&LANGUAGE_TYPE_TAG);
    stanfunctions["language"] = stanfunctions_language;

    exports["stan"] = stan;
    exports["stanfunctions"] = stanfunctions;
    return exports;
}

NODE_API_MODULE(tree_sitter_stan_binding, Init)
