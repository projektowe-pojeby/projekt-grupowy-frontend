import { LinkPlugin } from '@udecode/plate-link/react';
import { LinkFloatingToolbar } from '../../plate-ui/link-floating-toolbar';

export const linkPlugin = LinkPlugin.configure({
    render: { afterEditable: () => <LinkFloatingToolbar /> },
});
