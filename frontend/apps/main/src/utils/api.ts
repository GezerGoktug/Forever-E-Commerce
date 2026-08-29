import { clearUser } from "@/store/auth/actions";
import { API, normalizeResponseInterceptor, jwtRefreshTokenInterceptor, jwtTokenRequestInterceptor } from "@forever/api"

const NOT_AGAIN_REQUEST_ENDPOINTS_PATH = ['/api/user/reset-password', '/api/auth/refresh'];

const api = new API(import.meta.env.VITE_REACT_API_URL);

api.initInterceptors({
  reqInterceptors: [jwtTokenRequestInterceptor()],
  resInterceptors: [
    normalizeResponseInterceptor,
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