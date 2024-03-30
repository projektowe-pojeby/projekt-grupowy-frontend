import { Link } from '@tanstack/react-router';
import $ from './post-list-item.module.scss';
import { Avatar } from '../../avatar/avatar';
import { getInitials } from '../../../utils/getInitials';
import { capitalize } from '../../../utils/capitalize';
import { Button } from '../../button/button';
import { HeartIcon } from '@radix-ui/react-icons';
import { StringWithParams } from '../../string/string';
import { STRINGS } from '../../../strings';
import { HeartFilledIcon } from '../../icons/heart-fillted';

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
}: Props) => (
    <article className={$.wrapper}>
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
        <h3 className={$.description}>{description}</h3>
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
        {/* TODO: Auth */}
        <Button variant="ghost" className={$.button} disabled>
            {isLiked ? (
                <HeartFilledIcon height={24} width={24} />
            ) : (
                <HeartIcon height={24} width={24} />
            )}
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
    </article>
);