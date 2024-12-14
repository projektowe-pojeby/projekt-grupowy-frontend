import { AddressSearch } from '@/components/address-search';
import { FilterPanel, PostSearchFormModel } from '@/components/filter-panel';
import { WallLayout } from '@/layouts/wall';
import { getFiltersSearchParams } from '@/lib/get-search-url-params';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { Suspense, useMemo } from 'react';
import { NewestSalePostsConnector } from './connectors/newest-sale-posts-connector';
import { NewestRentalPostsConnector } from './connectors/newest-rental-posts-connector';
import { Loader } from '@/components/loader/loader';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/user-context';
import { FavoritePostsConnector } from './connectors/favorite-posts-connector';
import { MyPostsConnector } from './connectors/my-posts-connector';

const STRINGS = {
    WHAT_ARE_YOU_LOOKING_FOR: 'What are you looking for?',
    NEWEST_SALE_OFFERS: 'Newest sale offers',
    NEWEST_RENTAL_OFFERS: 'Newest rental offers',
    MY_FAVORITES: 'My favorites',
    MY_OFFERS: 'My offers',
    VIEW_ALL: 'View all',
};

export const HomePage = () => {
    const user = useUserContext();
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: Record<string, any> = useSearch({
        strict: false,
    });

    const parsedParams = useMemo(
        () => getFiltersSearchParams(params),
        [params],
    );

    const onSubmit = (data: PostSearchFormModel) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newSearch: Record<string, any> = data;
        !newSearch.search && delete newSearch.search;

        if (params.mapboxId) newSearch.mapboxId = params.mapboxId;
        if (params.distance) newSearch.distance = params.distance;

        navigate({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            search: newSearch as any,
            to: '/search',
        });
    };

    const onClear = () =>
        navigate({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            search: {} as any,
        });

    return (
        <WallLayout>
            <div className="flex flex-col items-center w-full py-12 gap-8">
                <div className="flex flex-col container border p-4 rounded-lg">
                    <h1 className="text-3xl font-semibold tracking-tight p-4">
                        {STRINGS.WHAT_ARE_YOU_LOOKING_FOR}
                    </h1>
                    <AddressSearch />
                    <FilterPanel
                        onClear={onClear}
                        onSubmit={onSubmit}
                        defaultValues={parsedParams}
                        className="px-4 pb-2"
                    />
                </div>

                <div className="container border p-8 rounded-lg">
                    <div className="w-full flex justify-between items-center pb-7">
                        <h2 className="text-3xl font-semibold tracking-tight">
                            {STRINGS.NEWEST_SALE_OFFERS}
                        </h2>

                        <Button variant="link" asChild>
                            <Link
                                to="/search"
                                search={{
                                    type: 'SALE',
                                }}
                            >
                                {STRINGS.VIEW_ALL}
                            </Link>
                        </Button>
                    </div>
                    <Suspense
                        fallback={
                            <div className="w-full flex justify-center items-center">
                                <Loader />
                            </div>
                        }
                    >
                        <NewestSalePostsConnector />
                    </Suspense>
                </div>

                <div className="container border p-8 rounded-lg">
                    <div className="w-full flex justify-between items-center pb-7">
                        <h2 className="text-3xl font-semibold tracking-tight">
                            {STRINGS.NEWEST_RENTAL_OFFERS}
                        </h2>

                        <Button variant="link" asChild>
                            <Link
                                to="/search"
                                search={{
                                    type: 'RENTAL',
                                }}
                            >
                                {STRINGS.VIEW_ALL}
                            </Link>
                        </Button>
                    </div>
                    <Suspense
                        fallback={
                            <div className="w-full flex justify-center items-center">
                                <Loader />
                            </div>
                        }
                    >
                        <NewestRentalPostsConnector />
                    </Suspense>
                </div>

                {user && (
                    <div className="container border p-8 rounded-lg">
                        <div className="w-full flex justify-between items-center pb-7">
                            <h2 className="text-3xl font-semibold tracking-tight">
                                {STRINGS.MY_FAVORITES}
                            </h2>

                            <Button variant="link" asChild>
                                <Link to="/favorites">{STRINGS.VIEW_ALL}</Link>
                            </Button>
                        </div>
                        <Suspense
                            fallback={
                                <div className="w-full flex justify-center items-center">
                                    <Loader />
                                </div>
                            }
                        >
                            <FavoritePostsConnector />
                        </Suspense>
                    </div>
                )}

                {user && (
                    <div className="container border p-8 rounded-lg">
                        <div className="w-full flex justify-between items-center pb-7">
                            <h2 className="text-3xl font-semibold tracking-tight">
                                {STRINGS.MY_OFFERS}
                            </h2>

                            <Button variant="link" asChild>
                                <Link to="/my-posts">{STRINGS.VIEW_ALL}</Link>
                            </Button>
                        </div>
                        <Suspense
                            fallback={
                                <div className="w-full flex justify-center items-center">
                                    <Loader />
                                </div>
                            }
                        >
                            <MyPostsConnector />
                        </Suspense>
                    </div>
                )}
            </div>
        </WallLayout>
    );
};
