import { useEffect, useState } from "react";

type FetchResult<T> = {
  loading: boolean;
  data: T | null;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
  error: string | null;
};

/**
 * @description A custom React hook for fetching data from a specified URL.
 * This hook manages the entire fetch lifecycle, including loading state, error handling, and data.
 * It uses AbortController to handle potential unmounting during the fetch operation.
 *
 * @param {Object} options - The options for the fetch operation.
 * @param {string} options.url - The URL to fetch data from.
 *
 * @returns {Object} An object containing:
 *   - loading: {boolean} Indicates if the fetch operation is in progress.
 *   - error: {string | null} Contains error message if fetch fails, null otherwise.
 *   - data: {T | null} The fetched data, null if not yet loaded or on error.
 *   - setData: {Function} A function to manually update the data state.
 *
 * @template T The expected type of the fetched data.
 *
 * @example
 * const { loading, error, response } = useFetch({ url: 'https://api.example.com/users' });
 */
const useFetch = <T>({ url }: { url: string }): FetchResult<T> => {
  const [data, setData] = useState<T | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const res = await fetch(url, { signal: abortController.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        setData(await res.json());
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!abortController.signal.aborted) setLoading(false);
      }
    };

    fetchData();
    return () => abortController.abort();
  }, [url]);

  return { loading, error, data, setData };
};

export default useFetch;
