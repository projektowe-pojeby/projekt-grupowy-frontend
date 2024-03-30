import { useSuspenseQuery } from '@tanstack/react-query';
import { QueryKeys } from '../query-keys';
import { Response } from '../models/response';
import { Post } from '../models/post';
import { Endpoints } from '../endpoints';
import {
    fetchErrorResponse,
    unknownErrorResponse,
} from '../erorrs/error-responses';
import { callApi } from '../callApi';

interface Params {
    id: number;
}

export const usePost = ({ id }: Params) => {
    return useSuspenseQuery<Response<Post>>({
        queryKey: [QueryKeys.POSTS, id],
        queryFn: async ({ signal }) => {
            try {
                const response = await callApi(Endpoints.POST, {
                    params: { id: id.toString() },
                    signal,
                });

                return response.json();
            } catch (error) {
                if (error instanceof Error) {
                    return fetchErrorResponse(error.message);
                }

                return unknownErrorResponse;
            }
        },
    });
};