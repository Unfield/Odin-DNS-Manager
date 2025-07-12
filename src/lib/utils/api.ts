import { PUBLIC_API_BASE_URL } from "$env/static/public";
import { type HttpError, defaultHttpError } from "./httpError";

interface RequestOptions extends RequestInit {
  returnType?: "json" | "text" | "blob" | "arrayBuffer";
}

/**
 * Makes an HTTP request and returns a Go-like tuple: [data, error].
 * Allows specifying types for both success data and error data.
 *
 * @param endpoint The API endpoint (e.g., "/users", "/products/123").
 * @param options Request options (method, headers, body, etc.).
 * @returns A Promise that resolves to an array: [TData | null, HttpError<TError> | null].
 *          TData: The expected type of the successful response data.
 *          TError: The expected type of the error payload from the server when response.ok is false.
 */
export async function fetchApi<TData, TError = any>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<[TData | null, HttpError<TError> | null]> {
  const url = `${PUBLIC_API_BASE_URL}${endpoint}`;
  const { returnType = "json", ...fetchOptions } = options;

  try {
    const response = await fetch(url, fetchOptions);

    const parseResponse = async (
      response: Response,
      type: RequestOptions["returnType"],
    ) => {
      switch (type) {
        case "json":
          return (await response.json()) as TData;
        case "text":
          return (await response.text()) as TData;
        case "blob":
          return (await response.blob()) as TData;
        case "arrayBuffer":
          return (await response.arrayBuffer()) as TData;
        default:
          return (await response.json()) as TData;
      }
    };

    if (!response.ok) {
      let errorData: TError | null = null;
      let errorMessage: string | undefined;

      try {
        errorData = (await response.json()) as TError;
        errorMessage = (errorData as any)?.message;
      } catch (e) {
        console.warn(
          `Could not parse error response for ${url} as JSON. Attempting as text.`,
        );
        try {
          const textError = await response.text();
          errorData = textError as TError;
          errorMessage = textError;
        } catch (textParseError) {
          console.warn(
            `Could not parse error response for ${url} as text either.`,
          );
          errorMessage = response.statusText;
        }
      }

      return [
        null,
        {
          status: response.status,
          statusText: response.statusText,
          message:
            errorMessage || response.statusText || "An unknown error occurred",
          data: errorData,
          url: url,
        },
      ];
    }

    const data = await parseResponse(response, returnType);
    return [data, null];
  } catch (error) {
    console.error("Fetch request failed:", error);
    return [null, defaultHttpError(error, url)];
  }
}
