import { AxiosError, AxiosResponse } from 'axios';
import { IHttpResponsesHandler } from './http-responses-handler';

/**
 * Provides basic functionality to handle an asynchronous request to a server
 */
export abstract class BaseApiService {
    readonly url: string = '';

    protected handleRequest<TResult>(
        request: Promise<AxiosResponse<TResult>>,
        responseHandler?: IHttpResponsesHandler,
    ): Promise<TResult> {
        if (responseHandler) {
            return request
                .then((x: AxiosResponse<TResult>) => {
                    if (responseHandler.handleSuccess) {
                        responseHandler.handleSuccess();
                    }
                    return Promise.resolve(x.data);
                })
                .catch((errorResponse: AxiosError) => {
                    if (responseHandler.handleError) {
                        responseHandler.handleError(errorResponse);
                    }
                    return Promise.reject(errorResponse);
                });
        } else {
            return request.then((x) => x.data);
        }
    }
}
