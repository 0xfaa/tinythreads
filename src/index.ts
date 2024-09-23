type AnyFunction = (...args: any[]) => any

const workerCode = `
  self.onmessage = async ({ data: { fn, args } }) => {
    try {
      const result = await (0, eval)('(' + fn + ')')(...args);
      self.postMessage({ result });
    } catch (error) {
      self.postMessage({ error: error.message });
    }
  };
`;

const createWorker = () => {
  const worker = new Worker(URL.createObjectURL(new Blob([workerCode], { type: 'application/javascript' })))
  return (fn: string, args: any[]) =>
    new Promise((resolve, reject) => {
      worker.onmessage = ({ data }) => {
        if (data.error) reject(new Error(data.error))
        else resolve(data.result)
        worker.terminate()
      }
      worker.postMessage({ fn, args })
    })
}

/**
 * Runs a function in a separate thread using a Web Worker.
 * 
 * @template T - The type of the function to be run in a separate thread.
 * @param {T} fn - The function to be executed in a separate thread.
 *                 This function must be serializable (i.e., it can't close over any variables from its outer scope).
 * @returns {(...args: Parameters<T>) => Promise<ReturnType<T>>} A function that takes the same arguments as the input function
 *          and returns a Promise that resolves with the result of the function execution.
 * 
 * @example
 * const heavyTask = (n: number) => {
 *   let sum = 0;
 *   for (let i = 0; i < n; i++) sum += i;
 *   return sum;
 * };
 * 
 * run(heavyTask)(1000000000)
 *   .then(result => console.log('Task result:', result))
 *   .catch(error => console.error('Task error:', error));
 * 
 * @throws {Error} If the worker encounters an error during execution.
 */
const run = <T extends AnyFunction>(fn: T) => (...args: Parameters<T>): Promise<ReturnType<T>> => {
  const execute = createWorker()
  return (execute(fn.toString(), args) as Promise<ReturnType<T>>)
}

export { run }

