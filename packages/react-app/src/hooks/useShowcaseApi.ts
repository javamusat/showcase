import { useContext } from "react";
import axios from "axios";
import { ShowcaseApiContext } from "../context/ShowcaseApiProvider";
import { ShowcaseContext } from "../context/ShowcaseProvider";
import { FirebaseContext } from "../context/FirebaseProvider";

const authHandler = (result: any, dispatch: any = {}) => {
  if ([200, 201].includes(result.status)) {
    return dispatch.dispatchOd({
      type: "setJWT",
      jwt: result.data,
      existingAccount: result.status === 200,
      loginFailed: false,
    });
  }
  return dispatch.dispatchOd({
    type: "setJWT",
    jwt: null,
    existingAccount: false,
    loginFailed: true,
  });
};

const BASE_URI: string = `${process.env.REACT_APP_API_URI}/v1/`;
const METHODS: any = {
  auth: ["auth", authHandler],
  user: ["user", null],
  // getCards: 'cards/'
};

const paramBuilder = (params: string[]) => params.join("/");
const queryParamBuilder = (queryParams: string[]) =>
  queryParams.length ? `?${queryParams.join("&")}` : "";

const useShowcaseApi = () => {
  const [apiData, dispatchApi] = useContext(ShowcaseApiContext);
  const [showcase, dispatchOd] = useContext(ShowcaseContext);
  const [firebase, dispatchFb] = useContext(FirebaseContext);

  const fetchDataFromApi = async (
    method: string,
    body: any = null,
    params: string[] = [],
    queryParams: string[] = []
  ) => {
    if (apiData[method] && apiData[method] === "pending") {
      return;
    }

    const authorization = method === "auth" ? firebase.user.za : showcase.jwt;
    try {
      dispatchApi({
        method,
        data: "pending",
      });

      const result = body
        ? await axios.post(
            `${BASE_URI}${METHODS[method][0]}${paramBuilder(
              params
            )}${queryParamBuilder(queryParams)}`,
            body,
            {
              headers: {
                Authorization: "Bearer " + authorization,
              },
            }
          )
        : await axios.get(
            `${BASE_URI}${METHODS[method][0]}${paramBuilder(
              params
            )}${queryParamBuilder(queryParams)}`,
            {
              headers: {
                Authorization: "Bearer " + authorization,
              },
            }
          );

      if (METHODS[method][1]) {
        METHODS[method][1](result, { dispatchOd, dispatchFb });
      }

      const action = {
        method,
        data: result,
      };

      dispatchApi(action);
    } catch (err) {
      if (METHODS[method][1]) {
        METHODS[method][1]({ status: err.status }, { dispatchOd, dispatchFb });
      }
      dispatchApi({
        method,
        data: "failed",
      });
    }
    return;
  };

  return {
    apiData,
    fetchApiData: (
      method: string,
      body?: any,
      params?: string[],
      queryParams?: string[]
    ) => fetchDataFromApi(method, body, params, queryParams),
  };
};

export default useShowcaseApi;
