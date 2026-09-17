import { clearUser } from "@/store/auth/actions";
import { API, normalizeResponseInterceptor, jwtRefreshTokenInterceptor, jwtTokenRequestInterceptor, customResponseInterceptor } from "@forever/api"

const NOT_AGAIN_REQUEST_ENDPOINTS_PATH = ['/api/user/reset-password', '/api/auth/refresh'];

const api = new API(import.meta.env.VITE_REACT_API_URL);

api.initInterceptors({
  reqInterceptors: [jwtTokenRequestInterceptor()],
  resInterceptors: [
    normalizeResponseInterceptor,
    customResponseInterceptor(
      (response) => response,
      async (error) => {
        if (error.response && error.response.data instanceof ReadableStream) {
          try {
            error.response.data = await new Response(error.response.data).json();
          } catch {
            error.response.data = {
              error: {
                createdAt: new Date(),
                errorMessage: "An error occurred while parsing the stream",
                hostName: typeof window !== 'undefined' ? window.location.hostname : "unknown",
                path: error.config?.url || ""
              }
            };
          }
        }
        return Promise.reject(error);
      }
    ),
    jwtRefreshTokenInterceptor({
      apiInstance: api.instance,
      notAgainRequestEndpointsPath: NOT_AGAIN_REQUEST_ENDPOINTS_PATH,
      logoutAction: () => {
        clearUser()
        window.location.href = "/auth"
      }
    })]
})

export default api.instance;