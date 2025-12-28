import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";

const Profile = () => {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [town, setTown] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const id = await SecureStore.getItemAsync("userId");
      setUserId(id);
    };
    loadUser();
  }, []);

  const updateProfile = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const res = await fetch("http://YOUR_IP:8080/api/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          name,
          mobile,
          town,
          address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.message || "Update failed");
        return;
      }

      Alert.alert("Success", "Profile updated successfully");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("userId");
    await SecureStore.deleteItemAsync("token");
    Alert.alert("Logged out");
  };

  return (
    <SafeAreaView className="flex-1 bg-orange-600">
      <StatusBar
        backgroundColor="#ea580c"
        barStyle="light-content"
        translucent={false}
      />

      <View className="bg-orange-600 px-4 py-3 items-center">
        <Text className="text-white text-2xl font-bold">Profile</Text>
      </View>

      <View className="flex-1 bg-white rounded-t-2xl mt-2 px-4 py-6">
        <TextInput
          className="border border-neutral-300 rounded-md px-3 py-3 mb-4"
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          className="border border-neutral-300 rounded-md px-3 py-3 mb-4"
          placeholder="Mobile"
          keyboardType="number-pad"
          value={mobile}
          onChangeText={setMobile}
        />

        <TextInput
          className="border border-neutral-300 rounded-md px-3 py-3 mb-4"
          placeholder="Town"
          value={town}
          onChangeText={setTown}
        />

        <TextInput
          className="border border-neutral-300 rounded-md px-3 py-3 mb-6"
          placeholder="Address"
          multiline
          value={address}
          onChangeText={setAddress}
        />

        <TouchableOpacity
          onPress={updateProfile}
          disabled={loading}
          className="bg-orange-600 py-3 rounded-md mb-4 items-center"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">
              Update Profile
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={logout}
          className="border border-red-500 py-3 rounded-md items-center"
        >
          <Text className="text-red-600 font-semibold text-lg">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
