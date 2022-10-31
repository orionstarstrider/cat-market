import { useEffect, useState } from "react";
import {useSnackbar} from "notistack";

interface UseFetchConfig<K = any> {
  method?: 'GET' | 'POST';
  params?: K;
  skip?: boolean;
}

interface UseFetchResp<T> {
  loading: boolean;
  data: T;
  errors: string | string[] | null;
}

const baseUrl = process.env.REACT_APP_API_URL;

const useFetch = <T = any, K = any>(
  resource: string,
  config?: UseFetchConfig<K>
): UseFetchResp<T | null> => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [errors, setErrors] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const jsonData = await fetch(`${baseUrl}${resource}`, {
          method: config?.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: config?.method === 'POST' && config?.params ? JSON.stringify(config.params) : undefined,
        });

        const parsedData = await jsonData.json();

        setData(parsedData);
      } catch (error) {
        const { message } = error as { message: string };
        setErrors(message);
        enqueueSnackbar(message, { variant: 'error' });
      }

      setLoading(false);
    };

    if (!config?.skip) {
      fetchData();
    }
  }, [resource, config?.method, config?.params, config?.skip, enqueueSnackbar]);

  return {
    loading,
    data,
    errors,
  }
}

export default useFetch;
