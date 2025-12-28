import {
  View,
  Text,
  Image,
  StatusBar,
  TextInput,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

const Index = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8080/api/user/get-users");
      const data = await res.json();
      setList(data.users || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-orange-600">
      <StatusBar
        backgroundColor="#ea580c"
        barStyle="light-content"
        translucent={false}
      />

      <View className="bg-orange-600 px-4 py-3 flex-row items-center justify-between">
        <View className="w-10" />
        <Text className="text-white text-2xl font-bold">VC Lottery</Text>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1586787916646-467f8b881b3c?w=900&auto=format&fit=crop&q=60",
          }}
          className="w-10 h-10 rounded-full border-2 border-white"
        />
      </View>

      <View className="flex-1 bg-white rounded-t-2xl mt-2 px-4 py-4">
        <View className="px-3 py-3 border border-neutral-200 rounded-md flex-row items-center gap-x-2 mb-4">
          <Feather name="search" size={20} color="black" />
          <TextInput
            className="flex-1"
            placeholder="Search user"
            placeholderTextColor="black"
          />
        </View>

        {loading && list.length === 0 ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={list}
            keyExtractor={(item) => item?._id}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={fetchList} />
            }
            renderItem={({ item }) => (
              <View className="p-3 border border-neutral-200 rounded-md mb-2 flex-row gap-3">
                <View className="bg-neutral-300 rounded-full items-center justify-center w-14 h-14 border border-neutral-500">
                  <Text className="font-bold text-xl">
                    {item?.name?.charAt(0)}
                  </Text>
                </View>
                <View className="justify-center">
                  <Text className="text-base font-semibold">{item?.name}</Text>
                  <Text className="text-sm text-neutral-500">
                    Token Number : {item?.token}
                  </Text>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Index;
