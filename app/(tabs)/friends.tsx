import { useCallback } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";
import { EmptyFriendsScreen, FriendsList } from "@/src/features/friends";
import { GlassButton } from "@/src/components/GlassButton";
import { useContacts } from "@/src/hooks/useContacts";
import { useFriendsStore } from "@/src/stores/friendsStore";
import { colors } from "@/src/constants/colors";
import { typography } from "@/src/constants/typography";

/**
 * Friends tab - shows list of friends or empty state
 * Handles the add friend flow: native contact picker → modal sheet
 */
export default function FriendsScreen() {
  const insets = useSafeAreaInsets();
  const friends = useFriendsStore((state) => state.friends);
  const hasFriend = useFriendsStore((state) => state.hasFriend);
  const setPendingContact = useFriendsStore((state) => state.setPendingContact);
  const { pickContact, isPicking, permissionStatus } = useContacts();

  const handleAddFriend = useCallback(async () => {
    if (isPicking) return;

    const contact = await pickContact();

    if (!contact) {
      if (permissionStatus === "denied") {
        Alert.alert(
          "Contacts Access Required",
          "Please enable contacts access in Settings to add friends.",
          [{ text: "OK" }]
        );
      }
      return;
    }

    if (hasFriend(contact.name)) {
      Alert.alert(
        "Already Added",
        `${contact.name} is already in your friends list.`,
        [{ text: "OK" }]
      );
      return;
    }

    // Set pending contact in store and navigate to modal
    setPendingContact(contact);
    router.push("/add-friend");
  }, [pickContact, isPicking, permissionStatus, hasFriend, setPendingContact]);

  const hasFriends = friends.length > 0;

  // Show empty state
  if (!hasFriends) {
    return (
      <View style={styles.root}>
        <EmptyFriendsScreen onAddFriend={handleAddFriend} />
      </View>
    );
  }

  // Show friends list
  return (
    <View style={styles.root}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Pia</Text>
          <GlassButton
            onPress={handleAddFriend}
            size={40}
            icon={
              <SymbolView
                name="plus"
                size={22}
                weight="semibold"
                tintColor={colors.primary}
              />
            }
            testID="add-friend-button"
          />
        </View>

        <FriendsList />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  title: {
    ...typography.titleH1,
    color: colors.neutralDark,
  },
});
