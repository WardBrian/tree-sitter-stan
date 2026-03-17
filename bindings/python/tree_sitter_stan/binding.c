#include <Python.h>

typedef struct TSLanguage TSLanguage;

TSLanguage *tree_sitter_stan(void);
TSLanguage *tree_sitter_stanfunctions(void);

static PyObject* _binding_language_stan(PyObject *Py_UNUSED(self), PyObject *Py_UNUSED(args)) {
    return PyCapsule_New(tree_sitter_stan(), "tree_sitter.Language", NULL);
}

static PyObject* _binding_language_stanfunctions(PyObject *Py_UNUSED(self), PyObject *Py_UNUSED(args)) {
    return PyCapsule_New(tree_sitter_stanfunctions(), "tree_sitter.Language", NULL);
}

static struct PyModuleDef_Slot slots[] = {
#ifdef Py_GIL_DISABLED
    {Py_mod_gil, Py_MOD_GIL_NOT_USED},
#endif
    {0, NULL}
};

static PyMethodDef methods[] = {
    {"language_stan", _binding_language_stan, METH_NOARGS,
     "Get the tree-sitter language for Stan."},
    {"language_stanfunctions", _binding_language_stanfunctions, METH_NOARGS,
     "Get the tree-sitter language for Stan Functions."},
    {NULL, NULL, 0, NULL}
};

static struct PyModuleDef module = {
    .m_base = PyModuleDef_HEAD_INIT,
    .m_name = "_binding",
    .m_doc = NULL,
    .m_size = 0,
    .m_methods = methods,
    .m_slots = slots,
};

PyMODINIT_FUNC PyInit__binding(void) {
    return PyModuleDef_Init(&module);
}
