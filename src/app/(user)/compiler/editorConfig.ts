import type * as Monaco from "monaco-editor";
import {
  pythonSnippets,
  javaSnippets,
  cSnippets,
  cppSnippets,
  jsSnippets,
  createSnippetCompletionItem,
} from './snippets';

// Store disposables to clean up providers
const disposables: Monaco.IDisposable[] = [];

/**
 * Clears all registered completion providers
 */
export const clearCompletionProviders = () => {
  disposables.forEach(disposable => disposable.dispose());
  disposables.length = 0;
};

/**
 * Registers custom completion providers for all supported languages
 * Provides IntelliSense for keywords and common functions/methods
 */
export const registerCompletionProviders = (
  monaco: typeof Monaco, 
  intelliSenseEnabled: boolean = true, 
  snippetsEnabled: boolean = true
) => {
  // Clear any existing providers first
  clearCompletionProviders();
  // Python completion provider
  const pythonProvider = monaco.languages.registerCompletionItemProvider('python', {
    triggerCharacters: ['.', '_'],
    provideCompletionItems: (model, position) => {
      // Only provide suggestions if the current model is Python
      const modelLanguage = model.getLanguageId();
      console.log('[Python Provider] Model language:', modelLanguage, 'Expected: python');
      if (modelLanguage !== 'python') {
        return { suggestions: [] };
      }

      // Don't provide suggestions if features are disabled
      if (!intelliSenseEnabled && !snippetsEnabled) {
        return { suggestions: [] };
      }

      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const pythonKeywords = [
        'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
        'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally',
        'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal',
        'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield',
        'match', 'case'
      ];
      
      const pythonBuiltins = [
        // Built-in functions
        'abs', 'aiter', 'all', 'any', 'anext', 'ascii', 'bin', 'bool', 'breakpoint',
        'bytearray', 'bytes', 'callable', 'chr', 'classmethod', 'compile', 'complex',
        'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval', 'exec', 'filter',
        'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash',
        'help', 'hex', 'id', 'input', 'int', 'isinstance', 'issubclass', 'iter',
        'len', 'list', 'locals', 'map', 'max', 'memoryview', 'min', 'next', 'object',
        'oct', 'open', 'ord', 'pow', 'print', 'property', 'range', 'repr', 'reversed',
        'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str', 'sum',
        'super', 'tuple', 'type', 'vars', 'zip', '__import__',
        // Common exceptions
        'Exception', 'ValueError', 'TypeError', 'KeyError', 'IndexError', 'NameError',
        'AttributeError', 'RuntimeError', 'ImportError', 'IOError', 'ZeroDivisionError',
        'FileNotFoundError', 'StopIteration', 'KeyboardInterrupt',
        // String methods
        'append', 'extend', 'insert', 'remove', 'pop', 'clear', 'index', 'count',
        'sort', 'reverse', 'copy', 'upper', 'lower', 'capitalize', 'title', 'strip',
        'lstrip', 'rstrip', 'split', 'join', 'replace', 'find', 'startswith', 'endswith',
        'isdigit', 'isalpha', 'isalnum', 'islower', 'isupper', 'isspace',
        // Dict methods
        'keys', 'values', 'items', 'get', 'update', 'setdefault', 'fromkeys',
        // File methods
        'read', 'write', 'readline', 'readlines', 'writelines', 'close', 'seek', 'tell',
        // Other common
        'self', 'cls', '__init__', '__str__', '__repr__', '__len__', '__getitem__',
        '__setitem__', '__delitem__', '__iter__', '__next__', '__enter__', '__exit__',
        '__name__', '__main__', '__file__', '__doc__'
      ];

      const suggestions = [
        // Add keywords and built-ins only if IntelliSense is enabled
        ...(intelliSenseEnabled ? pythonKeywords.map(keyword => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          detail: 'Python keyword',
          range: range,
        })) : []),
        ...(intelliSenseEnabled ? pythonBuiltins.map(builtin => ({
          label: builtin,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: builtin,
          detail: 'Python built-in',
          range: range,
        })) : []),
        // Add Python snippets only if Snippets are enabled
        ...(snippetsEnabled ? pythonSnippets.map(snippet => createSnippetCompletionItem(snippet, monaco, range)) : [])
      ];

      return { suggestions };
    }
  });
  disposables.push(pythonProvider);

  // Java completion provider
  const javaProvider = monaco.languages.registerCompletionItemProvider('java', {
    triggerCharacters: ['.'],
    provideCompletionItems: (model, position) => {
      // Only provide suggestions if the current model is Java
      const modelLanguage = model.getLanguageId();
      console.log('[Java Provider] Model language:', modelLanguage, 'Expected: java');
      if (modelLanguage !== 'java') {
        return { suggestions: [] };
      }

      // Don't provide suggestions if features are disabled
      if (!intelliSenseEnabled && !snippetsEnabled) {
        return { suggestions: [] };
      }

      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const javaKeywords = [
        'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
        'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
        'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements',
        'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package',
        'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp',
        'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient',
        'try', 'void', 'volatile', 'while', 'true', 'false', 'null', 'var', 'yield',
        'record', 'sealed', 'permits', 'non-sealed'
      ];

      const javaCommon = [
        // Common classes
        'System', 'String', 'Integer', 'Double', 'Boolean', 'Long', 'Float', 'Short',
        'Byte', 'Character', 'Object', 'Class', 'Math', 'Number',
        // Collections
        'ArrayList', 'LinkedList', 'Vector', 'Stack', 'HashMap', 'HashSet', 'TreeMap',
        'TreeSet', 'LinkedHashMap', 'LinkedHashSet', 'Queue', 'Deque', 'PriorityQueue',
        'List', 'Set', 'Map', 'Collection', 'Collections', 'Arrays', 'Iterator',
        'Comparator', 'Comparable',
        // I/O
        'Scanner', 'BufferedReader', 'InputStreamReader', 'PrintWriter', 'FileReader',
        'FileWriter', 'BufferedWriter', 'File', 'InputStream', 'OutputStream',
        'FileInputStream', 'FileOutputStream',
        // Exceptions
        'Exception', 'RuntimeException', 'IOException', 'NullPointerException',
        'IndexOutOfBoundsException', 'IllegalArgumentException', 'ArithmeticException',
        'ClassNotFoundException', 'NumberFormatException', 'InterruptedException',
        // Threading
        'Thread', 'Runnable', 'Callable', 'ExecutorService', 'Future',
        // String utilities
        'StringBuilder', 'StringBuffer', 'StringTokenizer', 'Pattern', 'Matcher',
        // Other common
        'Random', 'Date', 'Calendar', 'LocalDate', 'LocalDateTime', 'Optional',
        'Stream', 'Collectors', 'Function', 'Predicate', 'Consumer', 'Supplier',
        // System methods
        'out', 'in', 'err', 'println', 'print', 'printf', 'format', 'length',
        'equals', 'hashCode', 'toString', 'compareTo', 'clone', 'substring',
        'charAt', 'indexOf', 'contains', 'startsWith', 'endsWith', 'split',
        'trim', 'toLowerCase', 'toUpperCase', 'replace', 'replaceAll',
        'add', 'remove', 'get', 'set', 'size', 'isEmpty', 'clear', 'sort',
        'reverse', 'toArray', 'iterator', 'hasNext', 'next', 'put', 'keySet',
        'values', 'entrySet', 'containsKey', 'containsValue'
      ];

      const suggestions = [
        // Add keywords only if IntelliSense is enabled
        ...(intelliSenseEnabled ? javaKeywords.map(keyword => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          detail: 'Java keyword',
          range: range,
        })) : []),
        ...(intelliSenseEnabled ? javaCommon.map(common => ({
          label: common,
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: common,
          detail: 'Java class',
          range: range,
        })) : []),
        // Add Java snippets only if Snippets are enabled
        ...(snippetsEnabled ? javaSnippets.map(snippet => createSnippetCompletionItem(snippet, monaco, range)) : [])
      ];

      return { suggestions };
    }
  });
  disposables.push(javaProvider);

  // C completion provider
  const cProvider = monaco.languages.registerCompletionItemProvider('c', {
    triggerCharacters: ['.', '>'],
    provideCompletionItems: (model, position) => {
      // Only provide suggestions if the current model is C
      const modelLanguage = model.getLanguageId();
      console.log('[C Provider] Model language:', modelLanguage, 'Expected: c');
      if (modelLanguage !== 'c') {
        return { suggestions: [] };
      }

      // Don't provide suggestions if features are disabled
      if (!intelliSenseEnabled && !snippetsEnabled) {
        return { suggestions: [] };
      }

      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const cKeywords = [
        'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do',
        'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if', 'int',
        'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static',
        'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while',
        '_Alignas', '_Alignof', '_Atomic', '_Bool', '_Complex', '_Generic', '_Imaginary',
        '_Noreturn', '_Static_assert', '_Thread_local', 'inline', 'restrict'
      ];

      const cFunctions = [
        // stdio.h
        'printf', 'scanf', 'fprintf', 'fscanf', 'sprintf', 'sscanf', 'snprintf',
        'vprintf', 'vfprintf', 'vsprintf', 'vsnprintf', 'puts', 'gets', 'putchar',
        'getchar', 'fgets', 'fputs', 'fputc', 'fgetc', 'ungetc', 'fopen', 'fclose',
        'fread', 'fwrite', 'fseek', 'ftell', 'rewind', 'feof', 'ferror', 'clearerr',
        'fflush', 'freopen', 'remove', 'rename', 'tmpfile', 'tmpnam', 'perror',
        // stdlib.h
        'malloc', 'calloc', 'realloc', 'free', 'abort', 'exit', 'atexit', 'system',
        'getenv', 'abs', 'labs', 'llabs', 'div', 'ldiv', 'lldiv', 'atoi', 'atol',
        'atoll', 'atof', 'strtol', 'strtoll', 'strtoul', 'strtoull', 'strtod',
        'strtof', 'strtold', 'rand', 'srand', 'qsort', 'bsearch',
        // string.h
        'strlen', 'strcpy', 'strncpy', 'strcat', 'strncat', 'strcmp', 'strncmp',
        'strchr', 'strrchr', 'strstr', 'strtok', 'strspn', 'strcspn', 'strpbrk',
        'memcpy', 'memmove', 'memset', 'memcmp', 'memchr', 'strcoll', 'strxfrm',
        'strerror',
        // math.h
        'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2', 'sinh', 'cosh', 'tanh',
        'exp', 'log', 'log10', 'pow', 'sqrt', 'ceil', 'floor', 'fabs', 'fmod',
        'ldexp', 'frexp', 'modf', 'hypot', 'cbrt', 'erf', 'erfc', 'gamma', 'lgamma',
        // ctype.h
        'isalnum', 'isalpha', 'isdigit', 'isxdigit', 'islower', 'isupper', 'isspace',
        'isblank', 'isprint', 'isgraph', 'ispunct', 'iscntrl', 'tolower', 'toupper',
        // time.h
        'time', 'clock', 'difftime', 'mktime', 'asctime', 'ctime', 'gmtime', 'localtime',
        'strftime',
        // assert.h
        'assert',
        // Common types
        'NULL', 'EOF', 'FILE', 'size_t', 'ptrdiff_t', 'wchar_t', 'true', 'false'
      ];

      const suggestions = [
        // Add keywords only if IntelliSense is enabled
        ...(intelliSenseEnabled ? cKeywords.map(keyword => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          detail: 'C keyword',
          range: range,
        })) : []),
        ...(intelliSenseEnabled ? cFunctions.map(func => ({
          label: func,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: func,
          detail: 'C standard library',
          range: range,
        })) : []),
        // Add C snippets only if Snippets are enabled
        ...(snippetsEnabled ? cSnippets.map(snippet => createSnippetCompletionItem(snippet, monaco, range)) : [])
      ];

      return { suggestions };
    }
  });
  disposables.push(cProvider);

  // C++ completion provider
  const cppProvider = monaco.languages.registerCompletionItemProvider('cpp', {
    triggerCharacters: ['.', ':', '>'],
    provideCompletionItems: (model, position) => {
      // Only provide suggestions if the current model is C++
      const modelLanguage = model.getLanguageId();
      console.log('[C++ Provider] Model language:', modelLanguage, 'Expected: cpp');
      if (modelLanguage !== 'cpp') {
        return { suggestions: [] };
      }

      // Don't provide suggestions if features are disabled
      if (!intelliSenseEnabled && !snippetsEnabled) {
        return { suggestions: [] };
      }

      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const cppKeywords = [
        'alignas', 'alignof', 'and', 'and_eq', 'asm', 'auto', 'bitand', 'bitor',
        'bool', 'break', 'case', 'catch', 'char', 'char8_t', 'char16_t', 'char32_t',
        'class', 'compl', 'concept', 'const', 'consteval', 'constexpr', 'constinit',
        'const_cast', 'continue', 'co_await', 'co_return', 'co_yield', 'decltype',
        'default', 'delete', 'do', 'double', 'dynamic_cast', 'else', 'enum', 'explicit',
        'export', 'extern', 'false', 'float', 'for', 'friend', 'goto', 'if', 'inline',
        'int', 'long', 'mutable', 'namespace', 'new', 'noexcept', 'not', 'not_eq',
        'nullptr', 'operator', 'or', 'or_eq', 'private', 'protected', 'public',
        'register', 'reinterpret_cast', 'requires', 'return', 'short', 'signed',
        'sizeof', 'static', 'static_assert', 'static_cast', 'struct', 'switch',
        'template', 'this', 'thread_local', 'throw', 'true', 'try', 'typedef',
        'typeid', 'typename', 'union', 'unsigned', 'using', 'virtual', 'void',
        'volatile', 'wchar_t', 'while', 'xor', 'xor_eq'
      ];

      const cppStd = [
        // I/O streams
        'cout', 'cin', 'cerr', 'clog', 'wcout', 'wcin', 'wcerr', 'wclog',
        'endl', 'ends', 'flush', 'ws', 'boolalpha', 'noboolalpha', 'showbase',
        'noshowbase', 'showpoint', 'noshowpoint', 'showpos', 'noshowpos',
        'skipws', 'noskipws', 'uppercase', 'nouppercase', 'left', 'right',
        'internal', 'dec', 'hex', 'oct', 'fixed', 'scientific',
        // Containers
        'vector', 'list', 'deque', 'array', 'forward_list', 'set', 'multiset',
        'map', 'multimap', 'unordered_set', 'unordered_multiset', 'unordered_map',
        'unordered_multimap', 'stack', 'queue', 'priority_queue', 'bitset',
        // Strings
        'string', 'wstring', 'u8string', 'u16string', 'u32string', 'string_view',
        'wstring_view', 'u8string_view', 'u16string_view', 'u32string_view',
        // Utilities
        'pair', 'tuple', 'optional', 'variant', 'any', 'expected',
        // Smart pointers
        'unique_ptr', 'shared_ptr', 'weak_ptr', 'auto_ptr', 'make_unique',
        'make_shared',
        // Algorithms
        'sort', 'stable_sort', 'partial_sort', 'nth_element', 'find', 'find_if',
        'find_if_not', 'count', 'count_if', 'search', 'binary_search', 'lower_bound',
        'upper_bound', 'equal_range', 'merge', 'reverse', 'rotate', 'shuffle',
        'random_shuffle', 'unique', 'remove', 'remove_if', 'replace', 'replace_if',
        'copy', 'copy_if', 'copy_backward', 'move', 'move_backward', 'fill',
        'fill_n', 'generate', 'generate_n', 'transform', 'for_each', 'accumulate',
        'inner_product', 'partial_sum', 'adjacent_difference', 'min', 'max',
        'minmax', 'min_element', 'max_element', 'minmax_element', 'swap',
        'iter_swap', 'swap_ranges', 'clamp',
        // Container methods
        'push_back', 'pop_back', 'push_front', 'pop_front', 'emplace_back',
        'emplace_front', 'emplace', 'insert', 'erase', 'clear', 'size', 'empty',
        'resize', 'reserve', 'capacity', 'shrink_to_fit', 'begin', 'end',
        'rbegin', 'rend', 'cbegin', 'cend', 'crbegin', 'crend', 'front', 'back',
        'at', 'data', 'assign', 'splice', 'remove', 'remove_if', 'reverse',
        'unique', 'sort', 'merge', 'find', 'count', 'contains',
        // String methods
        'append', 'substr', 'length', 'c_str', 'compare', 'find', 'rfind',
        'find_first_of', 'find_last_of', 'find_first_not_of', 'find_last_not_of',
        'replace', 'erase', 'insert', 'to_string', 'to_wstring', 'stoi', 'stol',
        'stoll', 'stoul', 'stoull', 'stof', 'stod', 'stold',
        // Iterators
        'iterator', 'const_iterator', 'reverse_iterator', 'const_reverse_iterator',
        'advance', 'distance', 'next', 'prev',
        // Functors & Function objects
        'function', 'bind', 'ref', 'cref', 'mem_fn', 'plus', 'minus', 'multiplies',
        'divides', 'modulus', 'negate', 'equal_to', 'not_equal_to', 'greater',
        'less', 'greater_equal', 'less_equal', 'logical_and', 'logical_or',
        'logical_not',
        // Threading
        'thread', 'mutex', 'recursive_mutex', 'timed_mutex', 'shared_mutex',
        'lock_guard', 'unique_lock', 'shared_lock', 'condition_variable',
        'future', 'promise', 'async', 'packaged_task',
        // Memory
        'allocator', 'allocator_traits', 'addressof', 'construct_at', 'destroy_at',
        // Exceptions
        'exception', 'bad_alloc', 'bad_cast', 'bad_typeid', 'bad_exception',
        'logic_error', 'domain_error', 'invalid_argument', 'length_error',
        'out_of_range', 'runtime_error', 'range_error', 'overflow_error',
        'underflow_error',
        // Type traits
        'is_same', 'is_base_of', 'is_convertible', 'is_arithmetic', 'is_integral',
        'is_floating_point', 'is_array', 'is_pointer', 'is_reference', 'is_const',
        'is_volatile', 'remove_const', 'remove_reference', 'add_const', 'add_reference',
        'decay', 'enable_if', 'conditional',
        // Namespace std
        'std', 'nullptr_t', 'size_t', 'ptrdiff_t', 'max_align_t', 'byte'
      ];

      const suggestions = [
        // Add keywords only if IntelliSense is enabled
        ...(intelliSenseEnabled ? cppKeywords.map(keyword => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          detail: 'C++ keyword',
          range: range,
        })) : []),
        ...(intelliSenseEnabled ? cppStd.map(std => ({
          label: std,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: std,
          detail: 'C++ STL',
          range: range,
        })) : []),
        // Add C++ snippets only if Snippets are enabled
        ...(snippetsEnabled ? cppSnippets.map(snippet => createSnippetCompletionItem(snippet, monaco, range)) : [])
      ];

      return { suggestions };
    }
  });
  disposables.push(cppProvider);

  // JavaScript completion provider
  const jsProvider = monaco.languages.registerCompletionItemProvider('javascript', {
    triggerCharacters: ['.'],
    provideCompletionItems: (model, position) => {
      // Only provide suggestions if the current model is JavaScript
      const modelLanguage = model.getLanguageId();
      console.log('[JavaScript Provider] Model language:', modelLanguage, 'Expected: javascript');
      if (modelLanguage !== 'javascript') {
        return { suggestions: [] };
      }

      // Don't provide suggestions if features are disabled
      if (!intelliSenseEnabled && !snippetsEnabled) {
        return { suggestions: [] };
      }

      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const jsKeywords = [
        'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
        'default', 'delete', 'do', 'else', 'export', 'extends', 'finally', 'for',
        'function', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'return',
        'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while',
        'with', 'yield', 'async', 'from', 'as', 'static', 'get', 'set', 'of',
        'null', 'undefined', 'true', 'false', 'NaN', 'Infinity'
      ];

      const jsMethods = [
        // Console
        'console', 'log', 'error', 'warn', 'info', 'debug', 'trace', 'table',
        'assert', 'clear', 'count', 'countReset', 'dir', 'dirxml', 'group',
        'groupCollapsed', 'groupEnd', 'time', 'timeEnd', 'timeLog', 'profile',
        'profileEnd',
        // Array methods
        'push', 'pop', 'shift', 'unshift', 'slice', 'splice', 'concat', 'join',
        'reverse', 'sort', 'fill', 'copyWithin', 'flat', 'flatMap',
        'map', 'filter', 'reduce', 'reduceRight', 'forEach', 'find', 'findIndex',
        'findLast', 'findLastIndex', 'some', 'every', 'includes', 'indexOf',
        'lastIndexOf', 'entries', 'keys', 'values', 'at', 'toSorted', 'toReversed',
        'toSpliced', 'with',
        // String methods
        'charAt', 'charCodeAt', 'codePointAt', 'concat', 'endsWith', 'includes',
        'indexOf', 'lastIndexOf', 'localeCompare', 'match', 'matchAll', 'normalize',
        'padEnd', 'padStart', 'repeat', 'replace', 'replaceAll', 'search', 'slice',
        'split', 'startsWith', 'substring', 'substr', 'toLowerCase', 'toUpperCase',
        'toLocaleLowerCase', 'toLocaleUpperCase', 'trim', 'trimStart', 'trimEnd',
        'trimLeft', 'trimRight', 'valueOf', 'toString',
        // Object methods
        'assign', 'create', 'defineProperty', 'defineProperties', 'entries',
        'freeze', 'fromEntries', 'getOwnPropertyDescriptor', 'getOwnPropertyDescriptors',
        'getOwnPropertyNames', 'getOwnPropertySymbols', 'getPrototypeOf', 'hasOwn',
        'hasOwnProperty', 'is', 'isExtensible', 'isFrozen', 'isSealed', 'keys',
        'preventExtensions', 'propertyIsEnumerable', 'seal', 'setPrototypeOf',
        'values', 'valueOf', 'toString', 'toLocaleString',
        // Math
        'Math', 'abs', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atan2', 'atanh',
        'cbrt', 'ceil', 'clz32', 'cos', 'cosh', 'exp', 'expm1', 'floor', 'fround',
        'hypot', 'imul', 'log', 'log10', 'log1p', 'log2', 'max', 'min', 'pow',
        'random', 'round', 'sign', 'sin', 'sinh', 'sqrt', 'tan', 'tanh', 'trunc',
        'E', 'LN10', 'LN2', 'LOG10E', 'LOG2E', 'PI', 'SQRT1_2', 'SQRT2',
        // Number methods
        'isFinite', 'isInteger', 'isNaN', 'isSafeInteger', 'parseFloat', 'parseInt',
        'toExponential', 'toFixed', 'toPrecision', 'MAX_VALUE', 'MIN_VALUE',
        'MAX_SAFE_INTEGER', 'MIN_SAFE_INTEGER', 'NEGATIVE_INFINITY', 'POSITIVE_INFINITY',
        'EPSILON',
        // JSON
        'JSON', 'parse', 'stringify',
        // Date
        'Date', 'now', 'getDate', 'getDay', 'getFullYear', 'getHours', 'getMilliseconds',
        'getMinutes', 'getMonth', 'getSeconds', 'getTime', 'getTimezoneOffset',
        'getUTCDate', 'getUTCDay', 'getUTCFullYear', 'getUTCHours', 'getUTCMilliseconds',
        'getUTCMinutes', 'getUTCMonth', 'getUTCSeconds', 'setDate', 'setFullYear',
        'setHours', 'setMilliseconds', 'setMinutes', 'setMonth', 'setSeconds',
        'setTime', 'setUTCDate', 'setUTCFullYear', 'setUTCHours', 'setUTCMilliseconds',
        'setUTCMinutes', 'setUTCMonth', 'setUTCSeconds', 'toDateString', 'toISOString',
        'toJSON', 'toLocaleDateString', 'toLocaleString', 'toLocaleTimeString',
        'toTimeString', 'toUTCString',
        // RegExp
        'RegExp', 'exec', 'test', 'compile', 'source', 'flags', 'global', 'ignoreCase',
        'multiline', 'dotAll', 'unicode', 'sticky', 'lastIndex',
        // Promise
        'Promise', 'all', 'allSettled', 'any', 'race', 'resolve', 'reject', 'then',
        'catch', 'finally',
        // Set
        'Set', 'add', 'delete', 'has', 'clear', 'size', 'entries', 'forEach', 'keys',
        'values',
        // Map
        'Map', 'set', 'get', 'delete', 'has', 'clear', 'size', 'entries', 'forEach',
        'keys', 'values',
        // WeakSet, WeakMap
        'WeakSet', 'WeakMap',
        // Symbol
        'Symbol', 'for', 'keyFor', 'asyncIterator', 'hasInstance', 'isConcatSpreadable',
        'iterator', 'match', 'matchAll', 'replace', 'search', 'species', 'split',
        'toPrimitive', 'toStringTag', 'unscopables',
        // Reflect
        'Reflect', 'apply', 'construct', 'defineProperty', 'deleteProperty', 'get',
        'getOwnPropertyDescriptor', 'getPrototypeOf', 'has', 'isExtensible', 'ownKeys',
        'preventExtensions', 'set', 'setPrototypeOf',
        // Proxy
        'Proxy', 'revocable',
        // Global functions
        'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'decodeURI',
        'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape', 'unescape',
        // Error types
        'Error', 'EvalError', 'RangeError', 'ReferenceError', 'SyntaxError',
        'TypeError', 'URIError', 'AggregateError',
        // Typed Arrays
        'ArrayBuffer', 'SharedArrayBuffer', 'DataView', 'Int8Array', 'Uint8Array',
        'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array',
        'Float32Array', 'Float64Array', 'BigInt64Array', 'BigUint64Array',
        // Other built-ins
        'Array', 'Object', 'String', 'Number', 'Boolean', 'BigInt', 'Function',
        'Generator', 'GeneratorFunction', 'AsyncFunction', 'AsyncGenerator',
        'AsyncGeneratorFunction', 'Intl', 'WebAssembly',
        // Common properties
        'length', 'name', 'prototype', 'constructor', '__proto__',
        // Window/Global (for browser context)
        'window', 'document', 'navigator', 'location', 'history', 'screen',
        'localStorage', 'sessionStorage', 'setTimeout', 'setInterval', 'clearTimeout',
        'clearInterval', 'fetch', 'XMLHttpRequest', 'FormData', 'Blob', 'File',
        'FileReader', 'URL', 'URLSearchParams', 'atob', 'btoa', 'requestAnimationFrame',
        'cancelAnimationFrame'
      ];

      const suggestions = [
        // Add keywords only if IntelliSense is enabled
        ...(intelliSenseEnabled ? jsKeywords.map(keyword => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          detail: 'JavaScript keyword',
          range: range,
        })) : []),
        ...(intelliSenseEnabled ? jsMethods.map(method => ({
          label: method,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: method,
          detail: 'JavaScript built-in',
          range: range,
        })) : []),
        // Add JavaScript snippets only if Snippets are enabled
        ...(snippetsEnabled ? jsSnippets.map(snippet => createSnippetCompletionItem(snippet, monaco, range)) : [])
      ];

      return { suggestions };
    }
  });
  disposables.push(jsProvider);
};

/**
 * Setup function called when Monaco Editor is mounted
 * Initializes the editor with custom configurations and completion providers
 */
export const setupEditor = (
  editor: Monaco.editor.IStandaloneCodeEditor,
  monaco: typeof Monaco,
  intelliSenseEnabled: boolean = true,
  snippetsEnabled: boolean = true
) => {
  // Register all completion providers (will clear old ones first)
  registerCompletionProviders(monaco, intelliSenseEnabled, snippetsEnabled);
  
  return editor;
};
