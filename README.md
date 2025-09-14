JavaScript ES6 Basics – Q & A

1) Difference between var, let, and const

var: Old way to declare variables, function-scoped, can be updated and re-declared.

let: Block-scoped, can be updated but cannot be re-declared in the same scope.

const: Block-scoped, must have a value when declared, cannot be reassigned (but objects/arrays inside can be changed).

2) Difference between map(), forEach(), and filter()

forEach(): Loops through array items, does something for each, does not return a new array.

map(): Loops through array and returns a new array with transformed items.

filter(): Loops through array and returns a new array with items that meet a condition.

3) Arrow Functions in ES6

Shorter way to write functions using =>.

Does not create its own this, uses this from surrounding context.

Cleaner syntax, especially for simple functions.

4) Destructuring Assignment in ES6

Lets you extract values from arrays or objects into variables quickly.

Example: Pulling multiple values at once instead of accessing each one individually.

Works with arrays ([first, second]) and objects ({name, age}).

5) Template Literals in ES6

Strings wrapped in backticks ` instead of quotes.

Can include variables inside using ${variable}.

Supports multi-line strings easily.

Different from string concatenation because it is cleaner and easier to read, especially with variables and multiple lines.