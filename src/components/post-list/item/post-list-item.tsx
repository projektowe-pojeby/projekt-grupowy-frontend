import { Link } from '@tanstack/react-router';
import $ from './post-list-item.module.scss';
import { Avatar } from '../../avatar/avatar';
import { getInitials } from '../../../utils/getInitials';
import { capitalize } from '../../../utils/capitalize';
import { Button } from '../../button/button';
import { StringWithParams } from '../../string/string';
import { STRINGS } from '../../../strings';
import { RelativeDate } from '../../relative-date/relative-date';
import { Dropdown, DropdownItem } from '../../dropdown/dropdown';
import { Expand, Heart, Pencil, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { useUserContext } from '../../../context/user-context';
import { useNavigate } from '@tanstack/react-router';
import { useSetLike } from '../../../api/posts/like/use-set-like';

interface Props {
    imageSrc: string;
    description: string | null;
    id: number;
    likes: number;
    isLiked: boolean | null;
    authorName: string;
    authorId: number;
    createdAt: string;
}

export const PostListItem = ({
    imageSrc,
    id,
    description,
    likes,
    isLiked,
    authorName,
    createdAt,
    authorId,
}: Props) => {
    const user = useUserContext();
    const navigate = useNavigate();

    const { mutateAsync: setLike, isPending: isPendingSetLike } = useSetLike({
        id,
    });

    const items = useMemo<DropdownItem[]>(() => {
        if (!user)
            return [
                {
                    id: 'expand',
                    text: 'Expand',
                    icon: <Expand />,
                    onClick: () =>
                        navigate({
                            to: `/posts/$postId`,
                            params: {
                                postId: id.toString(),
                            },
                        }),
                },
            ];

        const defaultItems = [
            {
                id: 'like',
                text: isLiked ? 'Remove Like' : 'Like',
                icon: <Heart fill={isLiked ? 'white' : 'transparent'} />,
                onClick: () => setLike({ like: !isLiked }),
                disabled: isPendingSetLike,
            },
            {
                id: 'expand',
                text: 'Expand',
                icon: <Expand />,
                onClick: () =>
                    navigate({
                        to: `/posts/$postId`,
                        params: {
                            postId: id.toString(),
                        },
                    }),
            },
        ];

        if (user.id !== authorId) return defaultItems;

        return [
            ...defaultItems,
            {
                id: 'edit',
                text: 'Edit',
                icon: <Pencil />,
                onClick: () => {
                    // TODO
                    console.log('Edit');
                },
            },
            {
                id: 'delete',
                text: 'Delete',
                icon: <Trash2 />,
                onClick: () => {
                    // TODO
                    console.log('Delete');
                },
            },
        ];
    }, [authorId, id, isLiked, navigate, setLike, user, isPendingSetLike]);

    return (
        <article className={$.wrapper}>
            <div className={$.header}>
                <Link
                    to="/users/$userId"
                    params={{
                        userId: authorId.toString(),
                    }}
                    className={$.author}
                >
                    <Avatar initials={getInitials(authorName)} />
                    {capitalize(authorName)}
                </Link>

                <Dropdown items={items} />
            </div>
            <h2 className={$.description}>{description}</h2>
            <Link
                to={`/posts/$postId`}
                params={{
                    postId: id.toString(),
                }}
                className={$.imageWrapper}
            >
                <img
                    src={imageSrc}
                    alt={description ?? 'Post image'}
                    className={$.image}
                />
            </Link>
            <div className={$.bottomWrapper}>
                <Button
                    variant="ghost"
                    className={$.button}
                    disabled={!user || isPendingSetLike}
                    onClick={() => setLike({ like: !isLiked })}
                >
                    <Heart size="20" fill={isLiked ? 'white' : 'transparent'} />

                    <StringWithParams
                        value={
                            likes === 1
                                ? STRINGS.LIKED_BY_SINGLE
                                : STRINGS.LIKED_BY_MANY
                        }
                        params={{
                            likes: likes.toString(),
                        }}
                    />
                </Button>
                <RelativeDate className={$.createdDate} date={createdAt} />
            </div>
        </article>
    );
};
