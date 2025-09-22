export const codeTemplates: Record<string, string> = {
  python: `# Write your Python code here\nprint("Hello, World!")`,
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  javascript: `// Write your JavaScript code here
console.log("Hello, World!");`,
  typescript: `// Write your TypeScript code here
const greet: string = "Hello, World!";
console.log(greet);`,
};
