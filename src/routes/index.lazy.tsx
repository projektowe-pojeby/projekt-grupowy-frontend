import { HomePage } from '../pages/home/home';
import { ErrorPage } from '../pages/error';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
    component: HomePage,
    errorComponent: ErrorPage,
});
