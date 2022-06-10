import myAxios from './axios';
import {useAuthHeader, createRefresh} from 'react-auth-kit';

const refreshApi = createRefresh({
  interval: 1,   // Refreshs the token in every 10 minutes
  refreshApiCallback: (
    {
      authToken,
      authTokenExpireAt,
      refreshToken,
      refreshTokenExpiresAt,
      authUserState
    }) => {
      console.log("entra")
      myAxios('configuration').post('Users/refresh-token', {
        refreshToken: refreshToken,
        oldAuthToken: authToken
      }).then(res=>{
        console.log("res",res.status);
        if(res.status >= 200 && res.status < 300){
          return {
            isSuccess: true,  // For successful network request isSuccess is true
            newAuthToken: res.data.jwtToken.token,
            newAuthTokenExpireIn: res.data.jwtToken.expiresIn,
            newRefreshToken: res.data.jwtToken.refreshToken,
            newRefreshTokenExpiresIn: res.data.jwtToken.refreshTokenExpireIn
            // You can also add new refresh token ad new user state
          }
        }
      }).catch(error=>{
        console.error(error)
        return {
          isSuccess:false // For unsuccessful network request isSuccess is false
        }
      });

      return {
        isSuccess:false // For unsuccessful network request isSuccess is false
      }
  }
})

export default refreshApi
