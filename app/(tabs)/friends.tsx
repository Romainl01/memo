import { EmptyFriendsScreen } from "@/src/features/friends";

/**
 * Friends tab - shows empty state when no friends added
 */
export default function FriendsScreen() {
  // TODO: Check if user has friends, show list or empty state
  const hasFriends = false;

  if (!hasFriends) {
    return <EmptyFriendsScreen />;
  }

  // Future: return <FriendsList />
  return <EmptyFriendsScreen />;
}
