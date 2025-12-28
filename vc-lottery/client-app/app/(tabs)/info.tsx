import { View, Text, StatusBar, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Info = () => {
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWinner = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8080/api/schedule/result");
      const data = await res.json();
      setWinner(data?.winner || null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinner();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-orange-600">
      <StatusBar
        backgroundColor="#ea580c"
        barStyle="light-content"
        translucent={false}
      />

      <View className="bg-orange-600 px-4 py-3 flex-row items-center justify-center">
        <Text className="text-white text-2xl font-bold">
          Winner Announcement
        </Text>
      </View>

      <View className="flex-1 bg-white rounded-t-2xl mt-2 items-center justify-center px-6">
        {loading ? (
          <ActivityIndicator size="large" />
        ) : winner ? (
          <View className="items-center gap-4 p-6 border border-neutral-200 rounded-2xl shadow-sm w-full">
            <Text className="text-lg text-neutral-500">
              🎉 Congratulations 🎉
            </Text>
            <Text className="text-3xl font-bold text-orange-600 text-center">
              {winner.name}
            </Text>
            <Text className="text-base text-neutral-600">
              Token Number : {winner.token}
            </Text>
          </View>
        ) : (
          <Text className="text-neutral-500 text-lg">
            Winner not declared yet
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Info;
