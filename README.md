# TinyThreads

TinyThreads is a lightweight, easy-to-use library for running functions in separate threads in JavaScript and TypeScript. It provides a simple API to offload CPU-intensive tasks to Web Workers, improving your application's performance and responsiveness.

## Features

- 🚀 Simple API for running functions in separate threads
- 🔄 Automatic worker lifecycle management
- 📦 Tiny footprint (less than 1KB minified and gzipped)
- 📘 Full TypeScript support

## Installation

```bash
npm install tinythreads
```

or

```bash
bun add tinythreads
```

## Usage

```typescript
import { run } from 'tinythreads';

// Define a CPU-intensive task
const heavyTask = (n: number) => {
  let sum = 0;
  for (let i = 0; i < n; i++) sum += i;
  return sum;
};

// Run the task in a separate thread
console.log('Starting task...');
run(heavyTask)(1000000000)
  .then(result => console.log('Task result:', result))
  .catch(error => console.error('Task error:', error))
  .finally(() => console.log('Task completed'));

// The main thread remains responsive
console.log('Main thread is not blocked!');
```

## API

### `run<T extends (...args: any[]) => any>(fn: T) => (...args: Parameters<T>) => Promise<ReturnType<T>>`

The `run` function takes a function as an argument and returns a new function that, when called, executes the original function in a separate thread.

- `fn`: The function to be executed in a separate thread.
- Returns: A function that takes the same arguments as `fn` and returns a Promise that resolves with the result of `fn`.

## Notes

- The function passed to `run` must be serializable (i.e., it can't close over any variables from its outer scope).
- Web Workers are used under the hood, so this library works in browsers and environments that support Web Workers.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
